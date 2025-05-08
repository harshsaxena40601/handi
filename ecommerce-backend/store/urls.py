from django.urls import path
from .views import ProductList, ProductDetail  # import the detail view

urlpatterns = [
    path('products/', ProductList.as_view(), name='product-list'),
   path('products/<int:product_id>/', ProductDetail.as_view(), name='product-detail'),
]
