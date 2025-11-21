from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RestaurantViewSet, MenuItemViewSet

app_name = 'restaurants'

router = DefaultRouter()
router.register(r'restaurants', RestaurantViewSet, basename='restaurant')
router.register(r'menu-items', MenuItemViewSet, basename='menuitem')

urlpatterns = [
    path('', include(router.urls)),
]
