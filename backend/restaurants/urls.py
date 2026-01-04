from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RestaurantViewSet, MenuItemViewSet, RestaurantReviewViewSet, MenuItemReviewViewSet

app_name = 'restaurants'

router = DefaultRouter()
router.register(r'restaurants', RestaurantViewSet, basename='restaurant')
router.register(r'menu-items', MenuItemViewSet, basename='menuitem')
router.register(r'restaurant-reviews', RestaurantReviewViewSet, basename='restaurant-review')
router.register(r'menu-item-reviews', MenuItemReviewViewSet, basename='menu-item-review')

urlpatterns = [
    path('', include(router.urls)),
]
