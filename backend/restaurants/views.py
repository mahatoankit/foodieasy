from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Restaurant, MenuItem
from .serializers import (
    RestaurantSerializer,
    RestaurantListSerializer,
    RestaurantCreateSerializer,
    MenuItemSerializer,
    MenuItemCreateSerializer
)
from .permissions import IsRestaurantOwner, IsRestaurantOwnerOrReadOnly


class RestaurantViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Restaurant operations.
    
    list: Get all restaurants (public)
    retrieve: Get single restaurant with menu (public)
    create: Create restaurant (restaurant owner only)
    update: Update restaurant (owner only)
    destroy: Delete restaurant (owner only)
    """
    queryset = Restaurant.objects.filter(is_active=True).select_related('owner')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['cuisine_type', 'is_active']
    search_fields = ['name', 'description', 'cuisine_type']
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Return appropriate serializer class"""
        if self.action == 'list':
            return RestaurantListSerializer
        elif self.action == 'create':
            return RestaurantCreateSerializer
        return RestaurantSerializer
    
    def get_permissions(self):
        """Set permissions based on action"""
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        elif self.action == 'create':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated, IsRestaurantOwner]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        """Create restaurant and assign to current user"""
        serializer.save(owner=self.request.user)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_restaurant(self, request):
        """
        Get the restaurant owned by the current user.
        
        GET /api/restaurants/my_restaurant/
        """
        if request.user.role != 'RESTAURANT_OWNER':
            return Response(
                {'detail': 'Only restaurant owners can access this endpoint.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            restaurant = Restaurant.objects.get(owner=request.user)
            serializer = RestaurantSerializer(restaurant)
            return Response(serializer.data)
        except Restaurant.DoesNotExist:
            return Response(
                {'detail': 'You do not have a restaurant yet.'},
                status=status.HTTP_404_NOT_FOUND
            )


class MenuItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet for MenuItem operations.
    
    list: Get all menu items (filterable by restaurant)
    retrieve: Get single menu item
    create: Create menu item (restaurant owner only)
    update: Update menu item (owner only)
    destroy: Delete menu item (owner only)
    """
    queryset = MenuItem.objects.all().select_related('restaurant')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['restaurant', 'category', 'is_available']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['category', 'name']
    
    def get_serializer_class(self):
        """Return appropriate serializer class"""
        if self.action == 'create':
            return MenuItemCreateSerializer
        return MenuItemSerializer
    
    def get_permissions(self):
        """Set permissions based on action"""
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated, IsRestaurantOwner]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """Filter queryset based on query params"""
        queryset = super().get_queryset()
        
        # Filter by restaurant_id if provided
        restaurant_id = self.request.query_params.get('restaurant_id', None)
        if restaurant_id:
            queryset = queryset.filter(restaurant_id=restaurant_id)
        
        return queryset
    
    def perform_create(self, serializer):
        """Create menu item for the user's restaurant"""
        try:
            restaurant = Restaurant.objects.get(owner=self.request.user)
            serializer.save(restaurant=restaurant)
        except Restaurant.DoesNotExist:
            raise ValueError('You must have a restaurant before creating menu items.')
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_menu(self, request):
        """
        Get menu items for the current user's restaurant.
        
        GET /api/menu-items/my_menu/
        """
        if request.user.role != 'RESTAURANT_OWNER':
            return Response(
                {'detail': 'Only restaurant owners can access this endpoint.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            restaurant = Restaurant.objects.get(owner=request.user)
            menu_items = MenuItem.objects.filter(restaurant=restaurant)
            serializer = MenuItemSerializer(menu_items, many=True)
            return Response(serializer.data)
        except Restaurant.DoesNotExist:
            return Response(
                {'detail': 'You do not have a restaurant yet.'},
                status=status.HTTP_404_NOT_FOUND
            )
