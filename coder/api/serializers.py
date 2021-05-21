from rest_framework import serializers
from coder.api import models as api_models


def _field_list(table, to_omit=None):
    return [
        f.name for f in table._meta.fields
        if f.name not in (to_omit or [])
    ]


class AssignmentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = api_models.Assignment
        fields = _field_list(api_models.Assignment, to_omit=[])


class AssignmentTypeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = api_models.AssignmentType
        fields = _field_list(api_models.AssignmentType, to_omit=[])


class CodingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = api_models.Coding
        fields = _field_list(api_models.Coding, to_omit=[])


class CodingInstanceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = api_models.CodingInstance
        fields = _field_list(api_models.CodingInstance, to_omit=[])


class PolicySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = api_models.Policy
        fields = _field_list(api_models.Policy, to_omit=[])


class PolicyInstanceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = api_models.PolicyInstance
        fields = _field_list(api_models.PolicyInstance, to_omit=[])


class PolicyInstanceInfoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = api_models.PolicyInstance
        fields = _field_list(api_models.PolicyInstance, to_omit=['content'])


class RawPolicyInstanceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = api_models.RawPolicyInstance
        fields = _field_list(api_models.RawPolicyInstance, to_omit=[])


class TimingSessionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = api_models.TimingSession
        fields = _field_list(api_models.TimingSession, to_omit=[])
