from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, me_view, user_login, user_logout, get_detail_user_list, delete_user
from .views import UserViewSet, user_login, user_logout
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static


router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
# router.register(r'files', FileViewSet, basename='file')

urlpatterns = [
    path("login/", user_login, name='user-login'),
    path("logout/", user_logout, name='user-logout'),
    path("register/", UserViewSet.as_view({'post': 'create'}), name='user-register'),
    path('admin', get_detail_user_list),
    path('auth/<int:user_id>/', me_view),
    path('detail_users_list/', get_detail_user_list),
    path('delete_user/<int:user_id>/', delete_user),
    path('', include(router.urls)),
] + router.urls

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
