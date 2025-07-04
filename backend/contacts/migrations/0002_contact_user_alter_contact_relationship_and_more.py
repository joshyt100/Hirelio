# Generated by Django 5.1.5 on 2025-04-19 05:11

import django.contrib.postgres.indexes
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("contacts", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="contact",
            name="user",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="contacts",
                to=settings.AUTH_USER_MODEL,
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="contact",
            name="relationship",
            field=models.CharField(
                choices=[
                    ("former-colleague", "Former Colleague"),
                    ("current-colleague", "Current Colleague"),
                    ("classmate", "Classmate"),
                    ("friend", "Friend"),
                    ("mentor", "Mentor"),
                    ("recruiter", "Recruiter"),
                    ("manager", "Manager"),
                    ("industry-contact", "Industry Contact"),
                    ("other", "Other"),
                ],
                db_index=True,
                default="industry-contact",
                max_length=50,
            ),
        ),
        migrations.AlterField(
            model_name="contact",
            name="tags",
            field=models.JSONField(blank=True, db_index=True, default=list),
        ),
        migrations.AddIndex(
            model_name="contact",
            index=models.Index(
                fields=["user", "-id"], name="contacts_co_user_id_1edb9c_idx"
            ),
        ),
        migrations.AddIndex(
            model_name="contact",
            index=models.Index(
                fields=["user", "relationship", "-id"],
                name="contacts_co_user_id_e024ba_idx",
            ),
        ),
        migrations.AddIndex(
            model_name="contact",
            index=models.Index(
                fields=["user", "is_favorite"], name="contacts_co_user_id_0bcb89_idx"
            ),
        ),
        migrations.AddIndex(
            model_name="contact",
            index=django.contrib.postgres.indexes.GinIndex(
                fields=["tags"], name="contacts_co_tags_710a2a_gin"
            ),
        ),
    ]
