from rest_framework import permissions


class IsOrderCustomer(permissions.BasePermission):
    """
    Permission to check if user is the customer of the order.
    """
    def has_object_permission(self, request, view, obj):
        return obj.customer == request.user


class IsOrderRestaurant(permissions.BasePermission):
    """
    Permission to check if user is the owner of the restaurant in the order.
    """
    def has_object_permission(self, request, view, obj):
        return hasattr(request.user, 'restaurant') and obj.restaurant.owner == request.user


class IsOrderRider(permissions.BasePermission):
    """
    Permission to check if user is the rider assigned to the order.
    """
    def has_object_permission(self, request, view, obj):
        return obj.rider == request.user


class CanUpdateOrderStatus(permissions.BasePermission):
    """
    Permission to check if user can update order status based on their role.
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        new_status = request.data.get('status')
        
        # Admin can update to any status
        if user.role == 'ADMIN':
            return True
        
        # Restaurant owner can update to PREPARING, READY_FOR_PICKUP, CANCELLED
        if hasattr(user, 'restaurant') and obj.restaurant.owner == user:
            allowed_statuses = ['PREPARING', 'READY_FOR_PICKUP', 'CANCELLED']
            return new_status in allowed_statuses
        
        # Rider can update to OUT_FOR_DELIVERY, DELIVERED
        if obj.rider == user and user.role == 'RIDER':
            allowed_statuses = ['OUT_FOR_DELIVERY', 'DELIVERED']
            return new_status in allowed_statuses
        
        # Customer can only cancel (PENDING orders only)
        if obj.customer == user and user.role == 'CUSTOMER':
            return new_status == 'CANCELLED' and obj.status == 'PENDING'
        
        return False
