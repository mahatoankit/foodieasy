from django.contrib import admin
from .models import Restaurant, MenuItem


class MenuItemInline(admin.TabularInline):
    """Inline admin for menu items within restaurant admin"""
    model = MenuItem
    extra = 1
    fields = ['name', 'description', 'price', 'category', 'is_available']


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    """Admin configuration for Restaurant"""
    list_display = ['name', 'owner', 'cuisine_type', 'is_active', 'created_at']
    list_filter = ['cuisine_type', 'is_active', 'created_at']
    search_fields = ['name', 'description', 'owner__email']
    ordering = ['-created_at']
    inlines = [MenuItemInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('owner', 'name', 'description')
        }),
        ('Contact Details', {
            'fields': ('address', 'phone_number')
        }),
        ('Restaurant Details', {
            'fields': ('cuisine_type', 'is_active')
        }),
    )


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    """Admin configuration for MenuItem"""
    list_display = ['name', 'restaurant', 'price', 'category', 'is_available', 'created_at']
    list_filter = ['category', 'is_available', 'restaurant', 'created_at']
    search_fields = ['name', 'description', 'restaurant__name']
    ordering = ['restaurant', 'category', 'name']
    
    fieldsets = (
        ('Menu Item Information', {
            'fields': ('restaurant', 'name', 'description')
        }),
        ('Pricing & Category', {
            'fields': ('price', 'category', 'is_available')
        }),
    )
