
import { configureStore } from '@reduxjs/toolkit';
import rfpReducer from './rfpSlice';
import presentationReducer from './presentationSlice';
import estimatesReducer from './estimatesSlice';
import navigationReducer from './navigationSlice';

export const store = configureStore({
  reducer: {
    rfp: rfpReducer,
    presentation: presentationReducer,
    estimates: estimatesReducer,
    navigation: navigationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
