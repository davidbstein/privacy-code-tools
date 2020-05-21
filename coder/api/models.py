from django.db import models
from django.contrib.postgres import fields as postgres_fields

# Create your models here.
class Coder(models.Model):
  name = models.CharField(max_length=255)
  email = models.CharField(max_length=255, db_index=True)
  permission = models.BigIntegerField()

class Coding(models.Model):
  parent = models.BigIntegerField()
  created_dt = models.DateTimeField()
  questions = postgres_fields.JSONField()

class CodingInstance(models.Model):
  coder_id = models.BigIntegerField(db_index=True)
  policy_instance_id = models.BigIntegerField(db_index=True)
  coding_id = models.BigIntegerField(db_index=True)
  created_dt = models.DateTimeField()
  coding_values = postgres_fields.JSONField()

class Policy(models.Model):
  company_name = models.CharField()
  site_name = models.CharField()
  alexa_rank = models.BigIntegerField()
  policy_type = models.CharField()
  url = models.CharField()
  start_date = models.DateField()
  end_date = models.DateField()
  last_scan_dt = models.DateTimeField()
  scan_count = models.BigIntegerField()

class PolicyInstance(models.Model):
  policy_id = models.BigIntegerField(db_index=True)
  scan_dt = models.DateTimeField()
  content = postgres_fields.JSONField()

class RawPolicy_instance(models.Model):
  policy_id = models.BigIntegerField(db_index=True)
  raw_content = models.TextField()
  capture_date = models.DateField()
  capture_source = models.TextField()