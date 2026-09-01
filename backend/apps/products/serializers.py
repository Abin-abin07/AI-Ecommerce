"""
Serializers for Products app.
"""
from rest_framework import serializers
from .models import Category, Tag, Product, Review


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model."""
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image']


class TagSerializer(serializers.ModelSerializer):
    """Serializer for Tag model."""
    class Meta:
        model = Tag
        fields = ['id', 'name', 'description']


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for Review model."""
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'user_name', 'rating', 'title', 'comment', 'created_at']
        read_only_fields = ['id', 'created_at']


class ProductSerializer(serializers.ModelSerializer):
    """Serializer for Product model."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'discount_price',
            'image', 'category', 'category_name', 'tags', 'stock',
            'sku', 'is_featured', 'is_active', 'rating', 'review_count',
            'reviews', 'created_at'
        ]
        read_only_fields = ['id', 'rating', 'review_count', 'created_at']


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product lists."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'discount_price', 'image',
            'category_name', 'tags', 'sku', 'is_featured',
            'rating', 'review_count'
        ]
