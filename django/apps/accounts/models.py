from django.contrib.auth.models import AbstractUser
from django.db.models import CharField, UUIDField, IntegerField, FloatField, EmailField
import uuid


class User(AbstractUser):
    # Personal info
    last_name = CharField("Family name", max_length=150, blank=True)
    first_name = CharField("Given name", max_length=30, blank=True)
    google_id = CharField(max_length=512, blank=True)
    facebook_id = CharField(max_length=512, blank=True)
    email = EmailField()  # WARNING: email might change by oauth server info
    uuid = UUIDField(default=uuid.uuid4, editable=False)

    model_count = IntegerField("Total models", default=0)
    balance = FloatField("Balance", default=0.0)

    def __str__(self):
        return self.email
