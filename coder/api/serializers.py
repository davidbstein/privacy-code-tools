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
        fields = ['id', 'coder_email', 'policy_instance_id', 'coding_id', 'created_dt', 'coding_values']

class PolicySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = api_models.Policy
        fields = [
            'id', 'company_name', 'site_name', 'alexa_rank', 'categories',
            'urls', 'start_date', 'end_date', 'last_scan_dt', 'scan_count']

class PolicyInstanceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = api_models.PolicyInstance
        fields = ['id', 'policy_id', 'scan_dt', 'content']

class PolicyInstanceInfoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = api_models.PolicyInstance
        fields = ['id', 'policy_id', 'scan_dt']

class RawPolicyInstanceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = api_models.RawPolicyInstance
        fields = ['id', 'policy_id', 'raw_content', 'capture_date', 'capture_source']

class TimingSessionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = api_models.TimingSession
        fields = ['coder_email', 'coding_id', 'policy_instance_id',
                'question_timings', 'session_timing', 'session_identifier']