import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Home, LayoutDashboard, Bike } from 'lucide-react';
import { logout } from '../../features/auth/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Floating Circular Navigation */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white rounded-full shadow-2xl border border-light-300 px-6 py-3">
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {/* Home/Restaurants */}
                <Link 
                  to="/restaurants" 
                  className="p-3 rounded-full hover:bg-primary-50 text-dark-700 hover:text-primary-600 transition-all duration-200"
                  title="Restaurants"
                >
                  <Home className="w-5 h-5" />
                </Link>

                {/* Cart (for customers) */}
                {user?.role === 'CUSTOMER' && (
                  <>
                    <Link 
                      to="/cart" 
                      className="relative p-3 rounded-full hover:bg-primary-50 text-dark-700 hover:text-primary-600 transition-all duration-200"
                      title="Cart"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {cartItemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {cartItemCount}
                        </span>
                      )}
                    </Link>
                    <Link 
                      to="/orders" 
                      className="p-3 rounded-full hover:bg-primary-50 text-dark-700 hover:text-primary-600 transition-all duration-200"
                      title="Orders"
                    >
                      <Package className="w-5 h-5" />
                    </Link>
                  </>
                )}

                {/* Dashboard (for restaurant owners) */}
                {user?.role === 'RESTAURANT_OWNER' && (
                  <Link 
                    to="/dashboard" 
                    className="p-3 rounded-full hover:bg-primary-50 text-dark-700 hover:text-primary-600 transition-all duration-200"
                    title="Dashboard"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                )}

                {/* Rider Dashboard */}
                {user?.role === 'RIDER' && (
                  <Link 
                    to="/rider" 
                    className="p-3 rounded-full hover:bg-primary-50 text-dark-700 hover:text-primary-600 transition-all duration-200"
                    title="Rider Dashboard"
                  >
                    <Bike className="w-5 h-5" />
                  </Link>
                )}

                {/* Divider */}
                <div className="w-px h-8 bg-light-300"></div>

                {/* User Profile & Logout */}
                <div className="flex items-center space-x-2">
                  <div className="p-3 rounded-full bg-primary-50">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-3 rounded-full hover:bg-red-50 text-dark-700 hover:text-red-600 transition-all duration-200"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/restaurants" 
                  className="p-3 rounded-full hover:bg-primary-50 text-dark-700 hover:text-primary-600 transition-all duration-200"
                  title="Restaurants"
                >
                  <Home className="w-5 h-5" />
                </Link>
                
                <div className="w-px h-8 bg-light-300"></div>
                
                <Link 
                  to="/login"
                  className="px-6 py-2 rounded-full text-dark-700 hover:text-primary-600 font-medium transition-all duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="px-6 py-2 rounded-full bg-primary-500 text-white font-medium hover:bg-primary-600 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      
      {/* Spacer to prevent content from being hidden behind floating nav */}
      <div className="h-24"></div>
    </>
  );
};

export default Navbar;
