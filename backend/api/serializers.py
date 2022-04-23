from django.core.files.base import ContentFile
from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import *
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
import uuid
from django.conf import settings
import PIL.Image as Image
import io
import base64
import datetime
from datetime import date
# from .helpers import send_otp_to_mobile
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'username', 'password',
                  'first_name', 'last_name', 'mobile', 'base64')

    def create(self, data):
        user = User.objects.create(
            email=data.get('email'),
            password=data.get('password'),
            username=data.get('username'),
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            mobile=data.get('mobile'),
            base64=data.get('base64')
        )
        user.set_password(data.get('password'))
        base_code = data.get('base64')
        format, imgstr = base_code.split(';base64,')
        ext = format.split('/')[-1]
        img = ContentFile(base64.b64decode(imgstr))
        file_name = "myphoto." + ext
        user.Signupimage.save(file_name, img, save=True)
        send_otp_via_email(data['email'], user)
        return user


class FakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'id')


def getdate():
    today = date.today()
    day = today.day
    mydate = datetime.datetime.now()
    month = mydate.strftime("%B")
    year = today.year
    if day == 1 or day == 21 or day == 31:
        current_day = f"{day}st {month} {year}"
    else:
        current_day = f"{day}th {month} {year}"
    return current_day


def gettime():
    now = datetime.datetime.now()
    current_time = now.strftime("%H:%M:%S")
    if int(current_time[0:2]) > 12:
        current_time = str(
            (int(current_time[0:2])-12)) + current_time[2:] + ' pm'
    elif int(current_time[0:2]) == 12:
        current_time = str(current_time[0:2]) + current_time[2:] + ' pm'
    elif int(current_time[0:2]) == 24:
        current_time = str(
            (int(current_time[0:2])-12)) + current_time[2:] + ' am'
    else:
        current_time = str(current_time) + ' am'
    return current_time


class BlogCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogComment
        fields = "__all__"

    def create(self, data):
        if data.get('parent'):
            MyComment = BlogComment.objects.create(user=data.get('user'),comment=data.get('comment'),Blog=data.get('Blog'),datestamp=getdate(),timestamp=gettime(),parent=data.get('parent'),profile_image = data.get('user').Signupimage,parent_name=data.get('parent').user.username)
        else:
            MyComment = BlogComment.objects.create(user=data.get('user'),comment=data.get('comment'),Blog=data.get('Blog'),datestamp=getdate(),timestamp=gettime(),parent=data.get('parent'),profile_image = data.get('user').Signupimage)
        print(data.get('user'))
        print(data)
        MyComment.save()
        return MyComment


class BlogSerializer(serializers.ModelSerializer):
    # user_email = FakeSerializer(many=True)
    class Meta:
        model = BlogPost
        fields = "__all__"

    def create(self, data):
        
        blog = BlogPost.objects.create(title=data.get('title'), user=data.get('user'), image=data.get(
            'image'), desc=data.get('desc'), datestamp=getdate(), timestamp=gettime())
        blog.save()
        return blog
