import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

interface UsersUiState {
  selectedDepartment?: string;
  validatedImagesRange: [number, number];
  searchQuery: string;
}

const initialState: UsersUiState = {
  selectedDepartment: undefined,
  validatedImagesRange: [0, 100],
  searchQuery: '',
};

const usersUiSlice = createSlice({
  name: 'usersUi',
  initialState,
  reducers: {
    setSelectedDepartment: (state, action: PayloadAction<string | undefined>) => {
      state.selectedDepartment = action.payload;
    },
    setValidatedImagesRange: (state, action: PayloadAction<[number, number]>) => {
      state.validatedImagesRange = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    resetFilters: (state) => {
      state.selectedDepartment = undefined;
      state.validatedImagesRange = [0, 100];
      state.searchQuery = '';
    },
  },
});

// Selectors
export const selectSelectedDepartment = (state: RootState) => state.usersUi.selectedDepartment;
export const selectValidatedImagesRange = (state: RootState) => state.usersUi.validatedImagesRange;
export const selectUsersSearchQuery = (state: RootState) => state.usersUi.searchQuery;

export const { 
  setSelectedDepartment, 
  setValidatedImagesRange, 
  setSearchQuery, 
  resetFilters 
} = usersUiSlice.actions;

export default usersUiSlice.reducer;