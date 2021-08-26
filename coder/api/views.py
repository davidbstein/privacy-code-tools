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


class GroupPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # if request.user.email:
        #     return True
        print(request.user.groups.all())
        return request.user.groups.filter(name="API_ACCESS").exists()

    def has_object_permission(self, request, view, obj):
        # if request.method in permissions.SAFE_METHODS:
        #     return True
        # # some sort of ORM test
        # return obj.owner == request.user
        return True


class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [GroupPermission]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id']


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [GroupPermission]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id']
    lookup_field = "prefix"


class AssignmentTypeViewSet(viewsets.ModelViewSet):
    queryset = AssignmentType.objects.all()
    serializer_class = AssignmentTypeSerializer
    permission_classes = [GroupPermission]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id']


class CodingViewSet(viewsets.ModelViewSet):
    queryset = Coding.objects.all()
    serializer_class = CodingSerializer
    permission_classes = [GroupPermission]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id', 'parent', 'created_dt']


class PolicyViewSet(viewsets.ModelViewSet):
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


class CodingInstanceViewSet(viewsets.ModelViewSet):
    queryset = CodingInstance.objects.all()
    serializer_class = CodingInstanceSerializer
    permission_classes = [GroupPermission]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id', 'coder_email',
                        'policy_instance_id', 'coding_id', 'created_dt']

    def create(self, validated_data):
        instance = CodingInstance.objects.filter(
            coder_email=validated_data.data['coder_email'],
            coding_id=validated_data.data['coding_id'],
            policy_instance_id=validated_data.data['policy_instance_id'],
        ).first()  # uniqueness avoids needs for limit
        if instance:
            instance.coding_values = validated_data.data['coding_values']
        else:
            instance = CodingInstance.objects.create(**validated_data.data)
        instance.save()
        return Response(CodingInstanceSerializer(instance).data)


class PolicyInstanceViewSet(viewsets.ModelViewSet):
    queryset = PolicyInstance.objects.all()
    serializer_class = PolicyInstanceSerializer
    permission_classes = [GroupPermission]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id', 'policy_id', 'scan_dt']

    def create(self, request):
        instance = PolicyInstance(
            policy_id=request.data['policy_id'],
            content=[]
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

    def create(self, request):
        instance = PolicyInstance.objects.get(
            id=request.data['policy_instance_id'])
        if 'ordinal' in request.data:
            return Response({"error": "Cannot create document with ordinal"}, status=400)
        ordinal = chr(
            ord(instance.content[-1]['ordinal']) + 1) if instance.content else 'A'
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

    def create(self, validated_data):
        instance = TimingSession.objects.filter(
            session_identifier=validated_data.data['session_identifier']).first()
        if instance:
            for k, v in validated_data.data.items():
                setattr(instance, k, v)
        else:
            instance = TimingSession.objects.create(**validated_data.data)
        instance.save()
        return Response(TimingSessionSerializer(instance).data)


class CodingProgressViewSet(viewsets.ViewSet):
    permission_classes = [GroupPermission]

    @method_decorator(cache_page(60*5 if not settings.DEBUG else 1))
    def list(self, request):
        pi_id2ci = defaultdict(list)
        coding = Coding.objects.get(id=settings.CURRENT_CODING_ID)
        for ci in CodingInstance.objects.all().exclude(coder_email__in=["davidbstein@gmail.com"]).filter(coding_id=settings.CURRENT_CODING_ID):
            u = User.objects.get(email=ci.coder_email)
            ci_qs = set(cvk.split("(")[0]
                        for cvk in ci.coding_values.keys() if '_' in cvk)
            identifiers = set([q['identifier'].split("(")[0]
                              for q in coding.questions])
            response_count = sum(
                identifier in ci_qs for identifier in identifiers)
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
