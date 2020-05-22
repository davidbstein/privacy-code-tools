from django.contrib.auth.models import User, Group
from rest_framework import serializers
from coder.api import models as api_models


class CoderSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = api_models.Coder
        fields = ['id', 'name', 'email', 'permission']

class CodingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = api_models.Coding
        fields = ['id', 'parent', 'created_dt', 'questions']

class CodingInstanceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = api_models.CodingInstance
        fields = ['id', 'coder_id', 'policy_instance_id', 'coding_id', 'created_dt', 'coding_values']

class PolicySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = api_models.Policy
        fields = ['id', 'company_name', 'site_name', 'alexa_rank', 'policy_type', 'url', 'start_date', 'end_date', 'last_scan_dt', 'scan_count']

class PolicyInstanceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = api_models.PolicyInstance
        fields = ['id', 'policy_id', 'scan_dt', 'content']

class RawPolicyInstanceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = api_models.RawPolicyInstance
        fields = ['id', 'policy_id', 'raw_content', 'capture_date', 'capture_source']