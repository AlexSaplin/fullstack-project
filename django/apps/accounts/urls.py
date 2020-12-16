"""Url patterns are defined here"""
from django.urls import path
from accounts.views import MyProfileApiView, AuthWithGoogleView, AuthWithFacebookView, RevokeAPIKeyView

urlpatterns = [
    path('login', AuthWithGoogleView.as_view()),
    path('login_fb', AuthWithFacebookView.as_view()),
    path('profile/my', MyProfileApiView.as_view()),
    path('revoke_token', RevokeAPIKeyView.as_view()),
]
