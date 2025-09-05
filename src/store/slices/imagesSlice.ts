// src/store/slices/imagesSlice.ts
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
} from "@reduxjs/toolkit";
import type { RootState } from "../index";
import type {
  IImage,
  IViolation,
  ImagesState,
  PaginatedResponse,
} from "@/types/admin";
import { api, http } from "@/lib/api"; // axios-based helper; http is axios instance

// --- Thunks using real backend ---

/** GET /images?page=&pageSize=&q= */
export const fetchImages = createAsyncThunk(
  "images/fetchImages",
  async (
    {
      page = 1,
      pageSize = 12,
      q,
    }: { page?: number; pageSize?: number; q?: string },
    { rejectWithValue }
  ) => {
    try {
      const qs = new URLSearchParams();
      if (page) qs.set("page", String(page));
      if (pageSize) qs.set("pageSize", String(pageSize));
      if (q && q.trim()) qs.set("q", q.trim());

      const res = (await api(`/images?${qs.toString()}`, {
        method: "GET",
      })) as PaginatedResponse<IImage>;
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || "Failed to fetch images");
    }
  }
);

/** POST /images/upload-zip  (multipart, field 'file') */
export const uploadZip = createAsyncThunk(
  "images/uploadZip",
  async (file: File, { dispatch, rejectWithValue }) => {
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await http.post<{ items: IImage[]; added: number }>(
        "/images/upload-zip",
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            if (!e.total) return;
            const pct = Math.round((e.loaded / e.total) * 100);
            dispatch(setUploadProgress(pct));
          },
        }
      );

      return res.data.items;
    } catch (err) {
      return rejectWithValue(err?.message || "Failed to upload images");
    }
  }
);

/** POST /images/:id/violations  -> returns updated image */
export const assignViolation = createAsyncThunk(
  "images/assignViolation",
  async (
    { imageId, violation }: { imageId: string; violation: IViolation },
    { rejectWithValue }
  ) => {
    try {
      const updated = (await api(`/images/${imageId}/violations`, {
        method: "POST",
        body: { violation },
      })) as IImage;
      return updated;
    } catch (err) {
      return rejectWithValue(err?.message || "Failed to assign violation");
    }
  }
);

/** DELETE /images/:id/violations/:index -> returns updated image */
export const removeViolation = createAsyncThunk(
  "images/removeViolation",
  async (
    { imageId, violationIndex }: { imageId: string; violationIndex: number },
    { rejectWithValue }
  ) => {
    try {
      const updated = (await api(
        `/images/${imageId}/violations/${violationIndex}`,
        {
          method: "DELETE",
        }
      )) as IImage;
      return updated;
    } catch (err) {
      return rejectWithValue(err?.message || "Failed to remove violation");
    }
  }
);

// --- Slice ---

const initialState: ImagesState = {
  items: [],
  page: 1,
  pageSize: 12,
  total: 0,
  status: "idle",
  error: undefined,
  uploadProgress: 0,
};

const imagesSlice = createSlice({
  name: "images",
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
      state.page = 1;
    },
    resetUploadProgress: (state) => {
      state.uploadProgress = 0;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch images
    builder
      .addCase(fetchImages.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(
        fetchImages.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<IImage>>) => {
          state.status = "succeeded";
          state.items = action.payload.items; // each has _id
          state.page = action.payload.page;
          state.pageSize = action.payload.pageSize;
          state.total = action.payload.total;
        }
      )
      .addCase(fetchImages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Upload ZIP
    builder
      .addCase(uploadZip.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
        state.uploadProgress = 0;
      })
      .addCase(
        uploadZip.fulfilled,
        (state, action: PayloadAction<IImage[]>) => {
          state.status = "succeeded";
          // Prepend newly uploaded images
          state.items = [...action.payload, ...state.items];
          state.total += action.payload.length;
          state.uploadProgress = 100;
        }
      )
      .addCase(uploadZip.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.uploadProgress = 0;
      });

    // Assign violation -> replace image with server-updated doc
    builder
      .addCase(
        assignViolation.fulfilled,
        (state, action: PayloadAction<IImage>) => {
          const updated = action.payload;
          const idx = state.items.findIndex((img) => img._id === updated._id);
          if (idx !== -1) state.items[idx] = updated;
        }
      )
      .addCase(assignViolation.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Remove violation -> replace image with server-updated doc
    builder
      .addCase(
        removeViolation.fulfilled,
        (state, action: PayloadAction<IImage>) => {
          const updated = action.payload;
          const idx = state.items.findIndex((img) => img._id === updated._id);
          if (idx !== -1) state.items[idx] = updated;
        }
      )
      .addCase(removeViolation.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// Selectors
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
export const selectUploadProgress = (state: RootState) =>
  state.images.uploadProgress;

export const {
  clearError,
  setPage,
  setPageSize,
  resetUploadProgress,
  setUploadProgress, // <-- new
} = imagesSlice.actions;

export default imagesSlice.reducer;
