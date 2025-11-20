from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


class CustomUserManager(BaseUserManager):
    """
    Custom user manager where email is the unique identifier
    instead of username.
    """
    
    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular user with the given email and password."""
        if not email:
            raise ValueError('The Email field must be set')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a superuser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    """
    Custom user model that uses email for authentication instead of username.
    Includes role-based access control for the food delivery platform.
    """
    
    ROLE_CHOICES = [
        ('CUSTOMER', 'Customer'),
        ('RIDER', 'Rider'),
        ('RESTAURANT_OWNER', 'Restaurant Owner'),
        ('ADMIN', 'Admin'),
    ]
    
    username = None  # Remove username field
    email = models.EmailField(unique=True, verbose_name='Email Address')
    phone_number = models.CharField(max_length=15, blank=True, null=True, verbose_name='Phone Number')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='CUSTOMER', verbose_name='User Role')
    
    # Location fields for riders (Phase 6)
    current_latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
        verbose_name='Current Latitude',
        help_text='Used for rider location tracking'
    )
    current_longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
        verbose_name='Current Longitude',
        help_text='Used for rider location tracking'
    )
    location_updated_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Location Last Updated',
        help_text='Timestamp of last location update'
    )
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    objects = CustomUserManager()
    
    @property
    def full_name(self):
        """Return the user's full name."""
        return f"{self.first_name} {self.last_name}".strip()
    
    def __str__(self):
        return self.email
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
