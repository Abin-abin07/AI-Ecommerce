"""
Admin configuration for authentication app.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser


class CustomUserAdmin(BaseUserAdmin):
    """Admin class for CustomUser model."""
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('phone', 'address', 'city', 'state', 'zip_code', 'profile_image', 'is_verified')}),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_verified', 'created_at')
    list_filter = ('is_verified', 'is_staff', 'is_active', 'created_at')
    search_fields = ('username', 'email', 'first_name', 'last_name')


admin.site.register(CustomUser, CustomUserAdmin)
