from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    register,
    login,
    get_profile,
    update_rider_location,
    get_rider_location,
)

app_name = 'users'

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', register, name='register'),
    path('auth/login/', login, name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profile endpoint
    path('profile/', get_profile, name='profile'),
    
    # Rider location tracking (Phase 6)
    path('rider/location/', update_rider_location, name='rider_location_update'),
    path('rider/<int:rider_id>/location/', get_rider_location, name='rider_location_get'),
]
