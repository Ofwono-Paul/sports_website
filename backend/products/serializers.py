from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'image', 'product_count')

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True, is_sold=False).count()


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('id', 'image', 'is_primary')


class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name')


class ProductSerializer(serializers.ModelSerializer):
    seller = UserMiniSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, required=False, allow_null=True
    )
    images = ProductImageSerializer(many=True, read_only=True)
    image_files = serializers.ListField(
        child=serializers.ImageField(max_length=100000, allow_empty_file=False, use_url=False),
        write_only=True, required=False
    )

    class Meta:
        model = Product
        fields = (
            'id', 'seller', 'category', 'category_id', 'title', 'description',
            'price', 'condition', 'location', 'is_active', 'is_sold',
            'created_at', 'updated_at', 'images', 'image_files',
        )
        read_only_fields = ('id', 'seller', 'is_sold', 'created_at', 'updated_at', 'images')

    def create(self, validated_data):
        image_files = validated_data.pop('image_files', [])
        validated_data['seller'] = self.context['request'].user
        product = Product.objects.create(**validated_data)
        self._save_images(product, image_files)
        return product

    def update(self, instance, validated_data):
        image_files = validated_data.pop('image_files', None)
        product = super().update(instance, validated_data)
        if image_files is not None:
            product.images.all().delete()
            self._save_images(product, image_files)
        return product

    def _save_images(self, product, image_files):
        for idx, f in enumerate(image_files):
            ProductImage.objects.create(product=product, image=f, is_primary=(idx == 0))
