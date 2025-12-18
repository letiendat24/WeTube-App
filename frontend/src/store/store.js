import { configureStore } from '@reduxjs/toolkit';
import { videosApi } from '@/features/videos/videoSlice'; 

export const store = configureStore({
  reducer: {
    [videosApi.reducerPath]: videosApi.reducer, 
  },
  
  // Middleware vẫn bắt buộc để RTK Query chạy caching, polling...
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(videosApi.middleware),
});