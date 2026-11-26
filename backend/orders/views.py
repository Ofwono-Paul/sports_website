from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from products.models import Product
from .models import Cart, CartItem, Order, OrderItem
from .serializers import CartSerializer, CartItemSerializer, AddToCartSerializer, OrderSerializer, CheckoutSerializer


def get_user_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart = get_user_cart(request.user)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)


class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        product = get_object_or_404(Product, id=serializer.validated_data['product_id'], is_active=True, is_sold=False)
        quantity = serializer.validated_data.get('quantity', 1)
        cart = get_user_cart(request.user)
        item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            item.quantity += quantity
        else:
            item.quantity = quantity
        item.save()
        return Response(CartSerializer(get_user_cart(request.user), context={'request': request}).data, status=status.HTTP_200_OK)


class CartItemUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, item_id):
        cart = get_user_cart(request.user)
        item = get_object_or_404(CartItem, id=item_id, cart=cart)
        quantity = request.data.get('quantity')
        if quantity is None:
            return Response({'error': 'quantity is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            quantity = int(quantity)
        except (TypeError, ValueError):
            return Response({'error': 'quantity must be an integer'}, status=status.HTTP_400_BAD_REQUEST)
        if quantity < 1:
            item.delete()
        else:
            item.quantity = quantity
            item.save()
        return Response(CartSerializer(get_user_cart(request.user), context={'request': request}).data)

    def delete(self, request, item_id):
        cart = get_user_cart(request.user)
        item = get_object_or_404(CartItem, id=item_id, cart=cart)
        item.delete()
        return Response(CartSerializer(get_user_cart(request.user), context={'request': request}).data)


class CartClearView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        cart = get_user_cart(request.user)
        cart.items.all().delete()
        return Response(CartSerializer(cart, context={'request': request}).data)


class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        cart = get_user_cart(request.user)
        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            order = Order.objects.create(
                user=request.user,
                total=cart.total_price,
                shipping_address=serializer.validated_data['shipping_address'],
                phone=serializer.validated_data.get('phone', ''),
            )
            for item in cart.items.all():
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=item.product.price,
                )
            cart.items.all().delete()
        return Response(OrderSerializer(order, context={'request': request}).data, status=status.HTTP_201_CREATED)


class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Order.objects.filter(user=request.user).prefetch_related('items__product').order_by('-created_at')
        serializer = OrderSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)


class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        qs = Order.objects.filter(user=request.user) if not request.user.is_staff else Order.objects.all()
        order = get_object_or_404(qs, id=order_id)
        serializer = OrderSerializer(order, context={'request': request})
        return Response(serializer.data)
