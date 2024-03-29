# Generated by Django 3.2.3 on 2021-05-19 18:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0020_assignment_status'),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('project_prefix', models.CharField(db_index=True, max_length=255)),
                ('project_name', models.CharField(max_length=255)),
            ],
        ),
        migrations.AlterField(
            model_name='assignment',
            name='status',
            field=models.CharField(default='TRIAGE', max_length=31),
        ),
    ]
