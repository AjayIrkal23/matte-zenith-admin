import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IAnnotatedImage, AnnotatedImagesState } from '@/types/admin';
import { RootState } from '../index';

// Async thunk to fetch annotated images
export const fetchAnnotatedImages = createAsyncThunk(
  'annotatedImages/fetchAnnotatedImages',
  async ({ page = 1, pageSize = 20 }: { page?: number; pageSize?: number }, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Random failure rate for testing
      if (Math.random() < 0.05) {
        throw new Error('Failed to fetch annotated images');
      }

      // Mock annotated images data
      const mockAnnotatedImages: IAnnotatedImage[] = [];
      const total = 0; // No annotated images initially
      
      return {
        items: mockAnnotatedImages,
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Async thunk to submit annotated image
export const submitAnnotatedImage = createAsyncThunk(
  'annotatedImages/submitAnnotatedImage',
  async (annotatedImage: IAnnotatedImage, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Random failure rate for testing
      if (Math.random() < 0.05) {
        throw new Error('Failed to submit annotation');
      }

      return annotatedImage;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const initialState: AnnotatedImagesState = {
  items: [],
  page: 1,
  pageSize: 20,
  total: 0,
  status: 'idle',
  error: undefined,
};

const annotatedImagesSlice = createSlice({
  name: 'annotatedImages',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = undefined;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.page = 1; // Reset to first page when changing page size
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch annotated images
      .addCase(fetchAnnotatedImages.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(fetchAnnotatedImages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.total = action.payload.total;
      })
      .addCase(fetchAnnotatedImages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Submit annotated image
      .addCase(submitAnnotatedImage.pending, (state) => {
        state.error = undefined;
      })
      .addCase(submitAnnotatedImage.fulfilled, (state, action) => {
        // Add the new annotated image to the list
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(submitAnnotatedImage.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectAnnotatedImages = (state: RootState) => state.annotatedImages.items;
export const selectAnnotatedImagesStatus = (state: RootState) => state.annotatedImages.status;
export const selectAnnotatedImagesError = (state: RootState) => state.annotatedImages.error;
export const selectAnnotatedImagesPagination = (state: RootState) => ({
  page: state.annotatedImages.page,
  pageSize: state.annotatedImages.pageSize,
  total: state.annotatedImages.total,
  totalPages: Math.ceil(state.annotatedImages.total / state.annotatedImages.pageSize),
});

export const { clearError, setPage, setPageSize } = annotatedImagesSlice.actions;
export default annotatedImagesSlice.reducer;