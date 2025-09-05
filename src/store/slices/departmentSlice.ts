// src/store/slices/departmentSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AsyncStatus } from "@/types/admin";
import { RootState } from "../index";
import { api } from "@/lib/api";
import { IDepartment } from "@/types/department";

interface DepartmentState {
  departments: IDepartment[];
  selectedDepartment: IDepartment | null;
  status: AsyncStatus;
  error: string | undefined;
}

const initialState: DepartmentState = {
  departments: [],
  selectedDepartment: null,
  status: "idle",
  error: undefined,
};

/** GET /departments -> { success, data: IDepartment[], meta? } */
export const fetchDepartments = createAsyncThunk(
  "departments/fetchDepartments",
  async (_: void, { rejectWithValue }) => {
    try {
      const res = await api("/departments", { method: "GET" });
      return res.data as IDepartment[];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch departments");
    }
  }
);

/** POST /departments -> { success, data: IDepartment } */
export const createDepartment = createAsyncThunk(
  "departments/createDepartment",
  async (
    departmentData: Omit<IDepartment, "_id" | "createdAt" | "updatedAt">,
    { rejectWithValue }
  ) => {
    try {
      const res = await api("/departments", {
        method: "POST",
        body: departmentData,
      });
      return res.data as IDepartment;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to create department");
    }
  }
);

/** PATCH /departments/:id -> { success, data: IDepartment } */
export const updateDepartment = createAsyncThunk(
  "departments/updateDepartment",
  async (
    { id, updates }: { id: string; updates: Partial<IDepartment> },
    { rejectWithValue }
  ) => {
    try {
      const res = await api(`/departments/${id}`, {
        method: "PATCH",
        body: updates,
      });
      const updated = res.data as IDepartment;
      // keep reducer logic the same: return { id, updates }
      return { id: updated._id, updates: updated };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update department");
    }
  }
);

/** DELETE /departments/:id -> { success, data: IDepartment } */
export const deleteDepartment = createAsyncThunk(
  "departments/deleteDepartment",
  async (id: string, { rejectWithValue }) => {
    try {
      await api(`/departments/${id}`, { method: "DELETE" });
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to delete department");
    }
  }
);

/** GET /departments/:id/stats -> { success, data: ... } */
export const fetchDepartmentStats = createAsyncThunk(
  "departments/fetchDepartmentStats",
  async (departmentId: string, { rejectWithValue }) => {
    try {
      const res = await api(`/departments/${departmentId}/stats`, {
        method: "GET",
      });
      // return stats payload to the caller (component) as needed
      return res.data as {
        departmentId: string;
        totalValidations: number;
        monthlyGrowth: number;
        topPerformer: string | null;
        averageCompletionTime: number | null;
      };
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to fetch department statistics"
      );
    }
  }
);

const departmentSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = undefined;
    },
    setSelectedDepartment: (
      state,
      action: PayloadAction<IDepartment | null>
    ) => {
      state.selectedDepartment = action.payload;
    },
    clearSelectedDepartment: (state) => {
      state.selectedDepartment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch departments
      .addCase(fetchDepartments.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(
        fetchDepartments.fulfilled,
        (state, action: PayloadAction<IDepartment[]>) => {
          state.status = "succeeded";
          state.departments = action.payload;
        }
      )
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Create department
      .addCase(createDepartment.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(
        createDepartment.fulfilled,
        (state, action: PayloadAction<IDepartment>) => {
          state.status = "succeeded";
          state.departments.push(action.payload);
        }
      )
      .addCase(createDepartment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Update department
      .addCase(
        updateDepartment.fulfilled,
        (
          state,
          action: PayloadAction<{ id: string; updates: Partial<IDepartment> }>
        ) => {
          const { id, updates } = action.payload;
          const i = state.departments.findIndex((d) => d._id === id);
          if (i !== -1) {
            state.departments[i] = { ...state.departments[i], ...updates };
            if (state.selectedDepartment?._id === id) {
              state.selectedDepartment = {
                ...state.selectedDepartment,
                ...updates,
              } as IDepartment;
            }
          }
        }
      )

      // Delete department
      .addCase(
        deleteDepartment.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.departments = state.departments.filter(
            (d) => d._id !== action.payload
          );
          if (state.selectedDepartment?._id === action.payload) {
            state.selectedDepartment = null;
          }
        }
      );
  },
});

// Selectors
export const selectDepartments = (state: RootState) =>
  state.departments.departments;
export const selectSelectedDepartment = (state: RootState) =>
  state.departments.selectedDepartment;
export const selectDepartmentStatus = (state: RootState) =>
  state.departments.status;
export const selectDepartmentError = (state: RootState) =>
  state.departments.error;

// Convenience selectors
export const selectDepartmentById = (state: RootState, departmentId: string) =>
  state.departments.departments.find((d) => d._id === departmentId);

export const selectDepartmentsByEmployeeCount = (state: RootState) =>
  [...state.departments.departments].sort(
    (a, b) => b.employeeCount - a.employeeCount
  );

export const selectTopPerformingDepartments = (state: RootState) =>
  [...state.departments.departments]
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 3);

// Actions
export const {
  clearError,
  setSelectedDepartment,
  clearSelectedDepartment,
} = departmentSlice.actions;

export default departmentSlice.reducer;
