from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from django.utils import timezone
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    RiderLocationUpdateSerializer,
    RiderLocationSerializer
)

User = get_user_model()


def get_tokens_for_user(user):
    """Generate JWT tokens for a user"""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Register a new user.
    
    POST /api/users/auth/register/
    Body: {
        "email": "user@example.com",
        "password": "securepass123",
        "password2": "securepass123",
        "first_name": "John",
        "last_name": "Doe",
        "phone_number": "+60123456789",
        "role": "CUSTOMER"
    }
    """
    serializer = UserRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        
        return Response({
            'message': 'User registered successfully',
            'user': UserProfileSerializer(user).data,
            'access': tokens['access'],
            'refresh': tokens['refresh'],
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login user and return JWT tokens.
    
    POST /api/users/auth/login/
    Body: {
        "email": "user@example.com",
        "password": "securepass123"
    }
    """
    serializer = UserLoginSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            if user.is_active:
                tokens = get_tokens_for_user(user)
                
                return Response({
                    'message': 'Login successful',
                    'user': UserProfileSerializer(user).data,
                    'access': tokens['access'],
                    'refresh': tokens['refresh'],
                }, status=status.HTTP_200_OK)
            else:
                return Response(
                    {'detail': 'Account is disabled.'},
                    status=status.HTTP_403_FORBIDDEN
                )
        else:
            return Response(
                {'detail': 'Invalid email or password.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    """
    Get current user profile.
    
    GET /api/users/profile/
    Headers: Authorization: Bearer <access_token>
    """
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_rider_location(request):
    """
    Update rider's current location.
    Only RIDER role users can update their location.
    
    POST /api/users/rider/location/
    Body: {"latitude": 3.1390, "longitude": 101.6869}
    """
    if request.user.role != 'RIDER':
        return Response(
            {'detail': 'Only riders can update their location.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = RiderLocationUpdateSerializer(data=request.data)
    
    if serializer.is_valid():
        request.user.current_latitude = serializer.validated_data['latitude']
        request.user.current_longitude = serializer.validated_data['longitude']
        request.user.location_updated_at = timezone.now()
        request.user.save(update_fields=['current_latitude', 'current_longitude', 'location_updated_at'])
        
        return Response(
            {
                'message': 'Location updated successfully',
                'latitude': request.user.current_latitude,
                'longitude': request.user.current_longitude,
                'updated_at': request.user.location_updated_at
            },
            status=status.HTTP_200_OK
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_rider_location(request, rider_id):
    """
    Get rider's current location.
    Used by customers to track their delivery.
    
    GET /api/users/rider/{rider_id}/location/
    """
    try:
        rider = User.objects.get(id=rider_id, role='RIDER')
    except User.DoesNotExist:
        return Response(
            {'detail': 'Rider not found.'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if not rider.current_latitude or not rider.current_longitude:
        return Response(
            {'detail': 'Rider location not available yet.'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = RiderLocationSerializer(rider)
    return Response(serializer.data)
