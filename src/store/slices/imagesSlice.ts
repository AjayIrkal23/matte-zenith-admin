import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';
import JSZip from 'jszip';
import { IImage, IViolation, ImagesState, PaginatedResponse } from '@/types/admin';
import { RootState } from '../index';
import mockImages from '@/mocks/images.json';

// Async thunks
export const fetchImages = createAsyncThunk(
  'images/fetchImages',
  async ({ page = 1, pageSize = 12 }: { page?: number; pageSize?: number }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Random 8% failure rate
      if (Math.random() < 0.08) {
        throw new Error('Failed to fetch images');
      }
      
      const allImages = mockImages as IImage[];
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedImages = allImages.slice(startIndex, endIndex);
      
      const response: PaginatedResponse<IImage> = {
        items: paginatedImages,
        page,
        pageSize,
        total: allImages.length,
        totalPages: Math.ceil(allImages.length / pageSize),
      };
      
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const uploadZip = createAsyncThunk(
  'images/uploadZip',
  async (file: File, { rejectWithValue }) => {
    try {
      const zip = new JSZip();
      const zipContents = await zip.loadAsync(file);
      const imageFiles: IImage[] = [];
      
      // Process each file in the ZIP
      const filePromises = Object.keys(zipContents.files).map(async (fileName) => {
        const zipEntry = zipContents.files[fileName];
        
        // Skip directories and non-image files
        if (zipEntry.dir || !fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          return null;
        }
        
        try {
          const blob = await zipEntry.async('blob');
          const imageURL = URL.createObjectURL(blob);
          
          const image: IImage = {
            id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: fileName.split('/').pop() || fileName,
            imageURL,
            imagePath: fileName,
            violations: [],
            uploadedAt: new Date().toISOString(),
            fileSize: blob.size,
            aivalidated: false,
          };
          
          return image;
        } catch (error) {
          console.error(`Failed to process ${fileName}:`, error);
          return null;
        }
      });
      
      const results = await Promise.all(filePromises);
      const validImages = results.filter((img): img is IImage => img !== null);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Random 5% failure rate
      if (Math.random() < 0.05) {
        throw new Error('Failed to upload images');
      }
      
      return validImages;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to process ZIP file');
    }
  }
);

export const assignViolation = createAsyncThunk(
  'images/assignViolation',
  async ({ imageId, violation }: { imageId: string; violation: IViolation }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Random 3% failure rate
      if (Math.random() < 0.03) {
        throw new Error('Failed to assign violation');
      }
      
      return { imageId, violation };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const removeViolation = createAsyncThunk(
  'images/removeViolation',
  async ({ imageId, violationIndex }: { imageId: string; violationIndex: number }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Random 2% failure rate
      if (Math.random() < 0.02) {
        throw new Error('Failed to remove violation');
      }
      
      return { imageId, violationIndex };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const initialState: ImagesState = {
  items: [],
  page: 1,
  pageSize: 12,
  total: 0,
  status: 'idle',
  error: undefined,
  uploadProgress: 0,
};

const imagesSlice = createSlice({
  name: 'images',
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
    resetUploadProgress: (state) => {
      state.uploadProgress = 0;
    },
  },
  extraReducers: (builder) => {
    // Fetch images
    builder
      .addCase(fetchImages.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(fetchImages.fulfilled, (state, action: PayloadAction<PaginatedResponse<IImage>>) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.total = action.payload.total;
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Upload ZIP
      .addCase(uploadZip.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
        state.uploadProgress = 0;
      })
      .addCase(uploadZip.fulfilled, (state, action: PayloadAction<IImage[]>) => {
        state.status = 'succeeded';
        // Add new images to the beginning of the list
        state.items = [...action.payload, ...state.items];
        state.total += action.payload.length;
        state.uploadProgress = 100;
      })
      .addCase(uploadZip.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.uploadProgress = 0;
      })
      // Assign violation
      .addCase(assignViolation.fulfilled, (state, action) => {
        const { imageId, violation } = action.payload;
        const imageIndex = state.items.findIndex(img => img.id === imageId);
        if (imageIndex !== -1) {
          state.items[imageIndex].violations.push(violation);
        }
      })
      .addCase(assignViolation.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Remove violation
      .addCase(removeViolation.fulfilled, (state, action) => {
        const { imageId, violationIndex } = action.payload;
        const imageIndex = state.items.findIndex(img => img.id === imageId);
        if (imageIndex !== -1) {
          state.items[imageIndex].violations.splice(violationIndex, 1);
        }
      })
      .addCase(removeViolation.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// Selectors with memoization
export const selectImages = (state: RootState) => state.images.items;
export const selectImagesStatus = (state: RootState) => state.images.status;
export const selectImagesError = (state: RootState) => state.images.error;
export const selectImagesPagination = createSelector(
  [(state: RootState) => state.images],
  (images) => ({
    page: images.page,
    pageSize: images.pageSize,
    total: images.total,
    totalPages: Math.ceil(images.total / images.pageSize),
  })
);
export const selectUploadProgress = (state: RootState) => state.images.uploadProgress;

export const { clearError, setPage, setPageSize, resetUploadProgress } = imagesSlice.actions;
export default imagesSlice.reducer;