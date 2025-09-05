// src/store/slices/usersSlice.ts
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
} from "@reduxjs/toolkit";
import type { RootState } from "../index";
import type { IUser, UsersState, UserFormData } from "@/types/admin";
import { api } from "@/lib/api";

// ---------- Thunks (real backend) ----------

/** GET /users?department=&role=&q=&limit=&page= */
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (
    params: {
      department?: string;
      role?: "admin" | "user";
      q?: string;
      limit?: number; // default 50 on server
      page?: number; // default 1 on server
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const qs = new URLSearchParams();
      if (params.department) qs.set("department", params.department);
      if (params.role) qs.set("role", params.role);
      if (params.q) qs.set("q", params.q);
      if (params.limit) qs.set("limit", String(params.limit));
      if (params.page) qs.set("page", String(params.page));

      const res = await api(`/users?${qs.toString()}`);
      // server: { success, data: IUser[], meta: { total, page, limit, pages } }
      if (!res?.success)
        throw new Error(res?.message || "Failed to fetch users");
      return res as {
        success: true;
        data: IUser[];
        meta: { total: number; page: number; limit: number; pages: number };
      };
    } catch (err) {
      return rejectWithValue(err?.message || "Failed to fetch users");
    }
  }
);

/** POST /users  -> { success, data: user } */
export const addUser = createAsyncThunk(
  "users/addUser",
  async (userData: UserFormData, { rejectWithValue }) => {
    try {
      const res = await api("/users", { method: "POST", body: userData });
      if (!res?.success) throw new Error(res?.message || "Failed to add user");
      return res.data as IUser;
    } catch (err) {
      return rejectWithValue(err?.message || "Failed to add user");
    }
  }
);

/** PATCH /users/:empid  -> { success, data: updatedUser }
 *  NOTE: backend updates by empid (not _id). */
export const editUser = createAsyncThunk(
  "users/editUser",
  async (
    { empid, userData }: { empid: string; userData: Partial<UserFormData> },
    { rejectWithValue }
  ) => {
    try {
      const res = await api(`/users/${encodeURIComponent(empid)}`, {
        method: "PATCH",
        body: userData,
      });
      if (!res?.success)
        throw new Error(res?.message || "Failed to update user");
      return res.data as IUser;
    } catch (err) {
      return rejectWithValue(err?.message || "Failed to update user");
    }
  }
);

/** DELETE /users/:empid -> { success, data: deletedUser } */
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (empid: string, { rejectWithValue }) => {
    try {
      const res = await api(`/users/${encodeURIComponent(empid)}`, {
        method: "DELETE",
      });
      if (!res?.success)
        throw new Error(res?.message || "Failed to delete user");
      // Return the deleted user's empid so we can remove locally by empid
      return empid;
    } catch (err) {
      return rejectWithValue(err?.message || "Failed to delete user");
    }
  }
);

/** (Optional) GET /users/:empid -> { success, data: user } */
export const getUserByEmpId = createAsyncThunk(
  "users/getUserByEmpId",
  async (empid: string, { rejectWithValue }) => {
    try {
      const res = await api(`/users/${encodeURIComponent(empid)}`);
      if (!res?.success) throw new Error(res?.message || "User not found");
      return res.data as IUser;
    } catch (err) {
      return rejectWithValue(err?.message || "Failed to fetch user");
    }
  }
);

// ---------- State ----------

const initialState: UsersState = {
  items: [],
  status: "idle",
  error: undefined,
  // Optional pagination meta (mirrors server meta)
};

// ---------- Slice ----------

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(
        fetchUsers.fulfilled,
        (
          state,
          action: PayloadAction<{
            success: true;
            data: IUser[];
            meta: { total: number; page: number; limit: number; pages: number };
          }>
        ) => {
          state.status = "succeeded";
          state.items = action.payload.data;
        }
      )
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Add
    builder
      .addCase(addUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.status = "succeeded";
        state.items.unshift(action.payload); // newest on top
      })
      .addCase(addUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Edit (replace by _id)
    builder
      .addCase(editUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.status = "succeeded";
        const updated = action.payload;
        const idx = state.items.findIndex((u) => u._id === updated._id);
        if (idx !== -1) state.items[idx] = updated;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Delete (by empid in arg)
    builder
      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "succeeded";
        const empid = action.payload;
        state.items = state.items.filter((u) => u.empid !== empid);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // (Optional) getUserByEmpId: upsert into list
    builder.addCase(
      getUserByEmpId.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        const user = action.payload;
        const idx = state.items.findIndex((u) => u._id === user._id);
        if (idx === -1) state.items.unshift(user);
        else state.items[idx] = user;
      }
    );
  },
});

// ---------- Selectors ----------

export const selectUsers = (state: RootState) => state.users.items;
export const selectUsersStatus = (state: RootState) => state.users.status;
export const selectUsersError = (state: RootState) => state.users.error;

// Memoized selector for users by department
export const selectUsersByDepartment = createSelector(
  [selectUsers, (_: RootState, department: string) => department],
  (users, department) => users.filter((user) => user.department === department)
);

// Unique departments
export const selectUniqueDepartments = createSelector([selectUsers], (users) =>
  Array.from(new Set(users.map((user) => user.department)))
);

// Total validated images across all users
export const selectTotalValidatedImages = createSelector(
  [selectUsers],
  (users) =>
    users.reduce((total, user) => total + (user.validatedImages || 0), 0)
);

// ---------- Exports ----------

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;
