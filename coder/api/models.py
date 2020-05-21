from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class Coder(models.Model):
  name = models.