from django.db import models
from django.contrib.postgres import fields as postgres_fields
import datetime


def _two_weeks_from_now():
    return datetime.datetime.now() + datetime.timedelta(days=14)


class Assignment(models.Model):
    project = models.BigIntegerField(default=1)
    created_dt = models.DateTimeField(default=datetime.datetime.now)
    coder_email = models.CharField(max_length=255)
    url = models.CharField(max_length=255, null=True)
    label = models.CharField(max_length=255)
    notes = models.JSONField(default=dict)
    due_dt = models.DateTimeField(default=_two_weeks_from_now)
    completed_dt = models.DateTimeField(null=True)
    type = models.BigIntegerField()
    status = models.CharField(max_length=31, default="TRIAGE")


class AssignmentType(models.Model):
    project = models.BigIntegerField(default=1)
    fields = postgres_fields.ArrayField(models.CharField(max_length=255))
    name = models.CharField(max_length=255)


class Coding(models.Model):
    project = models.BigIntegerField(default=1)
    parent = models.BigIntegerField(null=True)
    created_dt = models.DateTimeField(default=datetime.datetime.now)
    categories = models.JSONField(default=list)
    meta = models.JSONField(default=dict)


class Project(models.Model):
    prefix = models.CharField(max_length=255, db_index=True)
    name = models.CharField(max_length=255)
    settings = models.JSONField(default=dict)


class CodingInstance(models.Model):
    project = models.BigIntegerField(default=1)
    coder_email = models.CharField(
        max_length=255, db_index=True, default="unknown")
    policy_instance_id = models.BigIntegerField(db_index=True)
    coding_id = models.BigIntegerField(db_index=True)
    created_dt = models.DateTimeField(default=datetime.datetime.now)
    coding_values = models.JSONField()

    class Meta:
        unique_together = ('coder_email', 'coding_id', 'policy_instance_id')


class Policy(models.Model):
    project = models.BigIntegerField(default=1)
    company_name = models.CharField(max_length=255)
    site_name = models.CharField(max_length=255, db_index=True)
    locale = models.CharField(max_length=32, null=True)
    alexa_rank = models.BigIntegerField(null=True)
    alexa_rank_US = models.BigIntegerField(null=True)
    urls = models.JSONField(default=dict)
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    last_scan_dt = models.DateTimeField(null=True)
    scan_count = models.BigIntegerField(default=0)
    categories = models.JSONField(default=list)
    meta = models.JSONField(default=dict)
    progress = models.JSONField(default=dict)


class PolicyInstance(models.Model):
    project = models.BigIntegerField(default=1)
    policy_id = models.BigIntegerField(db_index=True)
    raw_policy_id = models.BigIntegerField(null=True)
    scan_dt = models.DateTimeField(default=datetime.datetime.now)
    content = models.JSONField()


class RawPolicyInstance(models.Model):
    project = models.BigIntegerField(default=1)
    policy_id = models.BigIntegerField(db_index=True)
    raw_content_blocks = models.JSONField(default=dict)
    capture_date = models.DateField(default=datetime.datetime.now)
    capture_source = models.TextField()


class TimingSession(models.Model):
    project = models.BigIntegerField(default=1)
    coder_email = models.CharField(max_length=255)
    coding_id = models.BigIntegerField()
    policy_instance_id = models.BigIntegerField()
    question_timings = models.JSONField()
    session_timing = models.JSONField()
    session_identifier = models.BigIntegerField(unique=True)
