"""Model serializers are defined here"""
from rest_framework import serializers
from accounts.models import User
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests

import typing as tp


class UserSerializer(serializers.ModelSerializer):
    """Стандартный сериализатор для модели Профиля"""
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'uuid']


"""
https://developers.google.com/identity/sign-in/web/backend-auth#send-the-id-token-to-your-server
"""


class GoogleAuthTokenField(serializers.CharField):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_internal_value(self, data):
        token: str = super().to_internal_value(data)
        try:
            id_info: tp.Mapping[str, tp.Any] = id_token.verify_oauth2_token(token, requests.Request(),
                                                                            settings.GOOGLE_OAUTH_CLIENT_ID)
        except ValueError as e:
            raise serializers.ValidationError(str(e))

        if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise serializers.ValidationError('Wrong issuer')

        return {
            "id_token": token,
            "id_info": id_info,
        }

    def to_representation(self, value):
        raise ValueError("This field is not suitable for serialization")


class GoogleAuthTokenSerializer(serializers.Serializer):
    """
    Fields:
        id_token: str

    Once validated, has field:
        id_info: Dict[str, str]

    See format here: https://developers.google.com/identity/sign-in/web/backend-auth#calling-the-tokeninfo-endpoint
    """
    id_token = GoogleAuthTokenField(required=True, source="*")
