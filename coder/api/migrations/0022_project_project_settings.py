# Generated by Django 3.2.3 on 2021-05-23 08:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_auto_20210519_1813'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='project_settings',
            field=models.JSONField(default={}),
        ),
    ]
