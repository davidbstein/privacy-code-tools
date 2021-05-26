# Generated by Django 3.2.3 on 2021-05-15 17:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_auto_20200625_0655'),
    ]

    operations = [
        migrations.AddField(
            model_name='coder',
            name='project',
            field=models.BigIntegerField(default=1),
        ),
        migrations.AddField(
            model_name='coding',
            name='project',
            field=models.BigIntegerField(default=1),
        ),
        migrations.AddField(
            model_name='codinginstance',
            name='project',
            field=models.BigIntegerField(default=1),
        ),
        migrations.AddField(
            model_name='policy',
            name='project',
            field=models.BigIntegerField(default=1),
        ),
        migrations.AddField(
            model_name='policyinstance',
            name='project',
            field=models.BigIntegerField(default=1),
        ),
        migrations.AddField(
            model_name='rawpolicyinstance',
            name='project',
            field=models.BigIntegerField(default=1),
        ),
        migrations.AddField(
            model_name='timingsession',
            name='project',
            field=models.BigIntegerField(default=1),
        ),
    ]