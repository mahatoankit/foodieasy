import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Clock, MapPin, ChefHat } from 'lucide-react';
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

  // Fetch all restaurants once on mount
  useEffect(() => {
    dispatch(fetchRestaurants({}));
  }, [dispatch]);

  // Refetch when window gains focus (user comes back to tab)
  useEffect(() => {
    const handleFocus = () => {
      dispatch(fetchRestaurants({}));
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [dispatch]);

  const cuisineTypes = ['CHINESE', 'MALAY', 'INDIAN', 'WESTERN', 'JAPANESE', 'THAI', 'ITALIAN', 'OTHER'];

  // Client-side filtering - no page reload, just filter the existing list
  const filteredRestaurants = restaurants.filter((restaurant) => {
    // Filter by cuisine type
    const matchesCuisine = !cuisineFilter || restaurant.cuisine_type === cuisineFilter;
    
    // Filter by search term (search in name, description, cuisine, address)
    const matchesSearch = !search || 
      restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
      restaurant.description?.toLowerCase().includes(search.toLowerCase()) ||
      restaurant.cuisine_type?.toLowerCase().includes(search.toLowerCase()) ||
      restaurant.address?.toLowerCase().includes(search.toLowerCase());
    
    return matchesCuisine && matchesSearch;
  });

  // Only show full-page loading on initial load when no restaurants exist
  if (loading && restaurants.length === 0) {
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
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            Discover Amazing Food
          </h1>
          <p className="text-xl opacity-90 mb-8 drop-shadow-md">
            Order from the best restaurants in your area
          </p>
          
          {/* Search Bar - Centered */}
          <div className="max-w-2xl mx-auto">
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
        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-16">
            <ChefHat className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-700 text-2xl font-semibold mb-2">No restaurants found</p>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant, index) => {
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
              <Link key={restaurant.id} to={`/restaurants/${restaurant.id}`} className="group">
                <Card hover className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl">
                  {/* Restaurant Image/Banner */}
                  <div className="h-52 relative overflow-hidden">
                    <img 
                      src={foodImages[index % foodImages.length]}
                      alt={restaurant.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge variant={restaurant.is_active ? 'success' : 'error'}>
                        {restaurant.is_active ? 'Open Now' : 'Closed'}
                      </Badge>
                    </div>

                    {/* Restaurant Name Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Rating value={4.5} size="sm" />
                        <span className="text-white text-sm font-medium drop-shadow">(120+ ratings)</span>
                      </div>
                    </div>
                  </div>

                  {/* Restaurant Info */}
                  <div className="p-5">
                    {/* Cuisine Badge */}
                    <div className="mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {restaurant.cuisine_type?.replace(/_/g, ' ')}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-[40px]">
                      {restaurant.description || 'Delicious food prepared with passion and care'}
                    </p>

                    {/* Info Row */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} className="text-primary-500" />
                        <span className="font-medium">25-35 min</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={16} className="text-primary-500" />
                        <span className="truncate max-w-[120px]">{restaurant.address.split(',')[0]}</span>
                      </div>
                    </div>
                    
                    {/* View Menu Button */}
                    <button className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg group-hover:scale-[1.02]">
                      <ChefHat size={20} />
                      View Menu
                    </button>
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
