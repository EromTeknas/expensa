import {createSlice} from '@reduxjs/toolkit';
import {
  fetchAllCategoriesThunk,
  updateCategoryThunk,
  deleteCategoryThunk,
  addCategoryThunk,
} from './categoriesThunk';
import {Database} from '../../../database.types';

type Category = Database['public']['Tables']['categories']['Row'];

interface CategoriesState {
  categories: Category[];
  categoriesLoading: boolean;
  categoriesError: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Fetch
      .addCase(fetchAllCategoriesThunk.pending, state => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchAllCategoriesThunk.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchAllCategoriesThunk.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.payload ?? 'Failed to fetch categories';
      })

      // Add
      .addCase(addCategoryThunk.fulfilled, (state, action) => {
        const payload = {
          created_at: action.payload.created_at!,
          id: action.payload.id!,
          name: action.payload.name!,
          user_id: action.payload.user_id!,
        };
        if (action.payload.created_at) {
          state.categories.push(payload);
        }
      })
      .addCase(addCategoryThunk.rejected, (state, action) => {
        state.categoriesError = action.payload ?? 'Failed to add category';
      })

      // Delete
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          c => c.id !== action.payload,
        );
      })
      .addCase(deleteCategoryThunk.rejected, (state, action) => {
        state.categoriesError = action.payload ?? 'Failed to delete category';
      })

      // Update
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          c => c.id === action.payload.id,
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategoryThunk.rejected, (state, action) => {
        state.categoriesError = action.payload ?? 'Failed to update category';
      });
  },
});

export default categoriesSlice.reducer;
