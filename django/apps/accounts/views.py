"""Model views are defined here"""
from .models import User
from .serializers import UserSerializer, GoogleAuthTokenSerializer
from django.contrib.auth.hashers import make_password
from django.utils.crypto import get_random_string
from drf_yasg.utils import swagger_auto_schema
from rest_framework import mixins, generics, permissions
from rest_framework.authtoken.models import Token
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings

import datetime
import base64
import json
import hmac
import hashlib

from gorilla_pb.gorilla_pb2 import AddDeltasRequest, Delta


@permission_classes((permissions.IsAuthenticated, ))
class MyProfileApiView(mixins.RetrieveModelMixin, mixins.UpdateModelMixin,
                       generics.GenericAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

    @swagger_auto_schema(tags=['Профили'],
                         operation_summary='Получить данные текущего авторизованного пользователя')
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    @swagger_auto_schema(tags=['Профили'],
                         operation_summary='Изменить данные текущего авторизованного пользователя')
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


def get_or_create_user_by_google_id(google_id):
    user = None
    user_created = False
    try:
        user = User.objects.get(google_id=google_id)
    except User.DoesNotExist:
        username = get_random_string(length=50)
        while User.objects.all().filter(username=username).exists():
            username = get_random_string(length=50)

        passwd_str = User.objects.make_random_password(length=50)
        user = User(username=username, password=make_password(passwd_str), google_id=google_id)
        user.save()
        user_created = True
    return user_created, user


@permission_classes((permissions.AllowAny, ))
class AuthWithGoogleView(APIView):
    @swagger_auto_schema(tags=['Profiles'],
                         request_body=GoogleAuthTokenSerializer,
                         operation_summary='Authorize with Google OAuth')
    def post(self, request):
        serializer = GoogleAuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        id_info = serializer.validated_data['id_info']
        google_id = id_info['sub']
        email = id_info['email']
        first_name = id_info['given_name']
        last_name = id_info['family_name']

        user_is_created, user = get_or_create_user_by_google_id(google_id)
        user.email = email
        user.first_name = first_name
        user.last_name = last_name
        user.save()
        token = Token.objects.get_or_create(user=user)[0]

        if user_is_created and settings.NEW_USER_STARTING_BALANCE != 0:
            payment_date = datetime.datetime.utcnow()
            payment_date = payment_date.replace(hour=0, minute=0, second=0, microsecond=0)
            first_payment_delta = Delta(
                Date=int(payment_date.timestamp()),
                Category="PAYMENT",
                Balance=float(settings.NEW_USER_STARTING_BALANCE),
                ObjectID='00000000-0000-0000-0000-000000000000',
                ObjectType='UNKNOWN',
                OwnerID=str(user.uuid),
            )
            settings.GORILLA_STUB.AddDeltas(AddDeltasRequest(Deltas=[first_payment_delta,]))

        return Response({
            'token': str(token),
            'user': UserSerializer(user).data,
        })


def get_or_create_user_by_facebook_id(facebook_id):
    user = None
    user_created = False
    try:
        user = User.objects.get(facebook_id=facebook_id)
    except User.DoesNotExist:
        username = get_random_string(length=50)
        while User.objects.all().filter(username=username).exists():
            username = get_random_string(length=50)

        passwd_str = User.objects.make_random_password(length=50)
        user = User(username=username, password=make_password(passwd_str), facebook_id=facebook_id)
        user.save()
        user_created = True
    return user_created, user


def base64_url_decode(inp):
    inp = inp.replace('-','+').replace('_','/')
    padding_factor = (4 - len(inp) % 4) % 4
    inp += "="*padding_factor
    return base64.decodestring(bytearray(inp, 'utf-8'))


def parse_signed_request(signed_request='a.a', secret=settings.FACEBOOK_OAUTH_SECRET):
    l = signed_request.split('.', 2)
    encoded_sig = l[0]
    payload = l[1]

    sig = base64_url_decode(encoded_sig)
    data = json.loads(base64_url_decode(payload))

    if data.get('algorithm').upper() != 'HMAC-SHA256':
        print('Unknown algorithm')
        return None
    else:
        import sys
        expected_sig = hmac.new(bytearray(secret, 'utf-8'), msg=bytearray(payload, 'utf-8'), digestmod=hashlib.sha256).digest()

    if sig != expected_sig:
        return None
    else:
        return data


@permission_classes((permissions.AllowAny, ))
class AuthWithFacebookView(APIView):
    @swagger_auto_schema(tags=['Profiles'],
                         operation_summary='Authorize with Facebook OAuth')
    def post(self, request):
        facebook_user_id = request.data['user_id']
        signed_request = request.data['signed_request']
        first_name = request.data['first_name']
        last_name = request.data['last_name']
        email = request.data['email']

        # validating user data with app secret
        parsed_signed_request = parse_signed_request(signed_request)
        if not parsed_signed_request or 'user_id' not in parsed_signed_request.keys() or parsed_signed_request['user_id'] != facebook_user_id:
            return Response(status=403)

        user_is_created, user = get_or_create_user_by_facebook_id(facebook_user_id)
        user.email = email
        user.first_name = first_name
        user.last_name = last_name
        user.save()
        token = Token.objects.get_or_create(user=user)[0]

        if user_is_created and settings.NEW_USER_STARTING_BALANCE != 0:
            payment_date = datetime.datetime.utcnow()
            payment_date = payment_date.replace(hour=0, minute=0, second=0, microsecond=0)
            first_payment_delta = Delta(
                Date=int(payment_date.timestamp()),
                Category="PAYMENT",
                Balance=float(settings.NEW_USER_STARTING_BALANCE),
                ObjectID='00000000-0000-0000-0000-000000000000',
                ObjectType='UNKNOWN',
                OwnerID=str(user.uuid),
            )
            settings.GORILLA_STUB.AddDeltas(AddDeltasRequest(Deltas=[first_payment_delta,]))

        return Response({
            'token': str(token),
            'user': UserSerializer(user).data,
        })


@permission_classes((permissions.IsAuthenticated, ))
class RevokeAPIKeyView(APIView):
    @swagger_auto_schema(tags=['Профили'],
                         operation_summary='Revoke API key')
    def post(self, request):
        user = request.user
        token, created = Token.objects.get_or_create(user=user)
        if not created:
            token.delete()
            token = Token(user=user)
            token.save()

        return Response({
            'token': str(token),
            'user': UserSerializer(user).data,
        })
