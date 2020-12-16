from celery import shared_task
from django.conf import settings

from gorilla_pb.gorilla_pb2 import GetBalanceResponse, GetBalanceRequest
from ardea_pb.ardea_pb2 import ListModelsRequest, ListModelsReply
from .models import User


@shared_task
def update_users_balance():
    gorilla = settings.GORILLA_STUB

    for user in User.objects.all():  # TODO: bulk update
        response: GetBalanceResponse = gorilla.GetBalance(GetBalanceRequest(OwnerID=str(user.uuid)))
        if abs(user.balance - response.Balance) > 1e-9:
            user.balance = response.Balance
            user.save()


@shared_task
def update_users_models_count():
    ardea = settings.ARDEA_STUB

    for user in User.objects.all():  # TODO: bulk update
        response: ListModelsReply = ardea.ListModels(ListModelsRequest(OwnerID=str(user.uuid)))
        model_count = len(response.Models)
        if user.model_count != model_count:
            user.model_count = model_count
            user.save()
