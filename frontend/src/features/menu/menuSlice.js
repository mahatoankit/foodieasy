import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { menuItemAPI } from '../../services/api';

// Async thunks
export const fetchMyMenu = createAsyncThunk(
  'menu/fetchMyMenu',
  async (_, { rejectWithValue }) => {
    try {
      const response = await menuItemAPI.getMyMenu();
      return response.data;
    } catch (error) {
      // If 404, owner doesn't have a restaurant yet - return empty array
      if (error.response?.status === 404) {
        return [];
      }
      return rejectWithValue(error.response?.data || 'Failed to fetch menu items');
    }
  }
);

export const createMenuItem = createAsyncThunk(
  'menu/createMenuItem',
  async (menuItemData, { rejectWithValue }) => {
    try {
      const response = await menuItemAPI.create(menuItemData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create menu item');
    }
  }
);

export const updateMenuItem = createAsyncThunk(
  'menu/updateMenuItem',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await menuItemAPI.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update menu item');
    }
  }
);

export const deleteMenuItem = createAsyncThunk(
  'menu/deleteMenuItem',
  async (id, { rejectWithValue }) => {
    try {
      await menuItemAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete menu item');
    }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    items: [],
    loading: false,
    error: null,
    actionLoading: false, // For create/update/delete operations
    actionError: null,
  },
  reducers: {
    clearMenuError: (state) => {
      state.error = null;
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch menu items
      .addCase(fetchMyMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMyMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create menu item
      .addCase(createMenuItem.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(createMenuItem.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items.push(action.payload);
      })
      .addCase(createMenuItem.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })
      
      // Update menu item
      .addCase(updateMenuItem.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateMenuItem.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })
      
      // Delete menu item
      .addCase(deleteMenuItem.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteMenuItem.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });
  },
});

export const { clearMenuError } = menuSlice.actions;
export default menuSlice.reducer;
