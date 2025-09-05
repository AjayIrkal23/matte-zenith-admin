import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AsyncStatus } from '@/types/admin';
import { RootState } from '../index';

// Department interface
export interface IDepartment {
  _id: string;
  name: string;
  description: string;
  headName: string;
  headEmail: string;
  employeeCount: number;
  validatedImages: number;
  averageScore: number;
  createdAt: string;
  updatedAt: string;
}

// Department state interface
interface DepartmentState {
  departments: IDepartment[];
  selectedDepartment: IDepartment | null;
  status: AsyncStatus;
  error: string | undefined;
}

// Mock department data
const mockDepartments: IDepartment[] = [
  {
    _id: 'dept_1',
    name: 'Safety',
    description: 'Workplace Safety and Compliance',
    headName: 'Rajesh Kumar',
    headEmail: 'rajesh.kumar@adani.com',
    employeeCount: 45,
    validatedImages: 1250,
    averageScore: 95.8,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-12-01T14:30:00Z',
  },
  {
    _id: 'dept_2',
    name: 'Operations',
    description: 'Daily Operations Management',
    headName: 'Priya Sharma',
    headEmail: 'priya.sharma@adani.com',
    employeeCount: 62,
    validatedImages: 980,
    averageScore: 88.4,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-12-01T14:30:00Z',
  },
  {
    _id: 'dept_3',
    name: 'Maintenance',
    description: 'Equipment and Facility Maintenance',
    headName: 'Amit Singh',
    headEmail: 'amit.singh@adani.com',
    employeeCount: 38,
    validatedImages: 760,
    averageScore: 91.2,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-12-01T14:30:00Z',
  },
  {
    _id: 'dept_4',
    name: 'Security',
    description: 'Site Security and Access Control',
    headName: 'Vikash Gupta',
    headEmail: 'vikash.gupta@adani.com',
    employeeCount: 28,
    validatedImages: 420,
    averageScore: 86.7,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-12-01T14:30:00Z',
  },
];

// Async thunks
export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Random 5% failure rate
      if (Math.random() < 0.05) {
        throw new Error('Failed to fetch departments');
      }
      
      return mockDepartments;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const createDepartment = createAsyncThunk(
  'departments/createDepartment',
  async (departmentData: Omit<IDepartment, '_id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Random 10% failure rate
      if (Math.random() < 0.1) {
        throw new Error('Failed to create department');
      }
      
      const newDepartment: IDepartment = {
        ...departmentData,
        _id: `dept_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return newDepartment;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updateDepartment = createAsyncThunk(
  'departments/updateDepartment',
  async ({ id, updates }: { id: string; updates: Partial<IDepartment> }, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Random 8% failure rate
      if (Math.random() < 0.08) {
        throw new Error('Failed to update department');
      }
      
      return { id, updates: { ...updates, updatedAt: new Date().toISOString() } };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  'departments/deleteDepartment',
  async (id: string, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Random 5% failure rate
      if (Math.random() < 0.05) {
        throw new Error('Failed to delete department');
      }
      
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchDepartmentStats = createAsyncThunk(
  'departments/fetchDepartmentStats',
  async (departmentId: string, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Random 5% failure rate
      if (Math.random() < 0.05) {
        throw new Error('Failed to fetch department statistics');
      }
      
      // Generate mock stats
      const stats = {
        departmentId,
        totalValidations: Math.floor(Math.random() * 2000) + 500,
        monthlyGrowth: Math.floor(Math.random() * 30) + 5,
        topPerformer: 'John Doe',
        averageCompletionTime: Math.floor(Math.random() * 120) + 30, // in minutes
      };
      
      return stats;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Initial state
const initialState: DepartmentState = {
  departments: [],
  selectedDepartment: null,
  status: 'idle',
  error: undefined,
};

// Department slice
const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = undefined;
    },
    setSelectedDepartment: (state, action: PayloadAction<IDepartment | null>) => {
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
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(fetchDepartments.fulfilled, (state, action: PayloadAction<IDepartment[]>) => {
        state.status = 'succeeded';
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Create department
      .addCase(createDepartment.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(createDepartment.fulfilled, (state, action: PayloadAction<IDepartment>) => {
        state.status = 'succeeded';
        state.departments.push(action.payload);
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Update department
      .addCase(updateDepartment.fulfilled, (state, action: PayloadAction<{ id: string; updates: Partial<IDepartment> }>) => {
        const { id, updates } = action.payload;
        const index = state.departments.findIndex(dept => dept._id === id);
        if (index !== -1) {
          state.departments[index] = { ...state.departments[index], ...updates };
          if (state.selectedDepartment?._id === id) {
            state.selectedDepartment = { ...state.selectedDepartment, ...updates };
          }
        }
      })
      // Delete department
      .addCase(deleteDepartment.fulfilled, (state, action: PayloadAction<string>) => {
        state.departments = state.departments.filter(dept => dept._id !== action.payload);
        if (state.selectedDepartment?._id === action.payload) {
          state.selectedDepartment = null;
        }
      });
  },
});

// Selectors
export const selectDepartments = (state: RootState) => state.departments.departments;
export const selectSelectedDepartment = (state: RootState) => state.departments.selectedDepartment;
export const selectDepartmentStatus = (state: RootState) => state.departments.status;
export const selectDepartmentError = (state: RootState) => state.departments.error;

// Memoized selectors
export const selectDepartmentById = (state: RootState, departmentId: string) =>
  state.departments.departments.find(dept => dept._id === departmentId);

export const selectDepartmentsByEmployeeCount = (state: RootState) =>
  [...state.departments.departments].sort((a, b) => b.employeeCount - a.employeeCount);

export const selectTopPerformingDepartments = (state: RootState) =>
  [...state.departments.departments]
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 3);

// Actions
export const { clearError, setSelectedDepartment, clearSelectedDepartment } = departmentSlice.actions;

export default departmentSlice.reducer;