import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

export interface AuthState {
  isAuthenticated: boolean;
  pendingEmpId?: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

// Send OTP thunk
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (empid: string, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Random 5% failure rate
      if (Math.random() < 0.05) {
        throw new Error('Failed to send OTP');
      }
      
      return { empid };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Verify OTP thunk
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ empid, otp }: { empid: string; otp: string }, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Check dummy OTP
      if (otp !== '000000') {
        throw new Error('Invalid OTP');
      }
      
      return { empid };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Invalid OTP');
    }
  }
);

const initialState: AuthState = {
  isAuthenticated: false,
  status: 'idle',
  error: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.pendingEmpId = undefined;
      state.error = undefined;
      state.status = 'idle';
    },
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(sendOtp.fulfilled, (state, action: PayloadAction<{ empid: string }>) => {
        state.status = 'succeeded';
        state.pendingEmpId = action.payload.empid;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.pendingEmpId = undefined;
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.pendingEmpId = undefined;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectPendingEmpId = (state: RootState) => state.auth.pendingEmpId;

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;