"""
URL configuration for authentication app.
"""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView, RegisterView, user_profile, 
    update_profile, logout, send_otp, verify_otp, reset_password
)

urlpatterns = [
    # JWT Token endpoints
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', user_profile, name='user_profile'),
    path('profile/update/', update_profile, name='update_profile'),
    path('logout/', logout, name='logout'),

    # Password Reset via OTP
    path('password-reset/send-otp/', send_otp, name='send_otp'),
    path('password-reset/verify-otp/', verify_otp, name='verify_otp'),
    path('password-reset/reset/', reset_password, name='reset_password'),
]
