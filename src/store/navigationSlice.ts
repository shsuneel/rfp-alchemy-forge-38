
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NavigationState {
  currentTab: string;
  previousTab: string | null;
  estimatesActiveTab: string;
}

const initialState: NavigationState = {
  currentTab: 'rfpList', // Default tab
  previousTab: null,
  estimatesActiveTab: 'userStories', // Default tab for estimates
};

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setCurrentTab: (state, action: PayloadAction<string>) => {
      state.previousTab = state.currentTab;
      state.currentTab = action.payload;
    },
    setEstimatesActiveTab: (state, action: PayloadAction<string>) => {
      state.estimatesActiveTab = action.payload;
    },
  },
});

export const { setCurrentTab, setEstimatesActiveTab } = navigationSlice.actions;

export default navigationSlice.reducer;
