import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../orders/orderSlice';
import { clearCart } from '../cart/cartSlice';
import { MapPin, CreditCard, ShoppingBag, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

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

    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Please login to place an order');
      navigate('/login');
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

    console.log('Placing order:', orderData);
    console.log('Auth token exists:', !!token);

    try {
      const result = await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      navigate(`/orders/${result.id}`);
    } catch (err) {
      console.error('Order failed:', err);
      alert(err?.detail || err?.message || 'Failed to place order. Please try again.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-light-200 flex items-center justify-center">
        <Card className="text-center max-w-md mx-4">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-dark-900 mb-4">Your cart is empty</h2>
          <Button variant="primary" onClick={() => navigate('/restaurants')}>
            Browse Restaurants
          </Button>
        </Card>
      </div>
    );
  }

  const deliveryFee = 2.99;
  const serviceFee = 1.50;
  const grandTotal = total + deliveryFee + serviceFee;

  return (
    <div className="min-h-screen bg-light-200 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-dark-900 mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center max-w-2xl mx-auto">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-500 text-white rounded-full font-semibold">
                <CheckCircle size={20} />
              </div>
              <span className="ml-3 font-medium text-dark-900">Cart</span>
            </div>
            <div className="w-24 h-1 bg-primary-500 mx-4"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-500 text-white rounded-full font-semibold">
                2
              </div>
              <span className="ml-3 font-medium text-dark-900">Delivery</span>
            </div>
            <div className="w-24 h-1 bg-gray-300 mx-4"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-300 text-gray-600 rounded-full font-semibold">
                3
              </div>
              <span className="ml-3 text-gray-500">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Delivery Form */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <MapPin className="text-primary-600" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-dark-900">Delivery Address</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Complete Address *
                  </label>
                  <textarea
                    id="address"
                    rows="4"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your complete delivery address including landmarks"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>

                {/* Payment Method Placeholder */}
                <div className="pt-6 border-t">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="text-primary-600" size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-dark-900">Payment Method</h2>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 border-primary-500 rounded-lg cursor-pointer bg-primary-50">
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        defaultChecked
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="ml-3 font-medium text-dark-900">Cash on Delivery</span>
                    </label>
                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-not-allowed opacity-50">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        disabled
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="ml-3 font-medium text-gray-600">Card Payment (Coming Soon)</span>
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">
                      {typeof error === 'object' ? JSON.stringify(error) : error}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={loading}
                  icon={<ShoppingBag size={18} />}
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </Button>
              </form>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h2 className="text-xl font-bold text-dark-900 mb-4">Order Summary</h2>
              
              {restaurant && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600">From</p>
                  <p className="font-semibold text-dark-900">{restaurant.name}</p>
                </div>
              )}

              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                {items.map((item) => (
                  <div key={item.menu_item} className="flex justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-dark-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        ${parseFloat(item.price).toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-dark-900 flex-shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xl font-bold text-dark-900">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
