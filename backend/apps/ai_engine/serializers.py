"""
Serializers for AI Engine app.
"""
from rest_framework import serializers
from .models import ImageEmbedding, VisionSearchQuery, RecommendedProduct
from apps.products.serializers import ProductListSerializer


class ImageEmbeddingSerializer(serializers.ModelSerializer):
    """Serializer for ImageEmbedding model."""
    product = ProductListSerializer(read_only=True)
    
    class Meta:
        model = ImageEmbedding
        fields = ['id', 'product', 'embedding_dimension', 'created_at']


class VisionSearchQuerySerializer(serializers.ModelSerializer):
    """Serializer for VisionSearchQuery model."""
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = VisionSearchQuery
        fields = ['id', 'user_name', 'query_image', 'results_count', 'execution_time', 'created_at']


class RecommendedProductSerializer(serializers.ModelSerializer):
    """Serializer for RecommendedProduct model."""
    product = ProductListSerializer(read_only=True)
    
    class Meta:
        model = RecommendedProduct
        fields = ['id', 'product', 'recommendation_type', 'confidence_score', 'reason', 'clicked', 'purchased', 'created_at']


class VisualSearchSerializer(serializers.Serializer):
    """Serializer for visual search request."""
    image = serializers.ImageField(required=True)
    top_k = serializers.IntegerField(default=10, min_value=1, max_value=50)
    similarity_threshold = serializers.FloatField(default=0.5, min_value=0.0, max_value=1.0)
