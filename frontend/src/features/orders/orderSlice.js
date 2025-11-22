import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from '../../services/api';

// Thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch orders');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getMyOrders();
      console.log('[Orders] Fetched orders:', response.data);
      return response.data;
    } catch (error) {
      console.error('[Orders] Failed to fetch orders:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch orders');
    }
  }
);

export const fetchPendingOrders = createAsyncThunk(
  'orders/fetchPendingOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getPendingOrders();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch pending orders');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderAPI.create(orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create order');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      const response = await orderAPI.updateStatus(id, statusData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update order status');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [],
    currentOrder: null,
    pendingOrders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch My Orders
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      // Fetch Pending Orders
      .addCase(fetchPendingOrders.fulfilled, (state, action) => {
        state.pendingOrders = action.payload;
      })
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.list.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      });
  },
});

export const { clearCurrentOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;
