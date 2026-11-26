from django.urls import path
from . import views

urlpatterns = [
    path('cart/', views.CartView.as_view(), name='cart'),
    path('cart/add/', views.AddToCartView.as_view(), name='cart-add'),
    path('cart/item/<int:item_id>/', views.CartItemUpdateView.as_view(), name='cart-item-update'),
    path('cart/clear/', views.CartClearView.as_view(), name='cart-clear'),
    path('checkout/', views.CheckoutView.as_view(), name='checkout'),
    path('orders/', views.OrderListView.as_view(), name='order-list'),
    path('orders/<int:order_id>/', views.OrderDetailView.as_view(), name='order-detail'),
]
