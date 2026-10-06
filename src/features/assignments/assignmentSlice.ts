import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Assignment, DeadlineFilter } from './assignmentTypes';
import { assignmentApi, persistAssignments, resetMockStorage } from './assignmentApi';

export interface AssignmentState {
  items: Assignment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filter: DeadlineFilter;
  searchQuery: string;
}

const initialState: AssignmentState = {
  items: [],
  status: 'idle',
  error: null,
  filter: 'ALL',
  searchQuery: '',
};

/**
 * Async Thunk to fetch assignments from simulated API
 * Demonstrates createAsyncThunk with full TypeScript payload and rejection types
 */
export const fetchAssignments = createAsyncThunk<
  Assignment[],
  { forceFail?: boolean } | void,
  { rejectValue: string }
>('assignments/fetchAssignments', async (args, { rejectWithValue }) => {
  try {
    const forceFail = args?.forceFail ?? false;
    const response = await assignmentApi.fetchAssignments(forceFail);
    return response.data;
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định khi tải dữ liệu';
    return rejectWithValue(errorMessage);
  }
});

export const assignmentSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    addAssignment: (state, action: PayloadAction<Assignment>) => {
      // Add new assignment to the top of list
      state.items.unshift(action.payload);
      persistAssignments(state.items);
    },
    toggleAssignment: (state, action: PayloadAction<string>) => {
      const assignment = state.items.find((item) => item.id === action.payload);
      if (assignment) {
        assignment.completed = !assignment.completed;
        persistAssignments(state.items);
      }
    },
    deleteAssignment: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      persistAssignments(state.items);
    },
    setFilter: (state, action: PayloadAction<DeadlineFilter>) => {
      state.filter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    resetDefaults: (state) => {
      resetMockStorage();
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action: PayloadAction<Assignment[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Không thể tải danh sách bài tập. Vui lòng thử lại.';
      });
  },
});

export const {
  addAssignment,
  toggleAssignment,
  deleteAssignment,
  setFilter,
  setSearchQuery,
  resetDefaults,
} = assignmentSlice.actions;

export default assignmentSlice.reducer;
