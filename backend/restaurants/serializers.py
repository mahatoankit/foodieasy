from rest_framework import serializers
from .models import Restaurant, MenuItem, RestaurantReview, MenuItemReview
from django.contrib.auth import get_user_model

User = get_user_model()


class MenuItemSerializer(serializers.ModelSerializer):
    """
    Serializer for menu items.
    """
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()
    
    class Meta:
        model = MenuItem
        fields = [
            'id', 'restaurant', 'name', 'description',
            'price', 'category', 'is_available',
            'average_rating', 'review_count',
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
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Restaurant
        fields = [
            'id', 'owner', 'owner_name', 'owner_email',
            'name', 'description', 'address', 'phone_number',
            'cuisine_type', 'delivery_time', 'is_open', 'is_active', 'menu_items',
            'menu_items_count', 'average_rating', 'review_count',
            'created_at', 'updated_at'
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
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Restaurant
        fields = [
            'id', 'owner_name', 'name', 'description',
            'address', 'phone_number', 'cuisine_type',
            'delivery_time', 'is_open', 'is_active', 'menu_items_count',
            'average_rating', 'review_count', 'created_at'
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
            'phone_number', 'cuisine_type', 'delivery_time', 'is_open'
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


class RestaurantReviewSerializer(serializers.ModelSerializer):
    """
    Serializer for restaurant reviews.
    """
    user_name = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()
    restaurant_name = serializers.SerializerMethodField()
    
    class Meta:
        model = RestaurantReview
        fields = [
            'id', 'restaurant', 'restaurant_name', 'user', 'user_name', 'user_email',
            'rating', 'comment', 'is_verified_purchase',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'is_verified_purchase', 'created_at', 'updated_at']
    
    def get_user_name(self, obj):
        """Return user's full name"""
        return obj.user.full_name if obj.user.full_name else obj.user.email
    
    def get_user_email(self, obj):
        """Return user's email"""
        return obj.user.email
    
    def get_restaurant_name(self, obj):
        """Return restaurant name"""
        return obj.restaurant.name
    
    def validate_rating(self, value):
        """Validate rating is between 1 and 5"""
        if value < 1 or value > 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value
    
    def validate(self, attrs):
        """Validate user can review this restaurant"""
        request = self.context.get('request')
        restaurant = attrs.get('restaurant')
        
        if request and request.user and restaurant:
            # Check if this is an update or create
            if not self.instance:  # Creating new review
                # Check if user has already reviewed this restaurant
                if RestaurantReview.objects.filter(user=request.user, restaurant=restaurant).exists():
                    raise serializers.ValidationError(
                        'You have already reviewed this restaurant. You can edit your existing review.'
                    )
            
            # Check if user has completed at least one order from this restaurant
            from orders.models import Order
            has_ordered = Order.objects.filter(
                customer=request.user,
                restaurant=restaurant,
                status='DELIVERED'
            ).exists()
            
            if not has_ordered:
                raise serializers.ValidationError(
                    'You can only review restaurants you have ordered from.'
                )
            
            # Set verified purchase flag
            attrs['is_verified_purchase'] = True
        
        return attrs
    
    def create(self, validated_data):
        """Create review and assign to current user"""
        request = self.context.get('request')
        validated_data['user'] = request.user
        return super().create(validated_data)


class MenuItemReviewSerializer(serializers.ModelSerializer):
    """
    Serializer for menu item reviews.
    """
    user_name = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()
    menu_item_name = serializers.SerializerMethodField()
    restaurant_name = serializers.SerializerMethodField()
    
    class Meta:
        model = MenuItemReview
        fields = [
            'id', 'menu_item', 'menu_item_name', 'restaurant_name',
            'user', 'user_name', 'user_email',
            'rating', 'comment', 'is_verified_purchase',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'is_verified_purchase', 'created_at', 'updated_at']
    
    def get_user_name(self, obj):
        """Return user's full name"""
        return obj.user.full_name if obj.user.full_name else obj.user.email
    
    def get_user_email(self, obj):
        """Return user's email"""
        return obj.user.email
    
    def get_menu_item_name(self, obj):
        """Return menu item name"""
        return obj.menu_item.name
    
    def get_restaurant_name(self, obj):
        """Return restaurant name through menu item"""
        return obj.menu_item.restaurant.name
    
    def validate_rating(self, value):
        """Validate rating is between 1 and 5"""
        if value < 1 or value > 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value
    
    def validate(self, attrs):
        """Validate user can review this menu item"""
        request = self.context.get('request')
        menu_item = attrs.get('menu_item')
        
        if request and request.user and menu_item:
            # Check if this is an update or create
            if not self.instance:  # Creating new review
                # Check if user has already reviewed this menu item
                if MenuItemReview.objects.filter(user=request.user, menu_item=menu_item).exists():
                    raise serializers.ValidationError(
                        'You have already reviewed this menu item. You can edit your existing review.'
                    )
            
            # Check if user has ordered this specific menu item
            from orders.models import OrderItem
            has_ordered = OrderItem.objects.filter(
                order__customer=request.user,
                menu_item=menu_item,
                order__status='DELIVERED'
            ).exists()
            
            if not has_ordered:
                raise serializers.ValidationError(
                    'You can only review menu items you have ordered.'
                )
            
            # Set verified purchase flag
            attrs['is_verified_purchase'] = True
        
        return attrs
    
    def create(self, validated_data):
        """Create review and assign to current user"""
        request = self.context.get('request')
        validated_data['user'] = request.user
        return super().create(validated_data)
