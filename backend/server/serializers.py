from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'password',
            'last_login',
            'is_superuser',
            'username',
            'is_staff',
            'date_joined',
            'email',
            # 'first_name',
            # 'last_name',
            'is_active',
        ]

    def create(self, validated_date):
        print('validated_data before create:', validated_date)
        validated_date['password'] = make_password(validated_date['password'])
        return super().create(validated_date)
    
    def update(self, instance, validated_date):
        if 'password' in validated_date:
            validated_date['password'] = make_password(validated_date['password'])
        return super().update(instance, validated_date)
