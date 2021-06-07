# Generated by Django 3.2.3 on 2021-05-31 00:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0026_rename_questions_coding_categories'),
    ]

    operations = [
        migrations.AddField(
            model_name='policy',
            name='alexa_rank_US',
            field=models.BigIntegerField(null=True),
        ),
        migrations.AddField(
            model_name='policy',
            name='locale',
            field=models.CharField(max_length=32, null=True),
        ),
        migrations.AlterField(
            model_name='policy',
            name='site_name',
            field=models.CharField(db_index=True, max_length=255),
        ),
    ]