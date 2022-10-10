from collections import defaultdict
from django.conf import settings
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django_filters.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework import generics
from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.response import Response
from coder.api.document_cleaner import to_coding_doc
# from rest_framework import generics
import logging

from coder.api.models import (
    Assignment,
    AssignmentType,
    Coding,
    CodingInstance,
    Policy,
    PolicyInstance,
    Project,
    RawPolicyInstance,
    TimingSession,
)
from coder.api.serializers import (
    AssignmentSerializer,
    AssignmentTypeSerializer,
    CodingInstanceSerializer,
    CodingSerializer,
    PolicyInstanceSerializer,
    PolicySerializer,
    PolicyInstanceInfoSerializer,
    PolicyInstanceDocumentSerializer,
    ProjectSerializer,
    RawPolicyInstanceSerializer,
    TimingSessionSerializer,
)


def _get_requested_project_prefix(request):
    path = request.path.split('/')
    project_prefix = path[2]
    return project_prefix


def _get_project_id(request):
    project_prefix = _get_requested_project_prefix(request)
    return Project.objects.get(prefix=project_prefix).id


class GroupPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.email:
            return False
        has_api_access = request.user.groups.filter(name="API_ACCESS").exists()
        project_name = _get_requested_project_prefix(request)
        has_project_access = request.user.groups.filter(
            name=f"PROJECT__{project_name}").exists()
        if not has_api_access or not has_project_access:
            print(
                f"{request.user} does not have permission to access {project_name}."
                f"Has API access: {has_api_access}, Has project access: {has_project_access}"
            )
            return False
        return True

    def has_object_permission(self, request, view, obj):
        project_id = _get_project_id(request)
        if type(obj) == Project:
            has_project_access = project_id == obj.id
        else:
            has_project_access = project_id == obj.project
        if not has_project_access:
            print(
                f"{request.user} does not have permission to access {type(obj)} {obj} in project {project_id}.\n"
                f"Has project access for object: {has_project_access}"
            )
            return False
        return has_project_access
        # if request.method in permissions.SAFE_METHODS:
        #     return True
        # # some sort of ORM test
        # return obj.owner == request.user


