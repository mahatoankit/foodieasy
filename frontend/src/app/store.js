import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import restaurantReducer from '../features/restaurants/restaurantSlice';
import cartReducer from '../features/cart/cartSlice';
import orderReducer from '../features/orders/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurants: restaurantReducer,
    cart: cartReducer,
    orders: orderReducer,
  },
});

export default store;
