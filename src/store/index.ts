
import { configureStore } from '@reduxjs/toolkit';
import rfpReducer from './rfpSlice';
import presentationReducer from './presentationSlice';
import estimatesReducer from './estimatesSlice';

export const store = configureStore({
  reducer: {
    rfp: rfpReducer,
    presentation: presentationReducer,
    estimates: estimatesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
