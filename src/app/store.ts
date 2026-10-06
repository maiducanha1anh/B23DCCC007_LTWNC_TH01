import { configureStore } from '@reduxjs/toolkit';
import assignmentReducer from '../features/assignments/assignmentSlice';

export const store = configureStore({
  reducer: {
    assignments: assignmentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
