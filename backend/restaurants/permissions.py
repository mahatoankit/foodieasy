from rest_framework import permissions


class IsRestaurantOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of a restaurant to edit it.
    """
    
    def has_permission(self, request, view):
        """Check if user is authenticated"""
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        """
        Read permissions are allowed to any request,
        Write permissions are only allowed to the owner of the restaurant.
        """
        # Read permissions (GET, HEAD, OPTIONS) allowed to all
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Get the restaurant object
        # If obj is a MenuItem, get its restaurant
        if hasattr(obj, 'restaurant'):
            restaurant = obj.restaurant
        else:
            restaurant = obj
        
        # Write permissions only for the owner
        return restaurant.owner == request.user


class IsRestaurantOwnerOrReadOnly(permissions.BasePermission):
    """
    Allow read access to all, but write access only to restaurant owner.
    """
    
    def has_object_permission(self, request, view, obj):
        """Check object-level permissions"""
        # Read permissions allowed to all
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only for owner
        if hasattr(obj, 'restaurant'):
            return obj.restaurant.owner == request.user
        return obj.owner == request.user
