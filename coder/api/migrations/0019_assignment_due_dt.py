# Generated by Django 3.2.3 on 2021-05-19 01:07

import coder.api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_auto_20210519_0104'),
    ]

    operations = [
        migrations.AddField(
            model_name='assignment',
            name='due_dt',
            field=models.DateTimeField(default=coder.api.models._two_weeks_from_now),
        ),
    ]