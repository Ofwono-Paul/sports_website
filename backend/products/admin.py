from django.contrib import admin
from .models import Category, Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'seller', 'category', 'price', 'condition', 'is_active', 'is_sold', 'created_at')
    list_filter = ('is_active', 'is_sold', 'condition', 'category', 'created_at')
    search_fields = ('title', 'description', 'seller__username', 'location')
    list_editable = ('is_active', 'price')
    inlines = [ProductImageInline]
    raw_id_fields = ('seller',)


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'is_primary', 'uploaded_at')
    list_filter = ('is_primary',)
