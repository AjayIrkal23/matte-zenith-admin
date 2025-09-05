import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { IUser, LeaderboardState } from '@/types/admin';
import { RootState } from '../index';
import { selectUsers } from './usersSlice';

// Async thunk to recompute leaderboard
export const recomputeLeaderboard = createAsyncThunk(
  'leaderboard/recompute',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Simulate API computation time
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Random 5% failure rate
      if (Math.random() < 0.05) {
        throw new Error('Failed to compute leaderboard');
      }
      
      const state = getState() as RootState;
      const users = selectUsers(state);
      
      // Sort users by validatedImages in descending order
      const sortedUsers = [...users].sort((a, b) => b.validatedImages - a.validatedImages);
      
      // Add score field (same as validatedImages for now, but could be computed differently)
      const usersWithScores = sortedUsers.map((user, index) => ({
        ...user,
        score: user.validatedImages,
        rank: index + 1,
      }));
      
      const top3 = usersWithScores.slice(0, 3);
      
      return {
        top: top3,
        all: usersWithScores,
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const initialState: LeaderboardState = {
  top: [],
  all: [],
  status: 'idle',
  error: undefined,
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(recomputeLeaderboard.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(recomputeLeaderboard.fulfilled, (state, action: PayloadAction<{ top: IUser[]; all: IUser[] }>) => {
        state.status = 'succeeded';
        state.top = action.payload.top;
        state.all = action.payload.all;
      })
      .addCase(recomputeLeaderboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectTop3 = (state: RootState) => state.leaderboard.top;
export const selectLeaderboardAll = (state: RootState) => state.leaderboard.all;
export const selectLeaderboardStatus = (state: RootState) => state.leaderboard.status;
export const selectLeaderboardError = (state: RootState) => state.leaderboard.error;

// Memoized selector to get leaderboard with rankings
export const selectLeaderboardWithRankings = createSelector(
  [selectLeaderboardAll],
  (users) => users.map((user, index) => ({
    ...user,
    rank: index + 1,
  }))
);

// Selector to get user's rank by ID
export const selectUserRank = createSelector(
  [selectLeaderboardAll, (state: RootState, userId: string) => userId],
  (users, userId) => {
    const userIndex = users.findIndex(user => user._id === userId);
    return userIndex !== -1 ? userIndex + 1 : null;
  }
);

export const { clearError } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;