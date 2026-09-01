"""
AI Engine Models - Vision search and embeddings.
"""
from django.db import models
from apps.products.models import Product
from django.contrib.auth import get_user_model

User = get_user_model()


class ImageEmbedding(models.Model):
    """Store image embeddings for visual search."""
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='embedding')
    embedding_vector = models.BinaryField()  # Store TensorFlow embedding as binary
    embedding_dimension = models.IntegerField(default=1024)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Image Embedding'
        verbose_name_plural = 'Image Embeddings'

    def __str__(self):
        return f"Embedding for {self.product.name}"


class VisionSearchQuery(models.Model):
    """Log vision search queries for analytics."""
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='vision_searches')
    query_image = models.ImageField(upload_to='vision_queries/')
    results_count = models.IntegerField(default=0)
    execution_time = models.FloatField(help_text="Time in seconds")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Vision Search Query'
        verbose_name_plural = 'Vision Search Queries'

    def __str__(self):
        return f"Vision search by {self.user.username if self.user else 'anonymous'} at {self.created_at}"


class RecommendedProduct(models.Model):
    """AI-generated product recommendations."""
    RECOMMENDATION_TYPES = [
        ('visual_similarity', 'Visual Similarity'),
        ('collaborative', 'Collaborative Filtering'),
        ('content_based', 'Content-Based'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recommendations')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    recommendation_type = models.CharField(max_length=20, choices=RECOMMENDATION_TYPES)
    confidence_score = models.FloatField(default=0.0)
    reason = models.TextField(blank=True, null=True)
    clicked = models.BooleanField(default=False)
    purchased = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-confidence_score']
        unique_together = ('user', 'product', 'recommendation_type')
        verbose_name = 'Recommended Product'
        verbose_name_plural = 'Recommended Products'

    def __str__(self):
        return f"{self.product.name} recommended to {self.user.username}"
