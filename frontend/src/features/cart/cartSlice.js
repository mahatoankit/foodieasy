import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: JSON.parse(localStorage.getItem('cart')) || [],
    restaurant: JSON.parse(localStorage.getItem('cartRestaurant')) || null,
    total: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const { menuItem, restaurant } = action.payload;
      
      // If cart has items from different restaurant, clear it
      if (state.restaurant && state.restaurant.id !== restaurant.id) {
        state.items = [];
      }
      
      state.restaurant = restaurant;
      
      // Check if item already exists
      const existingItem = state.items.find(item => item.menu_item === menuItem.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          menu_item: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
        });
      }
      
      // Calculate total
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items));
      localStorage.setItem('cartRestaurant', JSON.stringify(state.restaurant));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.menu_item !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      if (state.items.length === 0) {
        state.restaurant = null;
        localStorage.removeItem('cart');
        localStorage.removeItem('cartRestaurant');
      } else {
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },
    updateQuantity: (state, action) => {
      const { menu_item, quantity } = action.payload;
      const item = state.items.find(item => item.menu_item === menu_item);
      
      if (item) {
        item.quantity = quantity;
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurant = null;
      state.total = 0;
      localStorage.removeItem('cart');
      localStorage.removeItem('cartRestaurant');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
