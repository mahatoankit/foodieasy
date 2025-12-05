from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from django.utils import timezone
from django.db.models import Q

from .models import Order, OrderItem
from .serializers import (
    OrderSerializer, OrderCreateSerializer,
    OrderStatusUpdateSerializer, RiderAssignmentSerializer
)
from .permissions import (
    IsOrderCustomer, IsOrderRestaurant, IsOrderRider, CanUpdateOrderStatus
)


class OrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing orders.
    """
    queryset = Order.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status', 'restaurant']
    ordering_fields = ['created_at', 'total_amount']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer
    
    def get_queryset(self):
        """
        Filter orders based on user role.
        - CUSTOMER: Their own orders
        - RESTAURANT_OWNER: Orders for their restaurant
        - RIDER: Orders assigned to them
        - ADMIN: All orders
        """
        user = self.request.user
        
        if user.role == 'ADMIN':
            return Order.objects.all().select_related(
                'customer', 'restaurant', 'rider'
            ).prefetch_related('items__menu_item')
        
        elif user.role == 'CUSTOMER':
            return Order.objects.filter(customer=user).select_related(
                'customer', 'restaurant', 'rider'
            ).prefetch_related('items__menu_item')
        
        elif user.role == 'RESTAURANT_OWNER':
            if hasattr(user, 'restaurant'):
                return Order.objects.filter(
                    restaurant=user.restaurant
                ).select_related(
                    'customer', 'restaurant', 'rider'
                ).prefetch_related('items__menu_item')
            return Order.objects.none()
        
        elif user.role == 'RIDER':
            return Order.objects.filter(rider=user).select_related(
                'customer', 'restaurant', 'rider'
            ).prefetch_related('items__menu_item')
        
        return Order.objects.none()
    
    def perform_create(self, serializer):
        """Create order (customers only)"""
        if self.request.user.role != 'CUSTOMER':
            raise PermissionError('Only customers can create orders.')
        serializer.save()
    
    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        """Get current user's orders"""
        orders = self.get_queryset().filter(customer=request.user)
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def pending_orders(self, request):
        """Get pending orders (for restaurant owners and riders)"""
        user = request.user
        
        if user.role == 'RESTAURANT_OWNER' and hasattr(user, 'restaurant'):
            orders = Order.objects.filter(
                restaurant=user.restaurant,
                status='PENDING'
            ).select_related('customer', 'restaurant').prefetch_related('items__menu_item')
        elif user.role == 'RIDER':
            # Show orders that are ready for pickup and not yet assigned
            orders = Order.objects.filter(
                status='READY_FOR_PICKUP',
                rider__isnull=True
            ).select_related('customer', 'restaurant').prefetch_related('items__menu_item')
        else:
            orders = Order.objects.none()
        
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, CanUpdateOrderStatus])
    def update_status(self, request, pk=None):
        """Update order status"""
        order = self.get_object()
        serializer = OrderStatusUpdateSerializer(
            data=request.data,
            context={'order': order}
        )
        
        if serializer.is_valid():
            new_status = serializer.validated_data['status']
            cancellation_reason = serializer.validated_data.get('cancellation_reason', '')
            
            # Update status
            order.status = new_status
            
            # Update timestamps based on status
            if new_status == 'PREPARING':
                order.prepared_at = timezone.now()
            elif new_status == 'PICKED_UP' or new_status == 'OUT_FOR_DELIVERY':
                order.picked_up_at = timezone.now()
            elif new_status == 'DELIVERED':
                order.delivered_at = timezone.now()
            elif new_status == 'CANCELLED':
                order.cancelled_at = timezone.now()
                order.cancellation_reason = cancellation_reason
            
            # Save without specifying update_fields to ensure timestamps are saved
            order.save()
            
            return Response(
                OrderSerializer(order).data,
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def assign_rider(self, request, pk=None):
        """Assign a rider to an order (restaurant owner or admin only)"""
        order = self.get_object()
        user = request.user
        
        # Check permissions
        if user.role == 'ADMIN' or (hasattr(user, 'restaurant') and order.restaurant.owner == user):
            serializer = RiderAssignmentSerializer(data=request.data)
            
            if serializer.is_valid():
                from django.contrib.auth import get_user_model
                User = get_user_model()
                
                rider = User.objects.get(id=serializer.validated_data['rider_id'])
                order.rider = rider
                order.save(update_fields=['rider'])
                
                return Response(
                    OrderSerializer(order).data,
                    status=status.HTTP_200_OK
                )
            
            return Response(serializer.errors, status=status.HTTP_403_FORBIDDEN)
        
        return Response(
            {'error': 'You do not have permission to assign riders.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    @action(detail=True, methods=['get'])
    def track(self, request, pk=None):
        """Get order tracking information"""
        order = self.get_object()
        
        # Check if user has permission to track this order
        if not (order.customer == request.user or 
                (hasattr(request.user, 'restaurant') and order.restaurant.owner == request.user) or
                order.rider == request.user or
                request.user.role == 'ADMIN'):
            return Response(
                {'error': 'You do not have permission to track this order.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        tracking_info = {
            'order_id': order.id,
            'status': order.status,
            'status_display': order.get_status_display(),
            'created_at': order.created_at,
            'prepared_at': order.prepared_at,
            'picked_up_at': order.picked_up_at,
            'delivered_at': order.delivered_at,
            'cancelled_at': order.cancelled_at,
            'restaurant': {
                'name': order.restaurant.name,
                'address': order.restaurant.address
            },
            'delivery_address': order.delivery_address
        }
        
        # Add rider info if assigned
        if order.rider:
            tracking_info['rider'] = {
                'name': order.rider.full_name,
                'phone': order.rider.phone_number,
                'current_latitude': order.rider.current_latitude,
                'current_longitude': order.rider.current_longitude
            }
        
        return Response(tracking_info)
