# Generated by Django 3.0 on 2020-07-01 10:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_remove_user_money'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='balance',
            field=models.FloatField(default=0.0, verbose_name='Balance'),
        ),
        migrations.AddField(
            model_name='user',
            name='model_count',
            field=models.IntegerField(default=0, verbose_name='Total models'),
        ),
    ]
