// src/store/slices/annotatedImagesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { IAnnotatedImage, AnnotatedImagesState } from "@/types/admin";
import type { RootState } from "../index";
import { http } from "@/lib/api"; // axios instance with token interceptor

// Request payload for creating an annotated image
export type SubmitAnnotatedRequest = {
  image: string; // ObjectId of the source Image document
  annotatedBy: string;
  annotatedViolations: any[]; // should match IAnnotatedViolation on backend
  validated?: boolean;
  imageWidth?: number;
  imageHeight?: number;
  usersValidated?: string[];
  annotatedAt?: string | Date;
};

// Response shape from GET /annotated-images
export type FetchAnnotatedResponse = {
  items: IAnnotatedImage[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

// Async thunk to fetch annotated images (real API)
export const fetchAnnotatedImages = createAsyncThunk<
  FetchAnnotatedResponse,
  { page?: number; pageSize?: number },
  { rejectValue: string }
>(
  "annotatedImages/fetchAnnotatedImages",
  async ({ page = 1, pageSize = 20 } = {}, { rejectWithValue }) => {
    try {
      const res = await http.get<FetchAnnotatedResponse>("/annotated-images", {
        params: { page, pageSize },
      });
      return res.data;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch annotated images";
      return rejectWithValue(msg);
    }
  }
);

// Async thunk to submit annotated image (real API)
export const submitAnnotatedImage = createAsyncThunk<
  IAnnotatedImage,
  SubmitAnnotatedRequest,
  { rejectValue: string }
>(
  "annotatedImages/submitAnnotatedImage",
  async (payload, { rejectWithValue }) => {
    try {
      // Server snapshots base image fields; returns the created annotated image doc
      const res = await http.post<IAnnotatedImage>(
        "/annotated-images",
        payload
      );
      return res.data;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to submit annotation";
      return rejectWithValue(msg);
    }
  }
);

const initialState: AnnotatedImagesState = {
  items: [],
  page: 1,
  pageSize: 20,
  total: 0,
  status: "idle",
  error: undefined,
};

const annotatedImagesSlice = createSlice({
  name: "annotatedImages",
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
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchAnnotatedImages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.total = action.payload.total;
      })
      .addCase(fetchAnnotatedImages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Submit annotated image
      .addCase(submitAnnotatedImage.pending, (state) => {
        state.error = undefined;
      })
      .addCase(submitAnnotatedImage.fulfilled, (state, action) => {
        // Add the new annotated image to the start of the list
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(submitAnnotatedImage.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectAnnotatedImages = (state: RootState) =>
  state.annotatedImages.items;
export const selectAnnotatedImagesStatus = (state: RootState) =>
  state.annotatedImages.status;
export const selectAnnotatedImagesError = (state: RootState) =>
  state.annotatedImages.error;
export const selectAnnotatedImagesPagination = (state: RootState) => ({
  page: state.annotatedImages.page,
  pageSize: state.annotatedImages.pageSize,
  total: state.annotatedImages.total,
  totalPages: Math.ceil(
    state.annotatedImages.total / state.annotatedImages.pageSize
  ),
});

export const {
  clearError,
  setPage,
  setPageSize,
} = annotatedImagesSlice.actions;
export default annotatedImagesSlice.reducer;
