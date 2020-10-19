from collections import defaultdict
from django.conf import settings
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework import generics
from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.response import Response
# from rest_framework import generics

from coder.api.models import (
    Coder,
    Coding,
    CodingInstance,
    Policy,
    PolicyInstance,
    RawPolicyInstance,
    TimingSession,
)
from coder.api.serializers import (
    CoderSerializer,
    CodingInstanceSerializer,
    CodingSerializer,
    PolicyInstanceSerializer,
    PolicySerializer,
    PolicyInstanceInfoSerializer,
    RawPolicyInstanceSerializer,
    TimingSessionSerializer,
)


EMAIL_SAFELIST = (
    "aet414@nyu.edu",
    "agk382@nyu.edu",
    "amm1837@nyu.edu",
    "ams1987@nyu.edu",
    "cv729@nyu.edu",
    "dbs438@nyu.edu",
    "jmb1407@nyu.edu",
    "kmm1153@nyu.edu",
    "lav345@nyu.edu",
    "msr634@nyu.edu",
    "ns4649@nyu.edu",
    "pb2444@nyu.edu",
    "saz312@nyu.edu",
    "spk376@nyu.edu",
    "yt1722@nyu.edu",
    "ss11617@nyu.edu",
)
class GroupPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.email in EMAIL_SAFELIST:
            return True
        return request.user.groups.filter(name="APIUser").exists()


class CoderViewSet(viewsets.ModelViewSet):
    queryset = Coder.objects.all()
    serializer_class = CoderSerializer
    permission_classes = [GroupPermission]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id', 'name', 'email', 'permission']

class CodingViewSet(viewsets.ModelViewSet):
    queryset = Coding.objects.all()
    serializer_class = CodingSerializer
    permission_classes = [GroupPermission]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id', 'parent', 'created_dt']

class CodingInstanceViewSet(viewsets.ModelViewSet):
    queryset = CodingInstance.objects.all()
    serializer_class = CodingInstanceSerializer
    permission_classes = [GroupPermission]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id', 'coder_email', 'policy_instance_id', 'coding_id', 'created_dt']

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

class PolicyViewSet(viewsets.ModelViewSet):
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer
    permission_classes = [GroupPermission]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = [
        'id', 'company_name', 'site_name', 'alexa_rank',
        'start_date', 'end_date', 'last_scan_dt', 'scan_count'
        ]
    search_fields = ['company_name', 'site_name']

class PolicyInstanceViewSet(viewsets.ModelViewSet):
    queryset = PolicyInstance.objects.all()
    serializer_class = PolicyInstanceSerializer
    permission_classes = [GroupPermission]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id', 'policy_id', 'scan_dt']

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
        instance = TimingSession.objects.filter(session_identifier=validated_data.data['session_identifier']).first()
        if instance:
            for k, v in validated_data.data.items():
                setattr(instance, k, v)
        else:
            instance = TimingSession.objects.create(**validated_data.data)
        instance.save()
        return Response(TimingSessionSerializer(instance).data)


class CodingProgressViewSet(viewsets.ViewSet):

    @method_decorator(cache_page(60*5 if not settings.DEBUG else 1))
    def list(self, request):
        pi_id2ci = defaultdict(list)
        coding = Coding.objects.get(id=settings.CURRENT_CODING_ID)
        for ci in CodingInstance.objects.all().exclude(coder_email__in=["davidbstein@gmail.com"]).filter(coding_id=settings.CURRENT_CODING_ID):
            u = User.objects.get(email=ci.coder_email)
            ci_qs = set(cvk.split("(")[0] for cvk in ci.coding_values.keys() if '_' in cvk)
            identifiers = set([q['identifier'].split("(")[0] for q in coding.questions])
            response_count = sum(identifier in ci_qs for identifier in identifiers)
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
                "policy_id":pi.policy_id,
                "policy_instance_id": pi.id
                } for pi in
            PolicyInstance.objects.filter(id__in=pi_id2ci.keys())
            }
        ps = {
            p.id: PolicySerializer(p).data for p in
            Policy.objects.filter(id__in=[pi['policy_id'] for pi in pis.values()])
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
