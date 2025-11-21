import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from './cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, restaurant, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const handleUpdateQuantity = (menuItem, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ menu_item: menuItem, quantity }));
  };

  const handleRemoveItem = (menuItem) => {
    dispatch(removeFromCart(menuItem));
  };

  const handleCheckout = () => {
    if (!user) {
      alert('Please login to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
          <button
            onClick={() => navigate('/restaurants')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-red-600 hover:text-red-800"
        >
          Clear Cart
        </button>
      </div>

      {/* Restaurant Info */}
      {restaurant && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-600">Ordering from:</p>
          <p className="text-lg font-semibold text-gray-900">{restaurant.name}</p>
        </div>
      )}

      {/* Cart Items */}
      <div className="bg-white rounded-lg shadow-md divide-y">
        {items.map((item) => (
          <div key={item.menu_item} className="p-4 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
              <p className="text-gray-600">${parseFloat(item.price).toFixed(2)} each</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleUpdateQuantity(item.menu_item, item.quantity - 1)}
                  className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  -
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity(item.menu_item, item.quantity + 1)}
                  className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  +
                </button>
              </div>
              
              <div className="text-lg font-bold text-gray-900 w-20 text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              
              <button
                onClick={() => handleRemoveItem(item.menu_item)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total and Checkout */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center text-xl font-bold mb-4">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-semibold"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
