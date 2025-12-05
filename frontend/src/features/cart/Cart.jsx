import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { removeFromCart, updateQuantity, clearCart } from './cartSlice';
import { ShoppingCart, Trash2, Plus, Minus, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';

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
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingCart size={64} />}
        title="Your Cart is Empty"
        description="Add some delicious items to get started!"
        actionLabel="Browse Restaurants"
        onAction={() => navigate('/restaurants')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-light-200 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-dark-900">Your Cart</h1>
          <Button
            variant="ghost"
            onClick={() => dispatch(clearCart())}
            icon={<Trash2 size={18} />}
            className="text-red-600 hover:text-red-700"
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Restaurant Info */}
            {restaurant && (
              <Card className="bg-primary-50 border-l-4 border-primary-500">
                <p className="text-sm text-gray-600">Ordering from:</p>
                <p className="text-xl font-semibold text-dark-900">{restaurant.name}</p>
              </Card>
            )}

            {/* Items List */}
            {items.map((item) => (
              <Card key={item.menu_item} className="p-4">
                <div className="flex gap-4">
                  {/* Item Image Placeholder */}
                  <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex-shrink-0 flex items-center justify-center">
                    <span className="text-2xl">🍽️</span>
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-dark-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">NPR {parseFloat(item.price).toFixed(0)} each</p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.menu_item)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        aria-label="Remove item"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 bg-light-300 rounded-lg p-1">
                        <button
                          onClick={() => handleUpdateQuantity(item.menu_item, item.quantity - 1)}
                          className="w-8 h-8 rounded-md bg-white hover:bg-gray-100 flex items-center justify-center transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-semibold text-dark-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.menu_item, item.quantity + 1)}
                          className="w-8 h-8 rounded-md bg-white hover:bg-gray-100 flex items-center justify-center transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-xl font-bold text-primary-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h2 className="text-xl font-bold text-dark-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>$2.99</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Fee</span>
                  <span>$1.50</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xl font-bold text-dark-900 mb-6">
                <span>Total</span>
                <span>${(total + 2.99 + 1.50).toFixed(2)}</span>
              </div>

              <Button
                variant="primary"
                fullWidth
                onClick={handleCheckout}
                icon={<ShoppingCart size={18} />}
              >
                Proceed to Checkout
              </Button>

              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Free delivery on orders over $25</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
