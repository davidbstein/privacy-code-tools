# Generated by Django 3.2.3 on 2021-05-23 11:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0024_auto_20210523_1100'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='project_settings',
            field=models.JSONField(default=dict),
        ),
    ]
