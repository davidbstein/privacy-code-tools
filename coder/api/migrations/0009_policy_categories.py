# Generated by Django 3.0.6 on 2020-06-07 05:34

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_remove_policy_policy_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='policy',
            name='categories',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=[]),
        ),
    ]
