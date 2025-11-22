import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';
// import StackAuthProvider from './components/auth/StackAuthProvider';

// Layout
import Navbar from './components/Layout/Navbar';
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

// Dashboards
import OwnerDashboard from './features/owner/OwnerDashboard';
import RiderDashboard from './features/rider/RiderDashboard';

// Debug
import AuthDebug from './components/auth/AuthDebug';

import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Navbar />
          <AuthDebug />
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
        </div>
      </Router>
    </Provider>
  );
}

export default App;
