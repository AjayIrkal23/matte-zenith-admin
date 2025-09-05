// src/store/slices/annotationCandidatesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import type { IImage, ImagesState, PaginatedResponse } from "@/types/admin";
import { api } from "@/lib/api";

// GET /annotated-images/candidates?page=&pageSize=&onlyValidated=
export const fetchAnnotationCandidates = createAsyncThunk(
  "annotationCandidates/fetchAnnotationCandidates",
  async (
    {
      page = 1,
      pageSize = 20,
      onlyValidated = true,
    }: { page?: number; pageSize?: number; onlyValidated?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const qs = new URLSearchParams();
      if (page) qs.set("page", String(page));
      if (pageSize) qs.set("pageSize", String(pageSize));
      if (onlyValidated) qs.set("onlyValidated", String(onlyValidated));

      const res = (await api(`/annotated-images/candidates?${qs.toString()}`, {
        method: "GET",
      })) as PaginatedResponse<IImage>;
      return res;
    } catch (err) {
      return rejectWithValue(
        err?.message || "Failed to fetch annotation candidates"
      );
    }
  }
);

const initialState: ImagesState = {
  items: [],
  page: 1,
  pageSize: 20,
  total: 0,
  status: "idle",
  error: undefined,
};

const annotationCandidatesSlice = createSlice({
  name: "annotationCandidates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnotationCandidates.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(
        fetchAnnotationCandidates.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<IImage>>) => {
          state.status = "succeeded";
          state.items = action.payload.items;
          state.page = action.payload.page;
          state.pageSize = action.payload.pageSize;
          state.total = action.payload.total;
        }
      )
      .addCase(fetchAnnotationCandidates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const selectAnnotationCandidates = (state: RootState) =>
  state.annotationCandidates.items;
export const selectAnnotationCandidatesStatus = (state: RootState) =>
  state.annotationCandidates.status;

export default annotationCandidatesSlice.reducer;
