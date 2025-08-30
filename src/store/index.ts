import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import usersReducer from './slices/usersSlice';
import usersUiReducer from './slices/usersUiSlice';
import imagesReducer from './slices/imagesSlice';
import leaderboardReducer from './slices/leaderboardSlice';
import annotatedImagesReducer from './slices/annotatedImagesSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    usersUi: usersUiReducer,
    images: imagesReducer,
    leaderboard: leaderboardReducer,
    annotatedImages: annotatedImagesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for file uploads
        ignoredActions: ['images/uploadZip/pending', 'images/uploadZip/fulfilled'],
        // Ignore these field paths in actions
        ignoredActionsPaths: ['payload.file', 'meta.arg.file'],
        // Ignore these paths in the state
        ignoredPaths: ['images.uploadFile'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Pre-typed hooks for usage throughout the app
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;