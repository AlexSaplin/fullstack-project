from django.db import models
from django.db.models import ForeignKey, CASCADE, DecimalField, CharField, DateTimeField
from django.conf import settings
import uuid


class PaymentOperation(models.Model):
    user = ForeignKey(settings.AUTH_USER_MODEL, on_delete=CASCADE,
                      null=False, blank=False, related_name='pending_payment_operations',
                      verbose_name="User")
    amount = DecimalField(verbose_name='amount (dollars)', max_digits=10, decimal_places=2, default=0)
    payment_id = CharField(max_length=512, default='')
    status = CharField(max_length=512, default='')
    creation_time = DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.user) + ', ' + str(self.amount) + ', ' + str(self.status)
