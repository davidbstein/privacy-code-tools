# Generated by Django 3.2.3 on 2021-05-19 18:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_assignment_due_dt'),
    ]

    operations = [
        migrations.AddField(
            model_name='assignment',
            name='status',
            field=models.CharField(default='UNSORTED', max_length=31),
        ),
    ]