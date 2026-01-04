from django.contrib import admin
from .models import Restaurant, MenuItem, RestaurantReview, MenuItemReview


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


@admin.register(RestaurantReview)
class RestaurantReviewAdmin(admin.ModelAdmin):
    """Admin configuration for RestaurantReview"""
    list_display = ['restaurant', 'user', 'rating', 'is_verified_purchase', 'created_at']
    list_filter = ['rating', 'is_verified_purchase', 'created_at']
    search_fields = ['restaurant__name', 'user__email', 'comment']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Review Information', {
            'fields': ('restaurant', 'user', 'rating', 'comment')
        }),
        ('Verification', {
            'fields': ('is_verified_purchase',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(MenuItemReview)
class MenuItemReviewAdmin(admin.ModelAdmin):
    """Admin configuration for MenuItemReview"""
    list_display = ['menu_item', 'user', 'rating', 'is_verified_purchase', 'created_at']
    list_filter = ['rating', 'is_verified_purchase', 'created_at']
    search_fields = ['menu_item__name', 'user__email', 'comment']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Review Information', {
            'fields': ('menu_item', 'user', 'rating', 'comment')
        }),
        ('Verification', {
            'fields': ('is_verified_purchase',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
