import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import restaurantReducer from '../features/restaurants/restaurantSlice';
import cartReducer from '../features/cart/cartSlice';
import orderReducer from '../features/orders/orderSlice';
import menuReducer from '../features/menu/menuSlice';
import ownerRestaurantReducer from '../features/owner/restaurantSlice';
import ownerOrdersReducer from '../features/owner/ownerOrdersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurants: restaurantReducer,
    cart: cartReducer,
    orders: orderReducer,
    menu: menuReducer,
    ownerRestaurant: ownerRestaurantReducer,
    ownerOrders: ownerOrdersReducer,
  },
});

export default store;
