import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './app/store';
import ToastProvider from './components/ui/ToastProvider';
import { loadCart } from './features/cart/cartSlice';
// import StackAuthProvider from './components/auth/StackAuthProvider';

// Layout
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Auth
import Login from './features/auth/Login';
import Register from './features/auth/Register';

// Restaurants
import RestaurantList from './features/restaurants/RestaurantList';
import RestaurantDetail from './features/restaurants/RestaurantDetail';

// Cart & Orders
import Cart from './features/cart/Cart';
import Checkout from './features/orders/Checkout';
import OrderHistory from './features/orders/OrderHistory';
import OrderDetail from './features/orders/OrderDetail';

// Profile
import Profile from './features/profile/Profile';

// Dashboards
import OwnerDashboard from './features/owner/OwnerDashboard';
import RiderDashboard from './features/rider/RiderDashboard';

import './App.css';

// Component to handle cart loading based on user authentication
function CartLoader() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Load cart when user changes (login/logout)
    dispatch(loadCart());
  }, [user, dispatch]);

  return null;
}

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <Router>
          <CartLoader />
          <div className="App min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/restaurants" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            
            {/* Protected Routes */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <OrderHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <OrderDetail />
                </ProtectedRoute>
              }
            />

            {/* Profile - All authenticated users */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'RESTAURANT_OWNER', 'RIDER']}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Restaurant Owner Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}>
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Rider Dashboard */}
            <Route
              path="/rider"
              element={
                <ProtectedRoute allowedRoles={['RIDER']}>
                  <RiderDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/restaurants" replace />} />
          </Routes>
          <Footer />
        </div>
      </Router>
      </ToastProvider>
    </Provider>
  );
}

export default App;
