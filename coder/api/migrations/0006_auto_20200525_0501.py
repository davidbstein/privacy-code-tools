# Generated by Django 3.0.6 on 2020-05-25 05:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_auto_20200525_0456'),
    ]

    operations = [
        migrations.AddField(
            model_name='codinginstance',
            name='coder_email',
            field=models.CharField(db_index=True, default='unknown', max_length=255),
        ),
        migrations.AlterUniqueTogether(
            name='codinginstance',
            unique_together={('coder_email', 'policy_instance_id')},
        ),
        migrations.RemoveField(
            model_name='codinginstance',
            name='coder_id',
        ),
    ]