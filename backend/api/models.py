from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
import uuid
from django.conf import settings
# Create your models here.
from .manager import UserManager
from django.conf import settings
import random
import uuid
from django.core.cache import cache


def Signup_path(instance, filename):
    print(instance.id)
    return 'Signup/user_/{0}/{1}'.format(instance.id, filename)


def Login_path(instance, filename):
    print(instance.id)
    return 'Login/user_/{0}/{1}'.format(instance.id, filename)

def Blog_path(instance,filename):
    return 'BlogImages/user_{0}/{1}'.format(instance.user,filename)
class User(AbstractUser):
    Username = None
    email = models.EmailField(unique=True, null=True, blank=True)
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    mobile = models.CharField(
        max_length=225, default=None, null=True, blank=True)
    is_email_verified = models.BooleanField(default=False)
    is_mobile_verified = models.BooleanField(default=False)
    otp = models.CharField(max_length=225, null=True, blank=True)
    base64 = models.TextField(default=None, null=True, blank=True)
    Signupimage = models.FileField(
        default=None, null=True, blank=True, upload_to=Signup_path)
    Loginimage = models.FileField(
        default=None, null=True, blank=True, upload_to=Login_path)

    objects = UserManager()
    REQUIRED_FIELDS = []
    USERNAME_FIELD = 'email'

    def name(self):
        return self.first_name + ' ' + self.last_name


def send_otp_via_email(email, user_obj):
    if cache.get(email):
        print('ttl', cache.ttl(email))
        return False, cache.ttl(email)
    try:
        otp = random.randint(1000, 9999)
        cache.set(email, otp, timeout=60)
        subject = "your email needs to be verified"
        message = f'Hi,Use The Otp to Register {otp}'
        email_from = settings.EMAIL_HOST
        send_mail(subject, message, email_from, [email])
        user_obj.otp = otp
        user_obj.save()
        return True, 0
    except Exception as e:
        print(e)


class BlogPost(models.Model):
    blog_id = models.AutoField(primary_key=True, default=None)
    user = models.ForeignKey(User, on_delete=models.CASCADE,to_field='username',default=None, blank=True, null=True)
    title = models.CharField(max_length=225, default=None)
    desc = models.TextField(default=None)
    datestamp = models.CharField(max_length=225, default=None,null=True)
    timestamp = models.CharField(max_length=225, default=None,null=True)
    image = models.FileField(default=None,upload_to=Blog_path)


class BlogComment(models.Model):
    sno = models.AutoField(primary_key=True)
    comment =  models.TextField(default=None)
    user = models.ForeignKey(User,to_field='username',on_delete=models.CASCADE,default=None,null=True,blank=True)
    Blog = models.ForeignKey(BlogPost,on_delete=models.CASCADE)
    parent = models.ForeignKey('self',on_delete=models.CASCADE,null=True)
    profile_image = models.ImageField(default=None,null=True,blank=True)
    parent_name = models.CharField(max_length=225,null=True,blank=True,default=None)
    datestamp = models.CharField(max_length=225, default=None,null=True)
    timestamp = models.CharField(max_length=225, default=None,null=True)