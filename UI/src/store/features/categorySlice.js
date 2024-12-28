import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch categories async thunk
export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async () => {
    const response = await axios.get('http://localhost:8080/auth/categories');
    return response.data; // Return categories data
  }
);

// Initial state
const initialState = {
  categories: [],
  loading: false,
  error: null,
};

// Category slice
const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;
