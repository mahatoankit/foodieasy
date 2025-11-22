import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Star } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Restaurants</h1>
      
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search restaurants..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={cuisineFilter}
          onChange={(e) => setCuisineFilter(e.target.value)}
        >
          <option value="">All Cuisines</option>
          {cuisineTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Restaurant Grid */}
      {restaurants.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No restaurants found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              to={`/restaurants/${restaurant.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">
                  {restaurant.name.charAt(0)}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {restaurant.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {restaurant.cuisine_type}
                </p>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {restaurant.description}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  📍 {restaurant.address}
                </p>
                {restaurant.is_active ? (
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">
                    Open
                  </span>
                ) : (
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded">
                    Closed
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
