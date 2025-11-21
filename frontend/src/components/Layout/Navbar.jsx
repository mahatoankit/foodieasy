import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
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
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">
            Foodieasy
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/restaurants" className="hover:text-blue-200">
                  Restaurants
                </Link>
                
                {user?.role === 'CUSTOMER' && (
                  <>
                    <Link to="/cart" className="hover:text-blue-200 relative">
                      Cart
                      {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cartItemCount}
                        </span>
                      )}
                    </Link>
                    <Link to="/orders" className="hover:text-blue-200">
                      My Orders
                    </Link>
                  </>
                )}

                {user?.role === 'RESTAURANT_OWNER' && (
                  <Link to="/dashboard" className="hover:text-blue-200">
                    Dashboard
                  </Link>
                )}

                {user?.role === 'RIDER' && (
                  <Link to="/rider" className="hover:text-blue-200">
                    Rider Dashboard
                  </Link>
                )}

                <div className="flex items-center space-x-2">
                  <span className="text-sm">Hi, {user?.first_name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
