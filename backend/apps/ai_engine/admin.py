"""
Admin configuration for AI Engine app.
"""
from django.contrib import admin
from .models import ImageEmbedding, VisionSearchQuery, RecommendedProduct


@admin.register(ImageEmbedding)
class ImageEmbeddingAdmin(admin.ModelAdmin):
    list_display = ('product', 'embedding_dimension', 'created_at')
    search_fields = ('product__name',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(VisionSearchQuery)
class VisionSearchQueryAdmin(admin.ModelAdmin):
    list_display = ('user', 'results_count', 'execution_time', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username',)
    readonly_fields = ('created_at',)


@admin.register(RecommendedProduct)
class RecommendedProductAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'recommendation_type', 'confidence_score', 'clicked', 'purchased')
    list_filter = ('recommendation_type', 'clicked', 'purchased', 'created_at')
    search_fields = ('user__username', 'product__name')
    readonly_fields = ('created_at',)