class ProjectFilteredViewSet(viewsets.ModelViewSet):
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(
            self.get_queryset().filter(project=_get_project_id(request)))

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class AssignmentViewSet(ProjectFilteredViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [GroupPermission]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id']


class ProjectViewSet(ProjectFilteredViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [GroupPermission]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id']
    lookup_field = "prefix"


class AssignmentTypeViewSet(ProjectFilteredViewSet):
    queryset = AssignmentType.objects.all()
    serializer_class = AssignmentTypeSerializer
    permission_classes = [GroupPermission]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id']


class CodingViewSet(ProjectFilteredViewSet):
    queryset = Coding.objects.all()
    serializer_class = CodingSerializer
    permission_classes = [GroupPermission]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id', 'parent', 'created_dt']


class PolicyViewSet(ProjectFilteredViewSet):
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer
    permission_classes = [GroupPermission]
    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = [
        'id', 'company_name', 'site_name', 'alexa_rank',
        'start_date', 'end_date', 'last_scan_dt', 'scan_count'
    ]
    search_fields = ['company_name', 'site_name']


class CodingInstanceViewSet(ProjectFilteredViewSet):
    queryset = CodingInstance.objects.all()
    serializer_class = CodingInstanceSerializer
    permission_classes = [GroupPermission]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id', 'coder_email',
                        'policy_instance_id', 'coding_id', 'created_dt']

    def create(self, validated_data, **kw):
        instance = CodingInstance.objects.filter(
            coder_email=validated_data.data['coder_email'],
            coding_id=validated_data.data['coding_id'],
            policy_instance_id=validated_data.data['policy_instance_id'],

        ).first()  # uniqueness avoids needs for limit
        if instance:
            instance.coding_values = validated_data.data['coding_values']
        else:
            instance = CodingInstance.objects.create(
                project=_get_project_id(validated_data),
                **validated_data.data
            )
        instance.save()
        return Response(CodingInstanceSerializer(instance).data)


class PolicyInstanceViewSet(ProjectFilteredViewSet):
    queryset = PolicyInstance.objects.all()
    serializer_class = PolicyInstanceSerializer
    permission_classes = [GroupPermission]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id', 'policy_id', 'scan_dt']

    def create(self, request, project_id):
        instance = PolicyInstance(
            policy_id=request.data['policy_id'],
            content=[],
            project=_get_project_id(request),
        )
        instance.save()
        return Response(PolicyInstanceSerializer(instance).data)


class PolicyInstanceDocumentViewSet(viewsets.ViewSet):
    """
    PolicyInstance objects have a "content" field that is a JSON list 
    of PolicyInstanceDocument objects, each of which has three fields: title, content, 
    and ordinal.

    The content of a PolicyInstanceDocument is provided as html object, which this
    module converts into a list of PolicyInstanceDocumentParagraph objects using the
    to_coding_doc document cleaning utility.

    Document ordinals are assigned sequentially, starting with "A". Document titles are 
    prepended with the ordinal, e.g. "DOCUMENT A - <title>"

    This ViewSet is used to add and modify individual PolicyInstanceDocument objects, given
    the id of their parent PolicyInstance, the ordinal of the document, and the title 
    and content of the document. If the ordinal is not specified, the document is added at 
    the end of the list and assigned the next ordinal after the last document.
    """
    queryset = PolicyInstance.objects.all()
    serializer_class = PolicyInstanceDocumentSerializer
    permission_classes = [GroupPermission]

    def list(self, request):
        return Response([])

    def create(self, request, **kw):
        instance = PolicyInstance.objects.get(
            id=request.data['policy_instance_id'])
        if 'ordinal' in request.data:
            return Response({"error": "Cannot create document with ordinal"}, status=400)
        ordinal = chr(
            ord(instance.content[-1]['ordinal'][0]) + 1) if instance.content and 'ordinal' in instance.content[-1] else 'A'
        new_document = {
            "title": "DOCUMENT " + ordinal + " - " + request.data['title'],
            "content": to_coding_doc(request.data['content']),
            "ordinal": ordinal
        }
        instance.content.append(new_document)
        instance.save()
        return Response(PolicyInstanceSerializer(instance).data)

    def update(self, request, pk=None):
        instance = PolicyInstance.objects.get(
            id=request.data['policy_instance_id'])
        for document in instance.content:
            if document['ordinal'] == request.data['ordinal']:
                document['title'] = "DOCUMENT " + \
                    request.data['ordinal'] + " - " + request.data['title']
                document['content'] = to_coding_doc(
                    request.data['content'])
                instance.save()
                return Response(PolicyInstanceSerializer(instance).data)
        return Response({"error": "Document not found"}, status=404)

    def partial_update(self, request, pk=None):
        return self.update(request, pk)

    def destroy(self, request, pk=None):
        instance = PolicyInstance.objects.get(id=request.data['policy_id'])
        for document in instance.content:
            if document['ordinal'] == request.data['ordinal']:
                instance.content.remove(document)
                instance.save()
                return Response(PolicyInstanceSerializer(instance).data)
        return Response({"error": "Document not found"}, status=404)


class PolicyInstanceInfoViewSet(viewsets.ModelViewSet):
    queryset = PolicyInstance.objects.all()
    serializer_class = PolicyInstanceInfoSerializer
    permission_classes = [GroupPermission]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id', 'policy_id', 'scan_dt']


class RawPolicyInstanceViewSet(viewsets.ModelViewSet):
    queryset = RawPolicyInstance.objects.all()
    serializer_class = RawPolicyInstanceSerializer
    permission_classes = [GroupPermission]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id', 'policy_id', 'capture_date', 'capture_source']


class TimingSessionViewSet(viewsets.ModelViewSet):
    queryset = TimingSession.objects.all()
    serializer_class = TimingSessionSerializer
    permission_classes = [GroupPermission]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id']

    def create(self, validated_data, **kw):
        instance = TimingSession.objects.filter(
            session_identifier=validated_data.data['session_identifier']
        ).first()
        if instance:
            for k, v in validated_data.data.items():
                setattr(instance, k, v)
        else:
            instance = TimingSession.objects.create(
                project=_get_project_id(validated_data), **validated_data.data)
        instance.save()
        return Response(TimingSessionSerializer(instance).data)


# TO REMOVE!
class CodingProgressViewSet(viewsets.ViewSet):
    permission_classes = [GroupPermission]

    @method_decorator(cache_page(60*5 if not settings.DEBUG else 1))
    def list(self, request):
        pi_id2ci = defaultdict(list)
        coding = Coding.objects.get(id=settings.CURRENT_CODING_ID)
        all_coding_instances = CodingInstance.objects.all().exclude(
            coder_email__in=["davidbstein@gmail.com"]).filter(coding_id=settings.CURRENT_CODING_ID)
        for ci in all_coding_instances:
            coder = User.objects.get(email=ci.coder_email)
            # throw out subanswers.
            ci_qs = set(
                coding_question_key.split("(")[0]
                for coding_question_key in ci.coding_values.keys()
                if '_' in coding_question_key
            )
            # find the number of answers that correspond to questions in the current coding
            identifiers = set([
                q['identifier'].split("(")[0]
                for q in coding.questions]
            )
            response_count = sum(
                identifier in ci_qs for identifier in identifiers
            )
            pi_id2ci[ci.policy_instance_id].append({
                "email": ci.coder_email,
                "response_count": response_count,
                "target_count": len(identifiers),
                "created": ci.created_dt,
                "name": u.get_full_name(),
                "double_answers": len([
                    cv for cv in ci.coding_values.values()
                    if cv.get('question_type') == 'singleselect'
                        and sum(map(bool, cv.get('values', {}).values())) != 1
                ])
            })
        pis = {
            pi.id: {
                "policy_id": pi.policy_id,
                "policy_instance_id": pi.id
            } for pi in
            PolicyInstance.objects.filter(id__in=pi_id2ci.keys())
        }
        ps = {
            p.id: PolicySerializer(p).data for p in
            Policy.objects.filter(id__in=[pi['policy_id']
                                  for pi in pis.values()])
        }
        for pi_id, pi in pis.items():
            if not pi['policy_id'] in ps.keys():
                print("skipping", pi_id, pi['policy_id'])
                continue
            pi['company_name'] = ps[pi['policy_id']]['company_name']
            pi['coding_instances'] = pi_id2ci[pi_id]
        return Response(
            sorted(
                pis.values(),
                key=lambda e: (
                    len(e['coding_instances']) % 3,
                    min(ee['created'] for ee in e['coding_instances'])
                ),
                reverse=True
            )
        )
