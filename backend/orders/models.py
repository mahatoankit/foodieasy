from django.db import models
from django.conf import settings
from decimal import Decimal


class Order(models.Model):
    """
    Order model - represents a customer's order from a restaurant.
    """
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PREPARING', 'Preparing'),
        ('READY_FOR_PICKUP', 'Ready for Pickup'),
        ('OUT_FOR_DELIVERY', 'Out for Delivery'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders',
        limit_choices_to={'role': 'CUSTOMER'}
    )
    restaurant = models.ForeignKey(
        'restaurants.Restaurant',
        on_delete=models.CASCADE,
        related_name='orders'
    )
    rider = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='deliveries',
        limit_choices_to={'role': 'RIDER'}
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING'
    )
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00')
    )
    delivery_address = models.TextField()
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    prepared_at = models.DateTimeField(null=True, blank=True)
    picked_up_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    
    # Cancellation reason (if applicable)
    cancellation_reason = models.TextField(blank=True, default='')
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['status']),
            models.Index(fields=['customer']),
            models.Index(fields=['restaurant']),
            models.Index(fields=['rider']),
        ]
    
    def __str__(self):
        return f"Order #{self.id} - {self.customer.email} from {self.restaurant.name}"
    
    def calculate_total(self):
        """Calculate total amount from order items"""
        total = sum(item.quantity * item.price_at_order for item in self.items.all())
        return Decimal(str(total))
    
    def can_transition_to(self, new_status):
        """
        Check if order can transition to the new status.
        """
        valid_transitions = {
            'PENDING': ['PREPARING', 'CANCELLED'],
            'PREPARING': ['READY_FOR_PICKUP', 'CANCELLED'],
            'READY_FOR_PICKUP': ['OUT_FOR_DELIVERY', 'CANCELLED'],
            'OUT_FOR_DELIVERY': ['DELIVERED'],
            'DELIVERED': [],
            'CANCELLED': [],
        }
        
        return new_status in valid_transitions.get(self.status, [])


class OrderItem(models.Model):
    """
    OrderItem model - represents an item in an order.
    """
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )
    menu_item = models.ForeignKey(
        'restaurants.MenuItem',
        on_delete=models.PROTECT,
        related_name='order_items'
    )
    quantity = models.PositiveIntegerField(default=1)
    price_at_order = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text='Price of the item at the time of order'
    )
    
    class Meta:
        ordering = ['id']
    
    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name} in Order #{self.order.id}"
    
    @property
    def subtotal(self):
        """Calculate subtotal for this item"""
        return self.quantity * self.price_at_order
