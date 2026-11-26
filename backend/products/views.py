from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets, mixins
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Category, Product, ProductImage
from .serializers import CategorySerializer, ProductSerializer
from marketplace.permissions import IsSellerOrAdmin, IsAdminUser


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().select_related('seller', 'category').prefetch_related('images')
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'condition', 'is_active', 'is_sold']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['created_at', 'price']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        if self.action in ['create', 'mine']:
            return [IsAuthenticated()]
        return [IsSellerOrAdmin()]

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == 'list':
            qs = qs.filter(is_active=True, is_sold=False)
        return qs

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def mine(self, request):
        qs = Product.objects.filter(seller=request.user).select_related('category').prefetch_related('images').order_by('-created_at')
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    def perform_update(self, serializer):
        obj = self.get_object()
        if obj.seller != self.request.user and not self.request.user.is_staff:
            self.permission_denied(self.request)
        serializer.save()

    def perform_destroy(self, instance):
        if instance.seller != self.request.user and not self.request.user.is_staff:
            self.permission_denied(self.request)
        instance.delete()

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def mark_sold(self, request, pk=None):
        product = get_object_or_404(Product, pk=pk)
        if product.seller != request.user and not request.user.is_staff:
            return Response({'error': 'Not allowed'}, status=status.HTTP_403_FORBIDDEN)
        product.is_sold = True
        product.is_active = False
        product.save()
        return Response({'status': 'marked as sold'})
