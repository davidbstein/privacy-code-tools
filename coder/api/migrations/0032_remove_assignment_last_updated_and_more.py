# Generated by Django 4.1.2 on 2022-10-24 00:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0031_assignment_last_updated_coding_last_updated_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='assignment',
            name='last_updated',
        ),
        migrations.RemoveField(
            model_name='coding',
            name='last_updated',
        ),
        migrations.RemoveField(
            model_name='codinginstance',
            name='last_updated',
        ),
        migrations.RemoveField(
            model_name='policy',
            name='last_updated',
        ),
        migrations.RemoveField(
            model_name='policyinstance',
            name='last_updated',
        ),
        migrations.RemoveField(
            model_name='project',
            name='last_updated',
        ),
        migrations.RemoveField(
            model_name='timingsession',
            name='last_updated',
        ),
    ]