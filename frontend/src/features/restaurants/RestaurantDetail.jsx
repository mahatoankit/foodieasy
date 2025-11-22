import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRestaurantById } from './restaurantSlice';
import { addToCart } from '../cart/cartSlice';
import { ArrowLeft, MapPin, Clock, Star, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentRestaurant: restaurant, loading, error } = useSelector((state) => state.restaurants);
  const { user } = useSelector((state) => state.auth);
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  const menuItems = restaurant?.menu_items || [];
  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading restaurant...</div>
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

  return (
    <div className="min-h-screen bg-light-200">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/restaurants')}
          icon={<ArrowLeft size={18} />}
        >
          Back to Restaurants
        </Button>
      </div>

      {/* Restaurant Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="overflow-hidden">
          {/* Banner Image */}
          <div className="h-48 bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center relative">
            <div className="text-white text-6xl font-bold">
              {restaurant.name.charAt(0)}
            </div>
            <div className="absolute top-4 right-4">
              <Badge variant={restaurant.is_active ? 'success' : 'error'}>
                {restaurant.is_active ? 'Open Now' : 'Closed'}
              </Badge>
            </div>
          </div>

          {/* Restaurant Info */}
          <div className="p-6">
            <h1 className="text-4xl font-bold text-dark-900 mb-2">
              {restaurant.name}
            </h1>
            <div className="flex items-center gap-4 text-gray-600 mb-4">
              <Badge variant="secondary">{restaurant.cuisine_type}</Badge>
              <div className="flex items-center gap-1">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="font-medium">4.5</span>
                <span className="text-sm">(120+ reviews)</span>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{restaurant.description}</p>
            
            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-3 p-3 bg-light-300 rounded-lg">
                <MapPin className="text-primary-500" size={20} />
                <div>
                  <div className="text-xs text-gray-500">Address</div>
                  <div className="text-sm font-medium text-dark-800">{restaurant.address}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-light-300 rounded-lg">
                <Clock className="text-primary-500" size={20} />
                <div>
                  <div className="text-xs text-gray-500">Delivery Time</div>
                  <div className="text-sm font-medium text-dark-800">25-35 mins</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-light-300 rounded-lg">
                <Star className="text-primary-500" size={20} />
                <div>
                  <div className="text-xs text-gray-500">Min Order</div>
                  <div className="text-sm font-medium text-dark-800">$10.00</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Menu Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-dark-900 mb-4">Menu</h2>
          
          {/* Category Filters */}
          {categories.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {filteredItems.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-500 text-lg">No menu items available</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} hover className="overflow-hidden">
                {/* Item Image */}
                <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center relative">
                  <div className="text-white text-5xl">🍽️</div>
                  {!item.is_available && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">Unavailable</span>
                    </div>
                  )}
                </div>
                
                {/* Item Details */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-dark-900 flex-1">
                      {item.name}
                    </h3>
                    <span className="text-xl font-bold text-primary-600">
                      ${parseFloat(item.price).toFixed(2)}
                    </span>
                  </div>
                  
                  <Badge variant="secondary" className="mb-2">
                    {item.category}
                  </Badge>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <Button
                    fullWidth
                    variant={item.is_available ? 'primary' : 'secondary'}
                    disabled={!item.is_available}
                    onClick={() => handleAddToCart(item)}
                    icon={item.is_available ? <Plus size={18} /> : null}
                  >
                    {item.is_available ? 'Add to Cart' : 'Unavailable'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
