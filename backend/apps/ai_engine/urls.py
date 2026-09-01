"""
URL configuration for AI Engine app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VisualSearchViewSet, RecommendationViewSet, EmbeddingViewSet

router = DefaultRouter()
router.register(r'visual-search', VisualSearchViewSet, basename='visual-search')
router.register(r'recommendations', RecommendationViewSet, basename='recommendation')
router.register(r'embeddings', EmbeddingViewSet, basename='embedding')

urlpatterns = [
    path('', include(router.urls)),
]
