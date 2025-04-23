from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from uuid import uuid4
import os
from pathlib import Path


allowed_extensions = ['tiff', 'jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx', 'gif', 'exe']

class User(AbstractUser):
    username = models.CharField(verbose_name='Логин', max_length=30, unique=True) # логин пользователя
    email = models.EmailField(verbose_name='email адрес', max_length=100, unique=True) # электронная почта
    is_active = models.BooleanField(verbose_name='active', default=False) # активен ли пользователь
    is_superuser = models.BooleanField(default=False) # возможность редактирования'

    def save(self, *args, **kwargs):
        # if not self.folder_name:
        #     self.folder_name = f'{self.username}_folder'
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username
    
    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = "Список пользователей"
        ordering = ('id', 'username',)
