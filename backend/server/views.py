import os
from venv import logger
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.http import FileResponse, JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from django.shortcuts import render, redirect
from django.shortcuts import get_object_or_404
from django.middleware.csrf import get_token
from django.contrib import messages
from django.urls import reverse
from django.contrib.auth.forms import AuthenticationForm
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth.decorators import login_required
from django.db.models import Sum, Count
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes, authentication_classes
from rest_framework import permissions, viewsets, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import User
from .serializers import UserSerializer
from datetime import date 
import json


class UserViewSet(viewsets.ModelViewSet):
    # def get(self, request):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    # Метод для управления правами доступа на основе действий
    def get_permissions(self):
        # удаление
        if self.action == 'destroy':
            self.permission_classes = [permissions.IsAdminUser, permissions.IsAuthenticated]
        # Если действия 'update' или 'partial_update' (обновление), то доступ разрешён только аутентифицированным пользователям
        elif self.action in ['update', 'partial_update']:
            self.permission_classes = [permissions.IsAuthenticated]
        # Для всех остальных действий доступ разрешён любому пользователю
        else:
            self.permission_classes = [permissions.AllowAny]
        # Возвращаем результат вызова родительского метода get_permissions()
        return super().get_permissions()

    # создание нового пользователя
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            # проверяем валидность данных
            serializer.is_valid(raise_exception=True)
            # сохраняем пользователя
            user = serializer.save()
            # проверяем что возвращаемый объект был экземпляром класса User, если нет, выдаём ошибку
            if not isinstance(user, User):
                raise ValueError("Создаваемый объект не пользователь!")
            token, _ = Token.objects.get_or_create(user=user)
        except Exception as error:
            return Response({'detail': str(error)}, status=status.HTTP_400_BAD_REQUEST)

        response_data = {
            'message': 'Успешная регистрация',
            'user': UserSerializer(user).data,
            'token': token.key,
        }
        return JsonResponse(response_data, status=status.HTTP_201_CREATED)
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_detail_user_list(request):
    if not request.user.is_staff:
        return Response({"detail": "You do not have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)
    users = User.objects.all().values(
        'id', 'username', 'first_name', 'last_name', 'email', 'is_staff', 'is_superuser'
    )
    if users:
        return Response(users, status=status.HTTP_200_OK)
    return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_user(request, user_id):
    user = User.objects.get(id=user_id)

    if user:
        user.delete()

        return JsonResponse({
            "message": "success",
        })
    
    return JsonResponse({
        "message": 'Пользователь не найден',
    }, status=404)

@csrf_exempt
def user_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            username = data.get('username')
            password = data.get('password')
            user = authenticate(request, username=username, password=password)
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Невалидный JSON'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_from_db = User.objects.get(username=username)
            if not user_from_db.is_active:
                user_from_db.is_active = True  # Устанавливаем флаг активности
                user_from_db.save()  # Сохраняем изменения в базе данных
            user = authenticate(request, username=username, password=password)
            if user:
                login(request, user)

                token, created = Token.objects.get_or_create(user=user)
                if not created:
                    token.delete()  # Удаляем старый токен
                    token = Token.objects.create(user=user)  # Создаём новый токен

                response_data = {
                    'message': 'Успешная авторизация',
                    'token': token.key,
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'is_superuser': user.is_superuser,
                        'is_active': user.is_active,
                        'is_staff': user.is_staff,
                    },
                }
                return JsonResponse(response_data, status=status.HTTP_200_OK)

            else:
                # Если пользователь не найден, возвращаем соответствующее сообщение
                return JsonResponse({'message': 'Неверный логин или пароль'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return JsonResponse({'message': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)
    elif request.method == 'GET':
        return JsonResponse({'message': 'GET-запрос не поддерживается для этого ресурса'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    # Возвращаем ответ для других методов
    return JsonResponse({'message': 'Метод не поддерживается'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@ensure_csrf_cookie
def user_logout(request):
    if request.method == 'POST':
        try:
            if not request.body:
                return JsonResponse({'message': 'Пустое тело запроса'}, status=status.HTTP_400_BAD_REQUEST)

            data = json.loads(request.body.decode('utf-8'))
            username = data.get('username')
            
            user_from_db = User.objects.get(username=username)
            user_from_db.is_active = False  # Устанавливаем флаг активности
            user_from_db.save()  # Сохраняем изменения в базе данных
            
            logout(request)
            response_data = {'message': 'Вы вышли из аккаунта'}
            print('вы разлогинились')
            return JsonResponse(response_data, status=status.HTTP_200_OK)


        except json.JSONDecodeError:
            return JsonResponse({'message': 'Невалидный JSON'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return JsonResponse({'message': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return JsonResponse({'message': 'Произошла ошибка при выходе из аккаунта', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return JsonResponse({'message': 'Метод не поддерживается'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@csrf_exempt
def me_view(request, user_id):
    # Получаем пользователя из базы данных
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    # Проверяем метод запроса
    if request.method == "PATCH":
        # Парсим JSON-данные из тела запроса
        data = JSONParser().parse(request)

        # Обновляем значения is_staff и is_superuser, если они присутствуют в запросе
        if "is_staff" in data:
            user.is_staff = data["is_staff"]
        if "is_superuser" in data:
            user.is_superuser = data["is_superuser"]

        # Сохраняем изменения в базе данных
        user.save()
        return JsonResponse({
            "id": user.id,
            "username": user.username,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
        }, status=200)

    # Если запрос не PATCH, возвращаем текущие данные пользователя
    return JsonResponse({
        "id": user.id,
        "username": user.username,
        "is_staff": user.is_staff,
        "is_superuser": user.is_superuser,
    })
