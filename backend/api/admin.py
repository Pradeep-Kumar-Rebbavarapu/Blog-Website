from django.contrib import admin
from .models import *
from django.utils.html import mark_safe
# Register your models here.
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email','Signupimage','Loginimage','id','username','is_email_verified','otp']

@admin.register(BlogPost)
class BlogAdmin(admin.ModelAdmin):
    list_display = ['blog_id','user','image','title']
@admin.register(BlogComment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['sno','user','comment','Blog','timestamp','datestamp','parent']


admin.site.site_header = "CodeBlogger"
admin.site.index_title = "My Database"
admin.site.site_title = "CodeBlogger"