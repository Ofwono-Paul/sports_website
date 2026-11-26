from rest_framework import serializers
from django.contrib.auth.models import User
from products.models import Product
from .models import Cart, CartItem, Order, OrderItem


class CartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(is_active=True, is_sold=False),
        source='product', write_only=True
    )
    product = serializers.SerializerMethodField(read_only=True)
    line_total = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CartItem
        fields = ('id', 'product', 'product_id', 'quantity', 'line_total')
        read_only_fields = ('id', 'line_total')

    def get_product(self, obj):
        from products.serializers import ProductSerializer
        return ProductSerializer(obj.product, context=self.context).data

    def get_line_total(self, obj):
        return obj.line_total


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField(read_only=True)
    item_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Cart
        fields = ('id', 'items', 'total_price', 'item_count', 'updated_at')
        read_only_fields = ('id', 'total_price', 'item_count', 'updated_at')

    def get_total_price(self, obj):
        return obj.total_price

    def get_item_count(self, obj):
        return obj.item_count


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)

    def validate_product_id(self, value):
        from products.models import Product
        try:
            product = Product.objects.get(id=value, is_active=True, is_sold=False)
        except Product.DoesNotExist:
            raise serializers.ValidationError('Product not found or unavailable.')
        return value


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'quantity', 'price', 'line_total')
        read_only_fields = ('id', 'line_total')


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'user', 'total', 'status', 'shipping_address', 'phone', 'created_at', 'updated_at', 'items')
        read_only_fields = ('id', 'user', 'total', 'status', 'created_at', 'updated_at', 'items')


class CheckoutSerializer(serializers.Serializer):
    shipping_address = serializers.CharField(required=True)
    phone = serializers.CharField(required=False, allow_blank=True)
