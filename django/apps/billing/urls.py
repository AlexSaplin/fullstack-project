from django.urls import path
from .views import GetCurrentBalanceAPIView, InitiatePaymentView, GetTransactionsListAPIView

urlpatterns = [
    path('get_money', GetCurrentBalanceAPIView.as_view()),
    path('init_payment/<str:amount>/<path:redirect_url>', InitiatePaymentView.as_view()),
    path('get_transactions/<int:timestamp_begin>/<int:timestamp_end>', GetTransactionsListAPIView.as_view()),
]
