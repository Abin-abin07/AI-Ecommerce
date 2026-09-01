"""
Views for Products app.
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Category, Tag, Product, Review
from .serializers import (
    CategorySerializer, TagSerializer, ProductSerializer,
    ProductListSerializer, ReviewSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Category model."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    
    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        """Get products in a specific category."""
        category = self.get_object()
        products = category.products.filter(is_active=True)
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Tag model."""
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]
    
    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        """Get products with a specific tag."""
        tag = self.get_object()
        products = tag.products.filter(is_active=True)
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)


class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet for Product model."""
    queryset = Product.objects.filter(is_active=True)
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_featured', 'tags']
    search_fields = ['name', 'description', 'sku']
    ordering_fields = ['price', 'created_at', 'rating']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return ProductListSerializer
        return ProductSerializer
    
    @action(detail=True, methods=['post'])
    def add_review(self, request, pk=None):
        """Add a review to a product."""
        product = self.get_object()
        serializer = ReviewSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(product=product, user=request.user)
            return Response(
                {'message': 'Review added successfully', 'review': serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        """Get all reviews for a product."""
        product = self.get_object()
        reviews = product.reviews.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured products."""
        products = self.get_queryset().filter(is_featured=True)[:10]
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search products by query."""
        query = request.query_params.get('q', '')
        if query:
            products = self.get_queryset().filter(
                name__icontains=query
            ) | self.get_queryset().filter(
                description__icontains=query
            )
        else:
            products = self.get_queryset()
        
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)


class ReviewViewSet(viewsets.ModelViewSet):
    """ViewSet for Review model."""
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        """Filter reviews based on product if provided."""
        product_id = self.request.query_params.get('product_id')
        if product_id:
            return Review.objects.filter(product_id=product_id)
        return super().get_queryset()
    
    def perform_create(self, serializer):
        """Save review with current user."""
        serializer.save(user=self.request.user)
