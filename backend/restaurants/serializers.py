from rest_framework import serializers
from .models import Restaurant, MenuItem
from django.contrib.auth import get_user_model

User = get_user_model()


class MenuItemSerializer(serializers.ModelSerializer):
    """
    Serializer for menu items.
    """
    
    class Meta:
        model = MenuItem
        fields = [
            'id', 'restaurant', 'name', 'description',
            'price', 'category', 'is_available',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class RestaurantSerializer(serializers.ModelSerializer):
    """
    Serializer for restaurants with nested menu items.
    """
    owner_name = serializers.SerializerMethodField()
    owner_email = serializers.SerializerMethodField()
    menu_items = MenuItemSerializer(many=True, read_only=True)
    menu_items_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Restaurant
        fields = [
            'id', 'owner', 'owner_name', 'owner_email',
            'name', 'description', 'address', 'phone_number',
            'cuisine_type', 'is_active', 'menu_items',
            'menu_items_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']
    
    def get_owner_name(self, obj):
        """Return owner's full name"""
        return obj.owner.full_name
    
    def get_owner_email(self, obj):
        """Return owner's email"""
        return obj.owner.email
    
    def get_menu_items_count(self, obj):
        """Return count of menu items"""
        return obj.menu_items.count()


class RestaurantListSerializer(serializers.ModelSerializer):
    """
    Serializer for restaurant list (without nested menu items for performance).
    """
    owner_name = serializers.SerializerMethodField()
    menu_items_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Restaurant
        fields = [
            'id', 'owner_name', 'name', 'description',
            'address', 'phone_number', 'cuisine_type',
            'is_active', 'menu_items_count', 'created_at'
        ]
    
    def get_owner_name(self, obj):
        """Return owner's full name"""
        return obj.owner.full_name
    
    def get_menu_items_count(self, obj):
        """Return count of menu items"""
        return obj.menu_items.count()


class RestaurantCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a restaurant.
    """
    
    class Meta:
        model = Restaurant
        fields = [
            'name', 'description', 'address',
            'phone_number', 'cuisine_type'
        ]
    
    def validate(self, attrs):
        """Validate restaurant creation"""
        request = self.context.get('request')
        
        if request and request.user:
            # Check if user is a restaurant owner
            if request.user.role != 'RESTAURANT_OWNER':
                raise serializers.ValidationError(
                    'Only users with RESTAURANT_OWNER role can create restaurants.'
                )
            
            # Check if user already has a restaurant
            if hasattr(request.user, 'restaurant'):
                raise serializers.ValidationError(
                    'You already have a restaurant. Each owner can only have one restaurant.'
                )
        
        return attrs
    
    def create(self, validated_data):
        """Create restaurant and assign to current user"""
        request = self.context.get('request')
        validated_data['owner'] = request.user
        return super().create(validated_data)


class MenuItemCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating menu items.
    """
    
    class Meta:
        model = MenuItem
        fields = [
            'name', 'description', 'price',
            'category', 'is_available'
        ]
    
    def validate_price(self, value):
        """Validate price is positive"""
        if value <= 0:
            raise serializers.ValidationError('Price must be greater than 0.')
        return value
