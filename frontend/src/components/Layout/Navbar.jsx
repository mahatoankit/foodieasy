import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Package, Utensils } from 'lucide-react';
import { logout } from '../../features/auth/authSlice';
import Button from '../ui/Button';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white border-b border-light-400 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-500 p-2 rounded-lg">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-heading font-bold text-dark-900">
              Foodieasy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/restaurants" 
                  className="text-dark-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Restaurants
                </Link>
                
                {user?.role === 'CUSTOMER' && (
                  <>
                    <Link 
                      to="/cart" 
                      className="relative text-dark-700 hover:text-primary-600 transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {cartItemCount}
                        </span>
                      )}
                    </Link>
                    <Link 
                      to="/orders" 
                      className="flex items-center space-x-1 text-dark-700 hover:text-primary-600 font-medium transition-colors"
                    >
                      <Package className="w-5 h-5" />
                      <span>Orders</span>
                    </Link>
                  </>
                )}

                {user?.role === 'RESTAURANT_OWNER' && (
                  <Link 
                    to="/dashboard" 
                    className="text-dark-700 hover:text-primary-600 font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                )}

                {user?.role === 'RIDER' && (
                  <Link 
                    to="/rider" 
                    className="text-dark-700 hover:text-primary-600 font-medium transition-colors"
                  >
                    Rider Dashboard
                  </Link>
                )}

                <div className="flex items-center space-x-3 pl-4 border-l border-light-400">
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary-100 p-2 rounded-full">
                      <User className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="text-sm font-medium text-dark-800">
                      {user?.first_name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    icon={<LogOut className="w-4 h-4" />}
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-dark-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="md">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-light-300 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-dark-700" />
            ) : (
              <Menu className="w-6 h-6 text-dark-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-light-400 bg-white">
          <div className="px-4 py-4 space-y-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/restaurants"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-dark-700 hover:bg-light-300 rounded-lg transition-colors"
                >
                  Restaurants
                </Link>
                
                {user?.role === 'CUSTOMER' && (
                  <>
                    <Link
                      to="/cart"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-2 text-dark-700 hover:bg-light-300 rounded-lg transition-colors"
                    >
                      <span>Cart</span>
                      {cartItemCount > 0 && (
                        <span className="bg-primary-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {cartItemCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 text-dark-700 hover:bg-light-300 rounded-lg transition-colors"
                    >
                      My Orders
                    </Link>
                  </>
                )}

                {user?.role === 'RESTAURANT_OWNER' && (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-dark-700 hover:bg-light-300 rounded-lg transition-colors"
                  >
                    Dashboard
                  </Link>
                )}

                {user?.role === 'RIDER' && (
                  <Link
                    to="/rider"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-dark-700 hover:bg-light-300 rounded-lg transition-colors"
                  >
                    Rider Dashboard
                  </Link>
                )}

                <div className="border-t border-light-400 pt-3 mt-3">
                  <div className="flex items-center space-x-3 px-4 py-2 mb-2">
                    <div className="bg-primary-100 p-2 rounded-full">
                      <User className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="text-sm font-medium text-dark-800">
                      {user?.first_name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-dark-700 hover:bg-light-300 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block"
                >
                  <Button variant="primary" size="md" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
