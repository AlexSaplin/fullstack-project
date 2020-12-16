# start from an official image
FROM python:3.8

WORKDIR /opt/services/django

ADD requirements.txt .

RUN pip install -r requirements.txt

ADD . .

ENTRYPOINT python manage.py migrate && python manage.py collectstatic --no-input && gunicorn --chdir /opt/services/django --access-logfile /opt/services/django/logs/access.log --error-logfile /opt/services/django/logs/error.log --workers 5 --bind :16000 --timeout 120 django_server.wsgi:application

EXPOSE 16000