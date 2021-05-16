from django.db import models
from django.contrib.postgres import fields as postgres_fields
import datetime


class Coding(models.Model):
    project = models.BigIntegerField(default=1)
    parent = models.BigIntegerField(null=True)
    created_dt = models.DateTimeField(default=datetime.datetime.now)
    questions = postgres_fields.JSONField()


class CodingInstance(models.Model):
    project = models.BigIntegerField(default=1)
    coder_email = models.CharField(
        max_length=255, db_index=True, default="unknown")
    policy_instance_id = models.BigIntegerField(db_index=True)
    coding_id = models.BigIntegerField(db_index=True)
    created_dt = models.DateTimeField(default=datetime.datetime.now)
    coding_values = postgres_fields.JSONField()

    class Meta:
        unique_together = ('coder_email', 'coding_id', 'policy_instance_id')


class Policy(models.Model):
    project = models.BigIntegerField(default=1)
    company_name = models.CharField(max_length=255)
    site_name = models.CharField(max_length=255)
    alexa_rank = models.BigIntegerField(null=True)
    urls = postgres_fields.JSONField(default=dict)
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    last_scan_dt = models.DateTimeField(null=True)
    scan_count = models.BigIntegerField(default=0)
    categories = postgres_fields.JSONField(default=list)
    meta = postgres_fields.JSONField(default=dict)


class PolicyInstance(models.Model):
    project = models.BigIntegerField(default=1)
    policy_id = models.BigIntegerField(db_index=True)
    raw_policy_id = models.BigIntegerField(null=True)
    scan_dt = models.DateTimeField(default=datetime.datetime.now)
    content = postgres_fields.JSONField()


class RawPolicyInstance(models.Model):
    project = models.BigIntegerField(default=1)
    policy_id = models.BigIntegerField(db_index=True)
    raw_content_blocks = postgres_fields.JSONField(default=dict)
    capture_date = models.DateField(default=datetime.datetime.now)
    capture_source = models.TextField()


class TimingSession(models.Model):
    project = models.BigIntegerField(default=1)
    coder_email = models.CharField(max_length=255)
    coding_id = models.BigIntegerField()
    policy_instance_id = models.BigIntegerField()
    question_timings = postgres_fields.JSONField()
    session_timing = postgres_fields.JSONField()
    session_identifier = models.BigIntegerField(unique=True)
