from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework import permissions

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
    UserSerializer,
)

class CoderViewSet(viewsets.ModelViewSet):
    queryset = Coder.objects.all()
    serializer_class = CoderSerializer
    permission_classes = [permissions.IsAuthenticated]

class CodingViewSet(viewsets.ModelViewSet):
    queryset = Coding.objects.all()
    serializer_class = CodingSerializer
    permission_classes = [permissions.IsAuthenticated]

class CodingInstanceViewSet(viewsets.ModelViewSet):
    queryset = CodingInstance.objects.all()
    serializer_class = CodingInstanceSerializer
    permission_classes = [permissions.IsAuthenticated]

class PolicyViewSet(viewsets.ModelViewSet):
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer
    permission_classes = [permissions.IsAuthenticated]

class PolicyInstanceViewSet(viewsets.ModelViewSet):
    queryset = PolicyInstance.objects.all()
    serializer_class = PolicyInstanceSerializer
    permission_classes = [permissions.IsAuthenticated]

class RawPolicyInstanceViewSet(viewsets.ModelViewSet):
    queryset = RawPolicyInstance.objects.all()
    serializer_class = RawPolicyInstanceSerializer
    permission_classes = [permissions.IsAuthenticated]
