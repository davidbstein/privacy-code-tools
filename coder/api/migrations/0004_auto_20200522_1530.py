# Generated by Django 3.0.6 on 2020-05-22 15:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20200522_0542'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coding',
            name='parent',
            field=models.BigIntegerField(null=True),
        ),
    ]
