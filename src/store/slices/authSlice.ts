// src/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { api, getToken, setToken } from "@/lib/api";

/** Mirror your backend's User shape (add fields as needed) */
export interface IUser {
  _id: string;
  name: string;
  email: string;
  empid: string;
  department: string;
  role: "admin" | "user";
  validatedImages: number;
  score?: number;
  achievements?: {
    firstCatch: boolean;
    sharpEye: boolean;
    safetyChampion: boolean;
    safetyMaster: boolean;
    topPerformer: boolean;
    masterPerformer: boolean;
    top10: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token?: string | null;
  user?: IUser | null;
  pendingEmpId?: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
  devOtp?: string; // optional helper while EXPOSE_OTP=true on backend
}

const initialState: AuthState = {
  isAuthenticated: !!getToken(),
  token: getToken(),
  user: undefined,
  pendingEmpId: undefined,
  status: "idle",
  error: undefined,
};

/** POST /auth/send-otp  -> { success, message, devOtp? } */
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (empid: string, { rejectWithValue }) => {
    try {
      const res = await api("/auth/send-otp", {
        method: "POST",
        body: { empid },
      });
      return { empid, devOtp: res?.devOtp as string | undefined };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to send OTP");
    }
  }
);

/** POST /auth/verify-otp -> { success, token, user } */
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (
    { empid, otp }: { empid: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api("/auth/verify-otp", {
        method: "POST",
        body: { empid, otp },
      });
      const token = res?.token as string;
      const user = res?.user as IUser;
      if (!token || !user) throw new Error("Invalid login response");

      // persist token
      setToken(token);

      return { token, user };
    } catch (err) {
      return rejectWithValue(err.message || "Invalid OTP");
    }
  }
);

/** GET /auth/me -> { success, user } */
export const hydrateSession = createAsyncThunk(
  "auth/hydrateSession",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api("/auth/me", { method: "GET" });
      const user = res?.user as IUser;
      if (!user) throw new Error("Session invalid");
      return { user, token: getToken() };
    } catch (err) {
      // token likely invalid/revoked; clear it
      setToken(null);
      return rejectWithValue(err.message || "Session invalid");
    }
  }
);

/** POST /auth/logout -> { success } */
export const logoutServer = createAsyncThunk(
  "auth/logoutServer",
  async (_, { rejectWithValue }) => {
    try {
      await api("/auth/logout", { method: "POST" });
      // server revokes; client clears token
      setToken(null);
      return true;
    } catch (err) {
      // even if server fails, clear locally to be safe
      setToken(null);
      return rejectWithValue(err.message || "Failed to logout");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /** client-only logout (without calling server) */
    logoutLocal: (state) => {
      state.isAuthenticated = false;
      state.pendingEmpId = undefined;
      state.error = undefined;
      state.status = "idle";
      state.user = null;
      state.token = null;
      setToken(null);
    },
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    // SEND OTP
    builder
      .addCase(sendOtp.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
        state.devOtp = undefined;
      })
      .addCase(
        sendOtp.fulfilled,
        (state, action: PayloadAction<{ empid: string; devOtp?: string }>) => {
          state.status = "succeeded";
          state.pendingEmpId = action.payload.empid;
          state.devOtp = action.payload.devOtp;
        }
      )
      .addCase(sendOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.pendingEmpId = undefined;
      });

    // VERIFY OTP (login)
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(
        verifyOtp.fulfilled,
        (state, action: PayloadAction<{ token: string; user: IUser }>) => {
          state.status = "succeeded";
          state.isAuthenticated = true;
          state.pendingEmpId = undefined;
          state.token = action.payload.token;
          state.user = action.payload.user;
        }
      )
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // HYDRATE SESSION
    builder
      .addCase(hydrateSession.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(
        hydrateSession.fulfilled,
        (
          state,
          action: PayloadAction<{ user: IUser; token: string | null }>
        ) => {
          state.status = "succeeded";
          state.isAuthenticated = !!action.payload.token;
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      )
      .addCase(hydrateSession.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });

    // LOGOUT
    builder
      .addCase(logoutServer.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(logoutServer.fulfilled, (state) => {
        state.status = "succeeded";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.pendingEmpId = undefined;
      })
      .addCase(logoutServer.rejected, (state, action) => {
        state.status = "failed";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.pendingEmpId = undefined;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectPendingEmpId = (state: RootState) => state.auth.pendingEmpId;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectDevOtp = (state: RootState) => state.auth.devOtp;

export const { logoutLocal, clearError } = authSlice.actions;
export default authSlice.reducer;
