import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';
import { fetchRestaurants } from './restaurantSlice';
import SearchBar from '../../components/ui/SearchBar';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Rating from '../../components/ui/Rating';

const RestaurantList = () => {
  const dispatch = useDispatch();
  const { list: restaurants, loading, error } = useSelector((state) => state.restaurants);
  const [search, setSearch] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (cuisineFilter) params.cuisine_type = cuisineFilter;
    
    dispatch(fetchRestaurants(params));
  }, [dispatch, search, cuisineFilter]);

  const cuisineTypes = ['CHINESE', 'MALAY', 'INDIAN', 'WESTERN', 'JAPANESE', 'THAI', 'ITALIAN', 'OTHER'];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading restaurants...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">Error loading restaurants</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-200">
      {/* Hero Section with Background Image */}
      <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            Discover Amazing Food
          </h1>
          <p className="text-xl opacity-90 mb-8 drop-shadow-md">
            Order from the best restaurants in your area
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search for restaurants, cuisines, or dishes..."
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cuisine Filter Pills */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-dark-900 mb-4">Filter by Cuisine</h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCuisineFilter('')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !cuisineFilter
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {cuisineTypes.map((type) => (
              <button
                key={type}
                onClick={() => setCuisineFilter(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  cuisineFilter === type
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Restaurant Grid */}
        {restaurants.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl">No restaurants found</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant, index) => {
              // Array of food images for variety
              const foodImages = [
                'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', // Pizza
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', // Salad
                'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', // Burger
                'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=80', // Sushi
                'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', // Indian
                'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80', // Thai
              ];
              
              return (
              <Link key={restaurant.id} to={`/restaurants/${restaurant.id}`}>
                <Card hover className="h-full overflow-hidden">
                  {/* Restaurant Image/Banner */}
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      src={foodImages[index % foodImages.length]}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-3 right-3">
                      <Badge variant={restaurant.is_active ? 'success' : 'error'}>
                        {restaurant.is_active ? 'Open' : 'Closed'}
                      </Badge>
                    </div>
                  </div>

                  {/* Restaurant Info */}
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-dark-900 mb-2">
                      {restaurant.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">{restaurant.cuisine_type}</Badge>
                      <Rating value={4.5} size="sm" />
                      <span className="text-sm text-gray-600">(120+)</span>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {restaurant.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>25-35 min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span className="truncate">{restaurant.address.split(',')[0]}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
