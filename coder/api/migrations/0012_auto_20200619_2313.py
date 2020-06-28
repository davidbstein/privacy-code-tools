# Generated by Django 3.0.6 on 2020-06-19 23:13

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_auto_20200614_2033'),
    ]

    operations = [
        migrations.AddField(
            model_name='policy',
            name='meta',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=dict),
        ),
        migrations.AlterField(
            model_name='policy',
            name='alexa_rank',
            field=models.BigIntegerField(null=True),
        ),
    ]