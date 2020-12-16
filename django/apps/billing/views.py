"""Model views are defined here"""
from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics, permissions
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import PaymentOperation
from django.db import transaction
from django.conf import settings

from yandex_checkout import Configuration, Payment

import datetime
import typing
from gorilla_pb.gorilla_pb2 import AddDeltasRequest, AddDeltasResponse, Delta, \
                                   GetBalanceRequest, GetBalanceResponse, \
                                   GetDeltasRequest, GetDeltasResponse

from gorilla_pb.gorilla_pb2_grpc import GorillaStub
from google.protobuf.json_format import MessageToDict

@permission_classes((permissions.IsAuthenticated, ))
class InitiatePaymentView(APIView):
    @swagger_auto_schema()
    def post(self, request, *args, **kwargs):
        Configuration.account_id = settings.YANDEX_KASSA_ACCOUNT_ID
        Configuration.secret_key = settings.YANDEX_KASSA_SECRET
        CURRENCY_USD_TO_RUB = 77

        user = self.request.user
        amount = float(self.kwargs['amount'])
        redirect_url = self.kwargs['redirect_url']

        payment = Payment.create({
            'amount': {
                'value': str(amount * CURRENCY_USD_TO_RUB),
                'currency': 'RUB',
            },
            'confirmation': {
                'type': 'redirect',
                'return_url': str(redirect_url)
            },
            'capture': True,
            'description': 'DeepMux order on $ ' + str(amount)
        })

        payment_operation = PaymentOperation(user=user, amount=amount, payment_id=payment.id)
        payment_operation.save()

        return Response(data={'redirect_url': payment.confirmation.confirmation_url}, status=200)


def make_delta_for_payment_operation(operation: PaymentOperation):
    creation: datetime.datetime = operation.creation_time
    creation = creation.replace(hour=0, minute=0, second=0, microsecond=0)
    return Delta(
        Date=int(creation.timestamp()),
        Category="PAYMENT",
        Balance=float(operation.amount),
        ObjectID='00000000-0000-0000-0000-000000000000',
        ObjectType='UNKNOWN',
        OwnerID=str(operation.user.uuid),
    )


def send_bill_to_gorilla(gorilla: GorillaStub, deltas: typing.List[Delta]):
    _: AddDeltasResponse = gorilla.AddDeltas(AddDeltasRequest(Deltas=deltas))


def get_user_balance_from_gorilla(gorilla: GorillaStub, user):
    response: GetBalanceResponse = gorilla.GetBalance(GetBalanceRequest(OwnerID=str(user.uuid)))
    return response.Balance

# message GetDeltasRequest {
#     string OwnerID = 1;
#     string ModelID = 2; // Empty means all models
#     int64  FirstDate = 3; // Unix timestamp of date in UTC
#     int64  LastDate = 4; // Unix timestamp of date in UTC
#     bool   UseCategories = 5; // If true split by categories
# }
def get_user_transactions_from_gorilla(gorilla: GorillaStub, user, begin_timestamp: int, end_timestamp: int, use_categories: bool):
    response: GetDeltasResponse = gorilla.GetDeltas(GetDeltasRequest(
        OwnerID=str(user.uuid),
        FirstDate=begin_timestamp,
        LastDate=end_timestamp,
        UseCategories=use_categories,
    ))
    return response


@transaction.atomic
def process_all_user_pending_payments(user):
    Configuration.account_id = settings.YANDEX_KASSA_ACCOUNT_ID
    Configuration.secret_key = settings.YANDEX_KASSA_SECRET

    queryset = PaymentOperation.objects.all().filter(user=user)
    deltas_evaluated = []

    for payment_operation in queryset:
        if payment_operation.status == 'succeeded' or payment_operation.status == 'canceled' \
        or payment_operation.status[0:5] == 'ERROR':
            continue

        try:
            payment = Payment.find_one(payment_operation.payment_id)
        except Exception as e:
            payment_operation.status = ('ERROR: ' + str(e))[:512]
            payment_operation.save()
            continue

        if payment.status == 'succeeded' and payment_operation.status != 'succeeded':
            deltas_evaluated.append(make_delta_for_payment_operation(payment_operation))
            payment_operation.status = payment.status
        else:
            payment_operation.status = payment.status
        payment_operation.save()
    if len(deltas_evaluated) > 0:
        send_bill_to_gorilla(gorilla=settings.GORILLA_STUB, deltas=deltas_evaluated)


@permission_classes((permissions.IsAuthenticated, ))
class GetCurrentBalanceAPIView(APIView):
    @swagger_auto_schema()
    def get(self, request, *args, **kwargs):
        process_all_user_pending_payments(user=self.request.user)
        balance = get_user_balance_from_gorilla(gorilla=settings.GORILLA_STUB, user=self.request.user)
        return Response(data={'money': balance})


@permission_classes((permissions.IsAuthenticated, ))
class GetTransactionsListAPIView(APIView):
    @swagger_auto_schema()
    def get(self, request, *args, **kwargs):
        user = self.request.user
        timestamp_begin = int(self.kwargs['timestamp_begin'])
        timestamp_end = int(self.kwargs['timestamp_end'])
        split_by_categories = True

        transactions = get_user_transactions_from_gorilla(settings.GORILLA_STUB, user,
                                                          timestamp_begin, timestamp_end,
                                                          split_by_categories)
        return Response(data=MessageToDict(transactions))

