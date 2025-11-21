import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../orders/orderSlice';
import { clearCart } from '../cart/cartSlice';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, restaurant, total } = useSelector((state) => state.cart);
  const { loading, error } = useSelector((state) => state.orders);
  
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!restaurant || items.length === 0) {
      alert('Your cart is empty');
      navigate('/cart');
      return;
    }

    const orderData = {
      restaurant: restaurant.id,
      delivery_address: deliveryAddress,
      items: items.map(item => ({
        menu_item: item.menu_item,
        quantity: item.quantity
      }))
    };

    try {
      const result = await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      navigate(`/orders/${result.id}`);
    } catch (err) {
      console.error('Order failed:', err);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate('/restaurants')}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Form */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address *
                </label>
                <textarea
                  id="address"
                  rows="4"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your complete delivery address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">
                    {typeof error === 'object' ? JSON.stringify(error) : error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {restaurant && (
              <div className="mb-4 pb-4 border-b">
                <p className="text-sm text-gray-600">Restaurant:</p>
                <p className="font-semibold">{restaurant.name}</p>
              </div>
            )}

            <div className="space-y-3 mb-4 pb-4 border-b">
              {items.map((item) => (
                <div key={item.menu_item} className="flex justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      ${parseFloat(item.price).toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
