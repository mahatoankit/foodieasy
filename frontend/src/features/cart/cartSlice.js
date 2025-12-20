import { createSlice } from '@reduxjs/toolkit';

// Helper function to get user-specific cart key
const getCartKey = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? `cart_${user.id}` : 'cart_guest';
};

const getCartRestaurantKey = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? `cartRestaurant_${user.id}` : 'cartRestaurant_guest';
};

// Helper function to load cart for current user
const loadUserCart = () => {
  try {
    const cartKey = getCartKey();
    return JSON.parse(localStorage.getItem(cartKey)) || [];
  } catch {
    return [];
  }
};

const loadUserRestaurant = () => {
  try {
    const restaurantKey = getCartRestaurantKey();
    return JSON.parse(localStorage.getItem(restaurantKey)) || null;
  } catch {
    return null;
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadUserCart(),
    restaurant: loadUserRestaurant(),
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
      
      // Save to user-specific localStorage
      localStorage.setItem(getCartKey(), JSON.stringify(state.items));
      localStorage.setItem(getCartRestaurantKey(), JSON.stringify(state.restaurant));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.menu_item !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      if (state.items.length === 0) {
        state.restaurant = null;
        localStorage.removeItem(getCartKey());
        localStorage.removeItem(getCartRestaurantKey());
      } else {
        localStorage.setItem(getCartKey(), JSON.stringify(state.items));
      }
    },
    updateQuantity: (state, action) => {
      const { menu_item, quantity } = action.payload;
      const item = state.items.find(item => item.menu_item === menu_item);
      
      if (item) {
        item.quantity = quantity;
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        localStorage.setItem(getCartKey(), JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurant = null;
      state.total = 0;
      localStorage.removeItem(getCartKey());
      localStorage.removeItem(getCartRestaurantKey());
    },
    loadCart: (state) => {
      // Load cart for current user
      state.items = loadUserCart();
      state.restaurant = loadUserRestaurant();
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, loadCart } = cartSlice.actions;
export default cartSlice.reducer;
