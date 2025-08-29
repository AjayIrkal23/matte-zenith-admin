import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { IUser, UsersState, UserFormData } from '@/types/admin';
import { RootState } from '../index';
import mockUsers from '@/mocks/users.json';

// Async thunks - simulating API calls with setTimeout
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Random 10% failure rate for testing
      if (Math.random() < 0.1) {
        throw new Error('Failed to fetch users');
      }
      
      return mockUsers as IUser[];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const addUser = createAsyncThunk(
  'users/addUser',
  async (userData: UserFormData, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Random 5% failure rate
      if (Math.random() < 0.05) {
        throw new Error('Failed to add user');
      }
      
      const newUser: IUser = {
        ...userData,
        id: `usr_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return newUser;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const editUser = createAsyncThunk(
  'users/editUser',
  async ({ id, userData }: { id: string; userData: Partial<UserFormData> }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Random 5% failure rate
      if (Math.random() < 0.05) {
        throw new Error('Failed to update user');
      }
      
      return { id, userData: { ...userData, updatedAt: new Date().toISOString() } };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Random 3% failure rate
      if (Math.random() < 0.03) {
        throw new Error('Failed to delete user');
      }
      
      return userId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const initialState: UsersState = {
  items: [],
  status: 'idle',
  error: undefined,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    // Fetch users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<IUser[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Add user
      .addCase(addUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Edit user
      .addCase(editUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id, userData } = action.payload;
        const userIndex = state.items.findIndex(user => user.id === id);
        if (userIndex !== -1) {
          state.items[userIndex] = { ...state.items[userIndex], ...userData };
        }
      })
      .addCase(editUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.items = state.items.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectUsers = (state: RootState) => state.users.items;
export const selectUsersStatus = (state: RootState) => state.users.status;
export const selectUsersError = (state: RootState) => state.users.error;

// Memoized selector for users by department
export const selectUsersByDepartment = createSelector(
  [selectUsers, (state: RootState, department: string) => department],
  (users, department) => users.filter(user => user.department === department)
);

// Memoized selector for unique departments
export const selectUniqueDepartments = createSelector(
  [selectUsers],
  (users) => Array.from(new Set(users.map(user => user.department)))
);

// Memoized selector for total validated images across all users
export const selectTotalValidatedImages = createSelector(
  [selectUsers],
  (users) => users.reduce((total, user) => total + user.validatedImages, 0)
);

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;