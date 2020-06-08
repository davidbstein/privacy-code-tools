from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework import filters
from rest_framework.response import Response
# from rest_framework import generics

from coder.api.models import (
    Coder,
    Coding,
    CodingInstance,
    Policy,
    PolicyInstance,
    RawPolicyInstance,
)
from coder.api.serializers import (
    CoderSerializer,
    CodingInstanceSerializer,
    CodingSerializer,
    PolicyInstanceSerializer,
    PolicySerializer,
    PolicyInstanceInfoSerializer,
    RawPolicyInstanceSerializer,
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
