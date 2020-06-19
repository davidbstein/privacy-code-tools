from django.db import models
from django.contrib.postgres import fields as postgres_fields
import datetime


# Create your models here.
class Coder(models.Model):
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, db_index=True)
    permission = models.BigIntegerField()


class Coding(models.Model):
    parent = models.BigIntegerField(null=True)
    created_dt = models.DateTimeField(default=datetime.datetime.now)
    questions = postgres_fields.JSONField()


class CodingInstance(models.Model):
    coder_email = models.CharField(max_length=255, db_index=True, default="unknown")
    policy_instance_id = models.BigIntegerField(db_index=True)
    coding_id = models.BigIntegerField(db_index=True)
    created_dt = models.DateTimeField(default=datetime.datetime.now)
    coding_values = postgres_fields.JSONField()
    class Meta:
        unique_together = ('coder_email', 'coding_id', 'policy_instance_id')


class Policy(models.Model):
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
    policy_id = models.BigIntegerField(db_index=True)
    raw_policy_id = models.BigIntegerField(null=True)
    scan_dt = models.DateTimeField(default=datetime.datetime.now)
    content = postgres_fields.JSONField()


class RawPolicyInstance(models.Model):
    policy_id = models.BigIntegerField(db_index=True)
    raw_content_blocks = postgres_fields.JSONField(default=dict)
    capture_date = models.DateField(default=datetime.datetime.now)
    capture_source = models.TextField()
