import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchRestaurantById } from './restaurantSlice';
import { addToCart } from '../cart/cartSlice';
import { ArrowLeft, MapPin, Clock, Star, Plus, X } from 'lucide-react';
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
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  useEffect(() => {
    dispatch(fetchRestaurantById(id));
  }, [dispatch, id]);

  const handleAddToCart = (menuItem) => {
    if (!user) {
      toast.error('Please login to add items to cart');
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
    
    toast.success(`${menuItem.name} added to cart!`);
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item, index) => {
              // Array of food images
              const foodImages = [
                'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', // Pizza
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', // Salad  
                'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', // Burger
                'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=80', // Sushi
                'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80', // Pasta
                'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80', // Pizza 2
                'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80', // Drink
                'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80', // Dessert
              ];
              
              return (
              <div 
                key={item.id} 
                className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => setSelectedMenuItem(item)}
              >
                {/* Item Image */}
                <div className="relative h-40 bg-gray-100">
                  <img 
                    src={foodImages[index % foodImages.length]}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {!item.is_available && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">Unavailable</span>
                    </div>
                  )}
                </div>
                
                {/* Item Details */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0 pr-3">
                      <h3 className="text-base font-semibold text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-base font-semibold text-gray-900">
                        NPR {parseFloat(item.price).toFixed(0)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {item.category}
                    </span>
                    
                    <button
                      disabled={!item.is_available}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        item.is_available
                          ? 'bg-primary-500 text-white hover:bg-primary-600'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {item.is_available ? (
                        <>
                          <Plus size={16} className="mr-1" />
                          Add
                        </>
                      ) : (
                        'Out of Stock'
                      )}
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Menu Item Details Modal */}
      {selectedMenuItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header with Image */}
            <div className="relative h-64">
              <img
                src={
                  [
                    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
                    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
                    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
                    'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&q=80',
                    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
                    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
                    'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&q=80',
                    'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80',
                  ][selectedMenuItem.id % 8]
                }
                alt={selectedMenuItem.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedMenuItem(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-700" />
              </button>
              {!selectedMenuItem.is_available && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                  <span className="text-white font-semibold text-2xl">Currently Unavailable</span>
                </div>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-dark-900 mb-2">
                    {selectedMenuItem.name}
                  </h2>
                  <Badge variant="secondary" className="mb-3">
                    {selectedMenuItem.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-primary-600">
                    NPR {parseFloat(selectedMenuItem.price).toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-dark-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedMenuItem.description}
                </p>
              </div>

              {/* Additional Info */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="bg-light-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Category</p>
                  <p className="font-semibold text-dark-900">{selectedMenuItem.category}</p>
                </div>
                <div className="bg-light-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Availability</p>
                  <p className="font-semibold text-dark-900">
                    {selectedMenuItem.is_available ? (
                      <span className="text-green-600">In Stock</span>
                    ) : (
                      <span className="text-red-600">Out of Stock</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Restaurant Info */}
              <div className="mb-6 bg-primary-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">From</p>
                <p className="font-semibold text-dark-900">{restaurant.name}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{restaurant.address?.split(',')[0]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>25-35 min</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setSelectedMenuItem(null)}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  disabled={!selectedMenuItem.is_available}
                  onClick={() => {
                    handleAddToCart(selectedMenuItem);
                    setSelectedMenuItem(null);
                  }}
                  icon={<Plus size={18} />}
                >
                  {selectedMenuItem.is_available ? 'Add to Cart' : 'Unavailable'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
