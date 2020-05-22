
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework import filters
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
    RawPolicyInstanceSerializer,
)


class CoderViewSet(viewsets.ModelViewSet):
    queryset = Coder.objects.all()
    serializer_class = CoderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id', 'name', 'email', 'permission']

class CodingViewSet(viewsets.ModelViewSet):
    queryset = Coding.objects.all()
    serializer_class = CodingSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id', 'parent', 'created_dt', 'questions']

class CodingInstanceViewSet(viewsets.ModelViewSet):
    queryset = CodingInstance.objects.all()
    serializer_class = CodingInstanceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id', 'coder_id', 'policy_instance_id', 'coding_id', 'created_dt', 'coding_values']

class PolicyViewSet(viewsets.ModelViewSet):
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id', 'company_name', 'site_name', 'alexa_rank', 'policy_type', 'url', 'start_date', 'end_date', 'last_scan_dt', 'scan_count']
    search_fields = ['company_name', 'site_name']

class PolicyInstanceViewSet(viewsets.ModelViewSet):
    queryset = PolicyInstance.objects.all()
    serializer_class = PolicyInstanceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id', 'policy_id', 'scan_dt', 'content']

class RawPolicyInstanceViewSet(viewsets.ModelViewSet):
    queryset = RawPolicyInstance.objects.all()
    serializer_class = RawPolicyInstanceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['id', 'policy_id', 'raw_content', 'capture_date', 'capture_source']
