# Generated by Django 3.0.6 on 2020-06-07 05:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_auto_20200606_2343'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='policy',
            name='policy_type',
        ),
    ]