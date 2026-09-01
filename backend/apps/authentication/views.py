"""
Authentication Views - Login, Register, and Token management.
"""
import random
import datetime
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.conf import settings

from .serializers import (
    UserSerializer, RegisterSerializer, CustomTokenObtainPairSerializer
)

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom JWT token obtain view."""
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


class RegisterView(generics.CreateAPIView):
    """User registration endpoint."""
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            'message': 'User registered successfully',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Get current user profile."""
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """Update user profile."""
    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Profile updated successfully', 'user': serializer.data})
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def logout(request):
    """Logout endpoint (token blacklist can be implemented)."""
    return Response({'message': 'Logged out successfully'})


# ──────────────────────────────────────────────────────────────
# OTP Password Reset Endpoints
# ──────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp(request):
    """
    Step 1 – Generate a 6-digit OTP, send it via SMTP email, and store it in cache for 10 minutes.
    """
    email = request.data.get('email', '').strip().lower()
    if not email:
        return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email__iexact=email)
    except User.DoesNotExist:
        # Do NOT reveal whether the email exists (security best-practice).
        # Respond as if the OTP was sent.
        return Response({'message': 'If an account with that email exists, an OTP has been sent.'})

    otp = str(random.randint(100000, 999999))
    cache_key = f'password_reset_otp_{email}'
    # Store OTP for 10 minutes
    cache.set(cache_key, otp, timeout=600)

    print(f"OTP FOR TESTING ({email}): {otp}")

    # Send OTP email via SMTP
    subject = "NEXIS - Password Reset OTP"
    message = (
        f"Hello,\n\n"
        f"Your OTP code to reset your NEXIS account password is: {otp}\n\n"
        f"This code will expire in 10 minutes.\n"
        f"If you did not request a password reset, please ignore this email.\n\n"
        f"Best regards,\n"
        f"NEXIS Team"
    )
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', None) or getattr(settings, 'EMAIL_HOST_USER', None)

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=from_email,
            recipient_list=[user.email],
            fail_silently=False,
        )
        print(f"Successfully sent OTP email to {user.email}")
    except Exception as e:
        print(f"FAILED TO SEND OTP EMAIL to {user.email}: {e}")
        return Response(
            {'error': f'Failed to send OTP email: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return Response({
        'message': 'If an account with that email exists, an OTP has been sent.'
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    """
    Step 2 – Verify the OTP submitted by the user.
    Returns a short-lived reset_token the frontend uses in Step 3.
    """
    email = request.data.get('email', '').strip().lower()
    otp   = request.data.get('otp', '').strip()

    if not email or not otp:
        return Response({'error': 'Email and OTP are required.'}, status=status.HTTP_400_BAD_REQUEST)

    cache_key = f'password_reset_otp_{email}'
    stored_otp = cache.get(cache_key)

    if stored_otp is None:
        return Response({'error': 'OTP has expired. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)

    if stored_otp != otp:
        return Response({'error': 'Invalid OTP. Please try again.'}, status=status.HTTP_400_BAD_REQUEST)

    # OTP is valid – invalidate it immediately and issue a short-lived reset token
    cache.delete(cache_key)
    reset_token = str(random.randint(10**11, 10**12 - 1))   # 12-digit one-time token
    reset_key   = f'password_reset_token_{email}'
    cache.set(reset_key, reset_token, timeout=300)           # valid for 5 minutes

    return Response({'message': 'OTP verified successfully.', 'reset_token': reset_token})


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    """
    Step 3 – Set a new password after OTP verification.
    Requires the reset_token issued by verify_otp.
    """
    email        = request.data.get('email', '').strip().lower()
    reset_token  = request.data.get('reset_token', '').strip()
    new_password = request.data.get('new_password', '')
    confirm_password = request.data.get('confirm_password', '')

    if not all([email, reset_token, new_password, confirm_password]):
        return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if new_password != confirm_password:
        return Response({'error': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)

    reset_key    = f'password_reset_token_{email}'
    stored_token = cache.get(reset_key)

    if stored_token is None or stored_token != reset_token:
        return Response({'error': 'Reset session has expired or is invalid. Please start over.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email__iexact=email)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    try:
        validate_password(new_password, user)
    except ValidationError as e:
        return Response({'error': ' '.join(e.messages)}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()

    # Invalidate the reset token
    cache.delete(reset_key)

    return Response({'message': 'Password reset successfully. Please sign in with your new password.'})

