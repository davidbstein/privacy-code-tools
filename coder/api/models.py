from django.db import models
from django.contrib.postgres import fields as postgres_fields
import datetime

# Create your models here.
class Coder(models.Model):
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, db_index=True)
    permission = models.BigIntegerField()


class Coding(models.Model):
    parent = models.BigIntegerField()
    created_dt = models.DateTimeField(default=datetime.datetime.now)
    questions = postgres_fields.JSONField()


class CodingInstance(models.Model):
    coder_id = models.BigIntegerField(db_index=True)
    policy_instance_id = models.BigIntegerField(db_index=True)
    coding_id = models.BigIntegerField(db_index=True)
    created_dt = models.DateTimeField(default=datetime.datetime.now)
    coding_values = postgres_fields.JSONField()


class Policy(models.Model):
    company_name = models.CharField(max_length=255)
    site_name = models.CharField(max_length=255)
    alexa_rank = models.BigIntegerField()
    policy_type = models.CharField(max_length=255)
    url = models.TextField()
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    last_scan_dt = models.DateTimeField(null=True)
    scan_count = models.BigIntegerField(default=0)


class PolicyInstance(models.Model):
    policy_id = models.BigIntegerField(db_index=True)
    scan_dt = models.DateTimeField(default=datetime.datetime.now)
    content = postgres_fields.JSONField()


class RawPolicyInstance(models.Model):
    policy_id = models.BigIntegerField(db_index=True)
    raw_content = models.TextField()
    capture_date = models.DateField(default=datetime.datetime.now)
    capture_source = models.TextField()
