
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserStory {
  id: string;
  title: string;
  description: string;
  complexity: "Low" | "Medium" | "High";
  effortDays: number;
}

export interface Screen {
  id: string;
  name: string;
  description: string;
  complexity: "Low" | "Medium" | "High";
  effortDays: number;
}

export interface Api {
  id: string;
  name: string;
  description: string;
  complexity: "Low" | "Medium" | "High";
  effortDays: number;
}

export interface FormFactor {
  id: string;
  name: string; // e.g., Desktop, Mobile, Tablet
  isSelected: boolean;
  effort: number; // Multiplier for effort
}

export interface Browser {
  id: string;
  name: string; // e.g., Chrome, Firefox, Safari
  isSelected: boolean;
  effort: number; // Multiplier for effort
}

interface EstimatesState {
  userStories: UserStory[];
  screens: Screen[];
  apis: Api[];
  formFactors: FormFactor[];
  browsers: Browser[];
  contingency: number; // Percentage to add for uncertainties
  riskFactor: number; // Additional percentage for project risks
}

const initialState: EstimatesState = {
  userStories: [],
  screens: [],
  apis: [],
  formFactors: [
    { id: 'desktop', name: 'Desktop', isSelected: true, effort: 1.0 },
    { id: 'mobile', name: 'Mobile', isSelected: false, effort: 1.2 },
    { id: 'tablet', name: 'Tablet', isSelected: false, effort: 1.1 },
  ],
  browsers: [
    { id: 'chrome', name: 'Chrome', isSelected: true, effort: 1.0 },
    { id: 'firefox', name: 'Firefox', isSelected: false, effort: 1.1 },
    { id: 'safari', name: 'Safari', isSelected: false, effort: 1.2 },
    { id: 'edge', name: 'Edge', isSelected: false, effort: 1.1 },
  ],
  contingency: 15,
  riskFactor: 10,
};

export const estimatesSlice = createSlice({
  name: 'estimates',
  initialState,
  reducers: {
    addUserStory: (state, action: PayloadAction<UserStory>) => {
      state.userStories.push(action.payload);
    },
    updateUserStory: (state, action: PayloadAction<UserStory>) => {
      const index = state.userStories.findIndex(story => story.id === action.payload.id);
      if (index !== -1) {
        state.userStories[index] = action.payload;
      }
    },
    deleteUserStory: (state, action: PayloadAction<string>) => {
      state.userStories = state.userStories.filter(story => story.id !== action.payload);
    },
    
    addScreen: (state, action: PayloadAction<Screen>) => {
      state.screens.push(action.payload);
    },
    updateScreen: (state, action: PayloadAction<Screen>) => {
      const index = state.screens.findIndex(screen => screen.id === action.payload.id);
      if (index !== -1) {
        state.screens[index] = action.payload;
      }
    },
    deleteScreen: (state, action: PayloadAction<string>) => {
      state.screens = state.screens.filter(screen => screen.id !== action.payload);
    },
    
    addApi: (state, action: PayloadAction<Api>) => {
      state.apis.push(action.payload);
    },
    updateApi: (state, action: PayloadAction<Api>) => {
      const index = state.apis.findIndex(api => api.id === action.payload.id);
      if (index !== -1) {
        state.apis[index] = action.payload;
      }
    },
    deleteApi: (state, action: PayloadAction<string>) => {
      state.apis = state.apis.filter(api => api.id !== action.payload);
    },
    
    updateFormFactors: (state, action: PayloadAction<FormFactor[]>) => {
      state.formFactors = action.payload;
    },
    updateBrowsers: (state, action: PayloadAction<Browser[]>) => {
      state.browsers = action.payload;
    },
    
    setContingency: (state, action: PayloadAction<number>) => {
      state.contingency = action.payload;
    },
    setRiskFactor: (state, action: PayloadAction<number>) => {
      state.riskFactor = action.payload;
    },
  },
});

export const {
  addUserStory,
  updateUserStory,
  deleteUserStory,
  addScreen,
  updateScreen,
  deleteScreen,
  addApi,
  updateApi,
  deleteApi,
  updateFormFactors,
  updateBrowsers,
  setContingency,
  setRiskFactor,
} = estimatesSlice.actions;

export default estimatesSlice.reducer;
