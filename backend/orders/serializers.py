from rest_framework import serializers
from django.db import transaction
from .models import Order, OrderItem
from restaurants.models import MenuItem
from django.contrib.auth import get_user_model

User = get_user_model()


class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer for order items (read-only).
    """
    menu_item_name = serializers.SerializerMethodField()
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'menu_item', 'menu_item_name',
            'quantity', 'price_at_order', 'subtotal'
        ]
    
    def get_menu_item_name(self, obj):
        """Return menu item name"""
        return obj.menu_item.name
    
    def get_subtotal(self, obj):
        """Return subtotal for this item"""
        return obj.subtotal


class OrderSerializer(serializers.ModelSerializer):
    """
    Serializer for orders with full details.
    """
    customer_name = serializers.SerializerMethodField()
    customer_email = serializers.SerializerMethodField()
    restaurant_name = serializers.SerializerMethodField()
    rider_name = serializers.SerializerMethodField()
    items = OrderItemSerializer(many=True, read_only=True)
    item_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'customer', 'customer_name', 'customer_email',
            'restaurant', 'restaurant_name', 'rider', 'rider_name',
            'status', 'total_amount', 'delivery_address',
            'items', 'item_count',
            'created_at', 'prepared_at', 'picked_up_at',
            'delivered_at', 'cancelled_at', 'cancellation_reason'
        ]
        read_only_fields = [
            'id', 'customer', 'total_amount', 'created_at',
            'prepared_at', 'picked_up_at', 'delivered_at', 'cancelled_at'
        ]
    
    def get_customer_name(self, obj):
        """Return customer's full name"""
        return obj.customer.full_name
    
    def get_customer_email(self, obj):
        """Return customer's email"""
        return obj.customer.email
    
    def get_restaurant_name(self, obj):
        """Return restaurant name"""
        return obj.restaurant.name
    
    def get_rider_name(self, obj):
        """Return rider's name if assigned"""
        return obj.rider.full_name if obj.rider else None
    
    def get_item_count(self, obj):
        """Return total number of items"""
        return sum(item.quantity for item in obj.items.all())


class OrderCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating orders.
    """
    items = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        help_text='List of items: [{"menu_item": 1, "quantity": 2}, ...]'
    )
    
    class Meta:
        model = Order
        fields = ['restaurant', 'delivery_address', 'items']
    
    def validate_items(self, value):
        """Validate items list"""
        if not value:
            raise serializers.ValidationError('Order must contain at least one item.')
        
        for item in value:
            if 'menu_item' not in item:
                raise serializers.ValidationError('Each item must have a menu_item id.')
            if 'quantity' not in item:
                raise serializers.ValidationError('Each item must have a quantity.')
            if item['quantity'] < 1:
                raise serializers.ValidationError('Quantity must be at least 1.')
        
        return value
    
    def validate(self, attrs):
        """Validate order data"""
        restaurant = attrs.get('restaurant')
        items_data = attrs.get('items')
        
        # Verify all menu items belong to the restaurant and are available
        for item in items_data:
            try:
                menu_item = MenuItem.objects.get(id=item['menu_item'])
                
                if menu_item.restaurant != restaurant:
                    raise serializers.ValidationError(
                        f"Menu item '{menu_item.name}' does not belong to this restaurant."
                    )
                
                if not menu_item.is_available:
                    raise serializers.ValidationError(
                        f"Menu item '{menu_item.name}' is not available."
                    )
                    
            except MenuItem.DoesNotExist:
                raise serializers.ValidationError(
                    f"Menu item with id {item['menu_item']} does not exist."
                )
        
        return attrs
    
    @transaction.atomic
    def create(self, validated_data):
        """Create order with items in a transaction"""
        items_data = validated_data.pop('items')
        request = self.context.get('request')
        
        # Create the order
        order = Order.objects.create(
            customer=request.user,
            restaurant=validated_data['restaurant'],
            delivery_address=validated_data['delivery_address'],
            status='PENDING'
        )
        
        # Create order items and calculate total
        total = 0
        for item_data in items_data:
            menu_item = MenuItem.objects.get(id=item_data['menu_item'])
            quantity = item_data['quantity']
            
            OrderItem.objects.create(
                order=order,
                menu_item=menu_item,
                quantity=quantity,
                price_at_order=menu_item.price
            )
            
            total += menu_item.price * quantity
        
        # Update order total
        order.total_amount = total
        order.save(update_fields=['total_amount'])
        
        return order


class OrderStatusUpdateSerializer(serializers.Serializer):
    """
    Serializer for updating order status.
    """
    status = serializers.ChoiceField(choices=Order.STATUS_CHOICES)
    cancellation_reason = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, attrs):
        """Validate status transition"""
        order = self.context.get('order')
        new_status = attrs['status']
        
        if not order.can_transition_to(new_status):
            raise serializers.ValidationError(
                f"Cannot transition from {order.get_status_display()} to {dict(Order.STATUS_CHOICES)[new_status]}."
            )
        
        # Require cancellation reason if cancelling
        if new_status == 'CANCELLED' and not attrs.get('cancellation_reason'):
            raise serializers.ValidationError(
                'Cancellation reason is required when cancelling an order.'
            )
        
        return attrs


class RiderAssignmentSerializer(serializers.Serializer):
    """
    Serializer for assigning a rider to an order.
    """
    rider_id = serializers.IntegerField()
    
    def validate_rider_id(self, value):
        """Validate rider exists and has RIDER role"""
        try:
            rider = User.objects.get(id=value)
            if rider.role != 'RIDER':
                raise serializers.ValidationError('User is not a rider.')
            return value
        except User.DoesNotExist:
            raise serializers.ValidationError('Rider not found.')
