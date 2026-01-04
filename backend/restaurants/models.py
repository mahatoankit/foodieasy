from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class Restaurant(models.Model):
    """
    Restaurant model - linked to a restaurant owner user.
    Each restaurant owner can have one restaurant.
    """
    
    CUISINE_CHOICES = [
        ('ITALIAN', 'Italian'),
        ('CHINESE', 'Chinese'),
        ('INDIAN', 'Indian'),
        ('MALAY', 'Malay'),
        ('JAPANESE', 'Japanese'),
        ('KOREAN', 'Korean'),
        ('THAI', 'Thai'),
        ('WESTERN', 'Western'),
        ('FAST_FOOD', 'Fast Food'),
        ('SEAFOOD', 'Seafood'),
        ('VEGETARIAN', 'Vegetarian'),
        ('OTHER', 'Other'),
    ]
    
    owner = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='restaurant',
        limit_choices_to={'role': 'RESTAURANT_OWNER'}
    )
    name = models.CharField(max_length=200, verbose_name='Restaurant Name')
    description = models.TextField(blank=True, verbose_name='Description')
    address = models.TextField(verbose_name='Address')
    phone_number = models.CharField(max_length=15, verbose_name='Phone Number')
    cuisine_type = models.CharField(
        max_length=20,
        choices=CUISINE_CHOICES,
        default='OTHER',
        verbose_name='Cuisine Type'
    )
    delivery_time = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        verbose_name='Delivery Time'
    )
    is_open = models.BooleanField(default=True, verbose_name='Is Open')
    is_active = models.BooleanField(default=True, verbose_name='Is Active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    @property
    def average_rating(self):
        """Calculate average rating from reviews"""
        from django.db.models import Avg
        result = self.reviews.aggregate(Avg('rating'))
        return round(result['rating__avg'], 1) if result['rating__avg'] else 0
    
    @property
    def review_count(self):
        """Get total number of reviews"""
        return self.reviews.count()
    
    class Meta:
        verbose_name = 'Restaurant'
        verbose_name_plural = 'Restaurants'
        ordering = ['-created_at']


class MenuItem(models.Model):
    """
    Menu item model - belongs to a restaurant.
    """
    
    CATEGORY_CHOICES = [
        ('APPETIZERS', 'Appetizers'),
        ('MAIN_COURSE', 'Main Course'),
        ('DESSERTS', 'Desserts'),
        ('BEVERAGES', 'Beverages'),
        ('SIDES', 'Sides'),
    ]
    
    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        related_name='menu_items'
    )
    name = models.CharField(max_length=200, verbose_name='Item Name')
    description = models.TextField(blank=True, verbose_name='Description')
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Price (RM)'
    )
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='MAIN_COURSE',
        verbose_name='Category'
    )
    is_available = models.BooleanField(default=True, verbose_name='Is Available')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.restaurant.name}"
    
    @property
    def average_rating(self):
        """Calculate average rating from reviews"""
        from django.db.models import Avg
        result = self.reviews.aggregate(Avg('rating'))
        return round(result['rating__avg'], 1) if result['rating__avg'] else 0
    
    @property
    def review_count(self):
        """Get total number of reviews"""
        return self.reviews.count()
    
    class Meta:
        verbose_name = 'Menu Item'
        verbose_name_plural = 'Menu Items'
        ordering = ['category', 'name']


class RestaurantReview(models.Model):
    """
    Restaurant review model - customers can review restaurants they've ordered from.
    """
    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='restaurant_reviews',
        limit_choices_to={'role': 'CUSTOMER'}
    )
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name='Rating (1-5 stars)'
    )
    comment = models.TextField(
        blank=True,
        verbose_name='Review Comment'
    )
    is_verified_purchase = models.BooleanField(
        default=False,
        verbose_name='Verified Purchase',
        help_text='User has completed at least one order from this restaurant'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Restaurant Review'
        verbose_name_plural = 'Restaurant Reviews'
        ordering = ['-created_at']
        unique_together = ['restaurant', 'user']  # One review per user per restaurant
        indexes = [
            models.Index(fields=['restaurant', '-created_at']),
            models.Index(fields=['user']),
            models.Index(fields=['rating']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.restaurant.name} ({self.rating}★)"


class MenuItemReview(models.Model):
    """
    Menu item review model - customers can review specific menu items they've ordered.
    """
    menu_item = models.ForeignKey(
        MenuItem,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='menu_item_reviews',
        limit_choices_to={'role': 'CUSTOMER'}
    )
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name='Rating (1-5 stars)'
    )
    comment = models.TextField(
        blank=True,
        verbose_name='Review Comment'
    )
    is_verified_purchase = models.BooleanField(
        default=False,
        verbose_name='Verified Purchase',
        help_text='User has ordered this specific menu item'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Menu Item Review'
        verbose_name_plural = 'Menu Item Reviews'
        ordering = ['-created_at']
        unique_together = ['menu_item', 'user']  # One review per user per menu item
        indexes = [
            models.Index(fields=['menu_item', '-created_at']),
            models.Index(fields=['user']),
            models.Index(fields=['rating']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.menu_item.name} ({self.rating}★)"
