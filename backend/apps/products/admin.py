"""
Admin configuration for products app.
"""
from django.contrib import admin
from .models import Category, Tag, Product, Review


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'price', 'stock', 'is_featured', 'is_active', 'rating', 'created_at')
    list_filter = ('category', 'is_featured', 'is_active', 'created_at')
    search_fields = ('name', 'sku', 'description')
    readonly_fields = ('rating', 'review_count', 'created_at', 'updated_at')
    fieldsets = (
        ('Product Information', {
            'fields': ('name', 'description', 'sku', 'category', 'tags')
        }),
        ('Pricing', {
            'fields': ('price', 'discount_price')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Inventory', {
            'fields': ('stock', 'is_active')
        }),
        ('Metadata', {
            'fields': ('is_featured', 'rating', 'review_count', 'created_at', 'updated_at')
        }),
    )


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('product__name', 'user__username', 'title')
    readonly_fields = ('created_at', 'updated_at')
