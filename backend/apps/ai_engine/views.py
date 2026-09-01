"""
Views for AI Engine app - Vision search and recommendations.
"""
import time
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser

from .models import ImageEmbedding, VisionSearchQuery, RecommendedProduct
from .serializers import (
    ImageEmbeddingSerializer, VisionSearchQuerySerializer,
    RecommendedProductSerializer, VisualSearchSerializer
)
from apps.products.models import Product
from apps.products.serializers import ProductListSerializer


class VisualSearchViewSet(viewsets.ViewSet):
    """ViewSet for visual/image-based product search."""
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser,)
    
    @action(detail=False, methods=['post'])
    def search(self, request):
        """Perform visual search with image upload."""
        serializer = VisualSearchSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        start_time = time.time()
        
        # Placeholder for actual TensorFlow embedding extraction
        # In production, this would extract features from the uploaded image
        # and compare against product embeddings
        
        # For now, return featured products as mock results
        top_k = serializer.validated_data.get('top_k', 10)
        products = Product.objects.filter(is_active=True).order_by('-rating')[:top_k]
        
        execution_time = time.time() - start_time
        
        # Log the search query
        VisionSearchQuery.objects.create(
            user=request.user,
            query_image=serializer.validated_data['image'],
            results_count=len(products),
            execution_time=execution_time
        )
        
        product_data = ProductListSerializer(products, many=True).data
        
        return Response({
            'results': product_data,
            'count': len(products),
            'execution_time': execution_time
        })
    
    @action(detail=False, methods=['get'])
    def history(self, request):
        """Get user's vision search history."""
        queries = VisionSearchQuery.objects.filter(user=request.user)
        serializer = VisionSearchQuerySerializer(queries, many=True)
        return Response(serializer.data)


class RecommendationViewSet(viewsets.ViewSet):
    """ViewSet for AI-powered product recommendations."""
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def personalized(self, request):
        """Get personalized recommendations for current user."""
        user = request.user
        limit = request.query_params.get('limit', 10)
        
        # Get recommendations from database
        recommendations = RecommendedProduct.objects.filter(user=user).order_by('-confidence_score')[:limit]
        serializer = RecommendedProductSerializer(recommendations, many=True)
        
        return Response({
            'recommendations': serializer.data,
            'count': len(serializer.data)
        })
    
    @action(detail=False, methods=['get'])
    def trending(self, request):
        """Get trending products (high reviews, high ratings)."""
        limit = request.query_params.get('limit', 10)
        products = Product.objects.filter(
            is_active=True,
            review_count__gt=0
        ).order_by('-rating', '-review_count')[:limit]
        
        serializer = ProductListSerializer(products, many=True)
        return Response({
            'products': serializer.data,
            'count': len(serializer.data)
        })
    
    @action(detail=False, methods=['post'])
    def track_interaction(self, request):
        """Track user interaction with recommendations."""
        recommendation_id = request.data.get('recommendation_id')
        interaction_type = request.data.get('type')  # 'click' or 'purchase'
        
        try:
            recommendation = RecommendedProduct.objects.get(id=recommendation_id, user=request.user)
            
            if interaction_type == 'click':
                recommendation.clicked = True
            elif interaction_type == 'purchase':
                recommendation.purchased = True
            
            recommendation.save()
            
            return Response({
                'message': f'Interaction tracked: {interaction_type}',
                'recommendation': RecommendedProductSerializer(recommendation).data
            })
        except RecommendedProduct.DoesNotExist:
            return Response(
                {'error': 'Recommendation not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class EmbeddingViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for product embeddings."""
    queryset = ImageEmbedding.objects.all()
    serializer_class = ImageEmbeddingSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def by_product(self, request):
        """Get embedding for a specific product."""
        product_id = request.query_params.get('product_id')
        
        try:
            embedding = ImageEmbedding.objects.get(product_id=product_id)
            serializer = self.get_serializer(embedding)
            return Response(serializer.data)
        except ImageEmbedding.DoesNotExist:
            return Response(
                {'error': 'Embedding not found for this product'},
                status=status.HTTP_404_NOT_FOUND
            )
