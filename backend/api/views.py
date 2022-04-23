
from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.decorators import *

from .paginations import AllblogPagination
from .serializers import *
from rest_framework.response import Response
from rest_framework.decorators import *
from rest_framework import status
from .models import *
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import *
import jwt
import datetime
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from rest_framework.renderers import JSONRenderer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import *
from .models import User
from rest_framework.parsers import MultiPartParser, FormParser
import PIL.Image as Image
import io
import base64
from django.core.files.base import ContentFile
import face_recognition
from face_recognition.face_recognition_cli import image_files_in_folder
import os
from rest_framework.filters import SearchFilter
# Create your views here.

class Signup(APIView):
    def post(self, request):
        data = request.data
        serializer = UserSerializer(data=data)
        if serializer.is_valid():

            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class send_otp(APIView):
    def post(self, request):
        data = request.data
        otp = data['otp']
        email = data['email']
        return Response({'error': "otp sent succesfully"})

class verify_otp(APIView):
    def post(self, request):
        data = request.data
        otp = data['otp']
        email = data['email']
        user = User.objects.get(email=email)
        print(user)
        if user:
            if user.otp == otp:
                user.is_email_verified = True
                user.save()
                return Response({'message': "Your otp is verified"}, status=status.HTTP_200_OK)
            else:
                return Response({'errors': "wrong otp please try after some time"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'errors': "user not found with this email"}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request):
        data = request.data
        user = User.objects.filter(email=data.get('email'))
        print(user.exists())
        status1, time = send_otp_via_email(data.get('email'), user[0])
        print(status1)
        if not user.exists():
            return Response({'error': 'user not found'},status=status.HTTP_400_BAD_REQUEST)
        else:
            if status1:
                return Response({'message': 'new otp sent'},status=status.HTTP_200_OK)
            else:
                return Response({'error': f'try after sometime {time}'},status=status.HTTP_400_BAD_REQUEST)

def match_photo(user,MEDIA_DIR,known_image, unknown_image):
    try:
        ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
        image1 = face_recognition.api.load_image_file(known_image)

        image2 = face_recognition.api.load_image_file(unknown_image)
        print('image1', image1)
        print('image2', image2)
        image1_encoding = face_recognition.api.face_encodings(image1,model="large",num_jitters=5)[0]
        image2_encoding = face_recognition.api.face_encodings(image2,model="large",num_jitters=5)[0]

        print('image1 enc', image1_encoding)
        print('image 2 enc', image2_encoding)
        results = face_recognition.api.compare_faces(  [image1_encoding], image2_encoding, tolerance=0.4)
        print(results)
        return results
    except Exception as e:
        print(e)
        try:
            
            return Response({'error':'no face identified please try again'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except OSError as e:  # name the Exception `e`
            print("Failed with:", e.strerror)  # look what it says
            print("Error code:", e.code)
            return Response({'error':'no face identified please try again'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
class login(APIView):
    def post(self, request):
        results = None
        username = request.data['username']
        password = request.data['password']
        email = request.data['email']
        base_code = request.data['base64']
        format, imgstr = base_code.split(';base64,')
        ext = format.split('/')[-1]
        img = ContentFile(base64.b64decode(imgstr))
        file_name = "myphoto." + ext
        user = User.objects.filter(username=username)
        user.first().Loginimage.save(file_name, img, save=True)
        print(file_name)
        # print('user_id',user_id)
        MEDIA_DIR = '../backend/media/'
        results = match_photo(user,MEDIA_DIR,
            MEDIA_DIR + str(user.first().Signupimage),
            MEDIA_DIR + str(user.first().Loginimage)
        )
        print(results)
        if user.first() is None:
            return Response({'error': 'invalid username or password'}, status=status.HTTP_404_NOT_FOUND)
        if not user.first().check_password(password):
            return Response({'error': 'invalid username or password'}, status=status.HTTP_404_NOT_FOUND)
        else:
            if email == user.first().email:
                try:
                    if results[0] == True:
                        os.remove(MEDIA_DIR + str(user.first().Loginimage))
                        refresh = RefreshToken.for_user(user.first())
                        return Response({
                            'message': 'login successfull',
                            'refresh': str(refresh),
                            'access': str(refresh.access_token)},
                            status=status.HTTP_200_OK)
                    elif results[0] == False:
                        os.remove(MEDIA_DIR + str(user.first().Loginimage))
                        return Response({'error':'faces dont match please try again or signin again'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                except Exception as e:
                    os.remove(MEDIA_DIR + str(user.first().Loginimage))
                    return Response({'error':'couldnt match face please make sure that Your face is not tilted and its clear'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return Response({'errors': 'email not matched'}, status=status.HTTP_404_NOT_FOUND)

class getUser(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        print(user)
        payload = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'base64':user.base64
        }
        return Response({'status': "success", 'payload': payload})

class AddBlogs(CreateAPIView):
    parser_classes = [MultiPartParser,FormParser]
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = BlogPost.objects.all()
    serializer_class = BlogSerializer
    def post(self,request):
        user=request.user
        print(user)
        data = request.data
        print(data['user'])
        serializer = BlogSerializer(data=data)
        if serializer.is_valid():
            if str(user.username)==str(data['user']):
                serializer.save()
                return Response({'message':serializer.data},status=status.HTTP_200_OK)
            else:
                return Response({'error':'unauthorized'},status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class GetAllblogs(ListAPIView):
    pagination_class = AllblogPagination
    parser_classes = [MultiPartParser,FormParser]
    queryset = BlogPost.objects.all()
    serializer_class = BlogSerializer

class UpdateBlog(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    # queryset = BlogPost.objects.all()
    def patch(self,request,pk):
        authuser=request.user
        queryset = BlogPost.objects.get(blog_id=pk)
        user = queryset.user
        data = request.data
        serializer = BlogSerializer(queryset,data=data,partial=True)
        print(user)
        print(authuser)
        if serializer.is_valid():
            if authuser == user:
                serializer.save()
                return Response(serializer.data,status=status.HTTP_200_OK)
            else:
                return Response({'error':'unauthorised'},status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class DeleteBlog(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    # queryset = BlogPost.objects.all()
    def delete(self,request,pk):
        authuser=request.user
        queryset = BlogPost.objects.get(blog_id=pk)
        user = queryset.user
        print(user)
        print(authuser)
        if authuser == user:
            queryset.delete()
            return Response({'message':'deleted succesdully'},status=status.HTTP_200_OK)
        else:
            return Response({'error':'unauthorised'},status=status.HTTP_401_UNAUTHORIZED)

class GetUserBlogs(ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = BlogSerializer
    def get_queryset(self):
        user = self.request.user
        print(user)
        queryset = BlogPost.objects.filter(user=user)
        return queryset

class GetEachBlog(RetrieveAPIView):
    serializer_class = BlogSerializer
    queryset = BlogPost.objects.all()
    
class PostComment(CreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = BlogComment.objects.all()
    serializer_class = BlogCommentSerializer
    

class GetComments(ListAPIView):
    serializer_class = BlogCommentSerializer
    def get_queryset(self,**kwargs):
        pk = self.kwargs['pk']
        print(pk)
        queryset = BlogComment.objects.filter(Blog = pk)
        return queryset

class Filterblogs(ListAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogSerializer
    filter_backends = [SearchFilter]
    search_fields = ['title','desc']


class DeleteUser(DestroyAPIView):
    queryset = User.objects.filter(is_email_verified=False)
    serializer_class = UserSerializer