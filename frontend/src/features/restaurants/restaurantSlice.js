import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { restaurantAPI, menuItemAPI } from '../../services/api';

// Thunks
export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await restaurantAPI.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch restaurants');
    }
  }
);

export const fetchRestaurantById = createAsyncThunk(
  'restaurants/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await restaurantAPI.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch restaurant');
    }
  }
);

export const fetchMyRestaurant = createAsyncThunk(
  'restaurants/fetchMyRestaurant',
  async (_, { rejectWithValue }) => {
    try {
      const response = await restaurantAPI.getMyRestaurant();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch restaurant');
    }
  }
);

const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState: {
    list: [],
    currentRestaurant: null,
    myRestaurant: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentRestaurant: (state) => {
      state.currentRestaurant = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch By ID
      .addCase(fetchRestaurantById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRestaurant = action.payload;
      })
      .addCase(fetchRestaurantById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch My Restaurant
      .addCase(fetchMyRestaurant.fulfilled, (state, action) => {
        state.myRestaurant = action.payload;
      });
  },
});

export const { clearCurrentRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
