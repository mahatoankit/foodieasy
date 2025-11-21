import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRestaurantById } from './restaurantSlice';
import { addToCart } from '../cart/cartSlice';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentRestaurant: restaurant, loading, error } = useSelector((state) => state.restaurants);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchRestaurantById(id));
  }, [dispatch, id]);

  const handleAddToCart = (menuItem) => {
    if (!user) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }
    
    dispatch(addToCart({ 
      menuItem, 
      restaurant: {
        id: restaurant.id,
        name: restaurant.name
      }
    }));
    
    alert(`${menuItem.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading restaurant...</div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">Restaurant not found</div>
      </div>
    );
  }

  const menuItems = restaurant.menu_items || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/restaurants')}
        className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
      >
        ← Back to Restaurants
      </button>

      {/* Restaurant Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {restaurant.name}
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              {restaurant.cuisine_type} Cuisine
            </p>
            <p className="text-gray-700 mb-2">{restaurant.description}</p>
            <p className="text-gray-600">📍 {restaurant.address}</p>
          </div>
          {restaurant.is_active ? (
            <span className="px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded">
              Open
            </span>
          ) : (
            <span className="px-3 py-1 text-sm font-semibold text-red-800 bg-red-100 rounded">
              Closed
            </span>
          )}
        </div>
      </div>

      {/* Menu Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu</h2>
        
        {menuItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">No menu items available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-40 bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                  <span className="text-white text-3xl">🍽️</span>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <span className="text-lg font-bold text-blue-600">
                      ${parseFloat(item.price).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.category}
                  </p>
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  {item.is_available ? (
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded cursor-not-allowed"
                    >
                      Unavailable
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
