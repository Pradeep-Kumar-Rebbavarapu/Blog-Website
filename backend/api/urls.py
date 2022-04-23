"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from .views import *
urlpatterns = [
    path('signup/',Signup.as_view()),
    path('send_otp/',send_otp.as_view()),
    path('verify_otp/',verify_otp.as_view()),
    path('login/',login.as_view()),
    path('getuser/',getUser.as_view()),
    path('AddBlogs/',AddBlogs.as_view()),
    path('GetAllBlogs/',GetAllblogs.as_view()),
    path('UpdateBlog/<int:pk>/',UpdateBlog.as_view()),
    path('DeleteBlog/<int:pk>/',DeleteBlog.as_view()),
    path('GetUserBlogs/',GetUserBlogs.as_view()),
    path('GetEachBlog/<int:pk>/',GetEachBlog.as_view()),
    path('PostComment/',PostComment.as_view()),
    path('GetComments/<int:pk>/',GetComments.as_view()),
    path('FilterBlogs/',Filterblogs.as_view()),
    path('DeleteUser/',DeleteUser.as_view())
    # path('PostCommnet/',PostComment.as_view()),
]
