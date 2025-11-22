import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from '../../services/api';

// Async thunks
export const fetchRestaurantOrders = createAsyncThunk(
  'ownerOrders/fetchRestaurantOrders',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getAll({ restaurant: restaurantId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch orders');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'ownerOrders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await orderAPI.updateStatus(orderId, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update order status');
    }
  }
);

const ownerOrdersSlice = createSlice({
  name: 'ownerOrders',
  initialState: {
    orders: [],
    loading: false,
    error: null,
    updateLoading: false,
    updateError: null,
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchRestaurantOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchRestaurantOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
  },
});

export const { clearOrderError } = ownerOrdersSlice.actions;
export default ownerOrdersSlice.reducer;
