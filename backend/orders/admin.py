from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    """
    Inline admin for OrderItems.
    """
    model = OrderItem
    extra = 0
    readonly_fields = ['price_at_order', 'subtotal']
    fields = ['menu_item', 'quantity', 'price_at_order', 'subtotal']
    
    def subtotal(self, obj):
        return obj.subtotal if obj.id else '-'
    subtotal.short_description = 'Subtotal'


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """
    Admin interface for Order model.
    """
    list_display = [
        'id', 'customer', 'restaurant', 'status',
        'total_amount', 'rider', 'created_at'
    ]
    list_filter = ['status', 'created_at', 'restaurant']
    search_fields = ['customer__email', 'restaurant__name', 'delivery_address']
    readonly_fields = [
        'created_at', 'prepared_at', 'picked_up_at',
        'delivered_at', 'cancelled_at', 'total_amount'
    ]
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('customer', 'restaurant', 'status', 'total_amount')
        }),
        ('Delivery Information', {
            'fields': ('delivery_address', 'rider')
        }),
        ('Timestamps', {
            'fields': (
                'created_at', 'prepared_at', 'picked_up_at',
                'delivered_at', 'cancelled_at'
            )
        }),
        ('Cancellation', {
            'fields': ('cancellation_reason',),
            'classes': ('collapse',)
        })
    )
    
    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        qs = super().get_queryset(request)
        return qs.select_related('customer', 'restaurant', 'rider')


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    """
    Admin interface for OrderItem model.
    """
    list_display = ['id', 'order', 'menu_item', 'quantity', 'price_at_order', 'subtotal']
    list_filter = ['order__status', 'order__created_at']
    search_fields = ['order__id', 'menu_item__name']
    readonly_fields = ['price_at_order', 'subtotal']
    
    def subtotal(self, obj):
        return obj.subtotal
    subtotal.short_description = 'Subtotal'
    
    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        qs = super().get_queryset(request)
        return qs.select_related('order', 'menu_item')
