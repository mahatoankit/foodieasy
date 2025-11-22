import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { restaurantAPI } from '../../services/api';

// Async thunks
export const fetchMyRestaurant = createAsyncThunk(
  'restaurant/fetchMyRestaurant',
  async (_, { rejectWithValue }) => {
    try {
      const response = await restaurantAPI.getMyRestaurant();
      return response.data;
    } catch (error) {
      // If 404, owner doesn't have a restaurant yet - this is not an error
      if (error.response?.status === 404) {
        return null;
      }
      return rejectWithValue(error.response?.data || 'Failed to fetch restaurant');
    }
  }
);

export const createRestaurant = createAsyncThunk(
  'restaurant/createRestaurant',
  async (data, { rejectWithValue }) => {
    try {
      const response = await restaurantAPI.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create restaurant');
    }
  }
);

export const updateRestaurant = createAsyncThunk(
  'restaurant/updateRestaurant',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await restaurantAPI.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update restaurant');
    }
  }
);

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState: {
    data: null,
    loading: false,
    error: null,
    updateLoading: false,
    updateError: null,
  },
  reducers: {
    clearRestaurantError: (state) => {
      state.error = null;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch restaurant
      .addCase(fetchMyRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMyRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create restaurant
      .addCase(createRestaurant.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(createRestaurant.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.data = action.payload;
      })
      .addCase(createRestaurant.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })
      
      // Update restaurant
      .addCase(updateRestaurant.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateRestaurant.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.data = action.payload;
      })
      .addCase(updateRestaurant.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
  },
});

export const { clearRestaurantError } = restaurantSlice.actions;
export default restaurantSlice.reducer;
