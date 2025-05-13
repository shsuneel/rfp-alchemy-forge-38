
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ComplexityLevels {
  ui: "Low" | "Medium" | "High";
  middleware: "Low" | "Medium" | "High";
  businessLogic: "Low" | "Medium" | "High";
  integration: "Low" | "Medium" | "High";
}

export interface UserStory {
  id: string;
  title: string;
  description: string;
  assumptions?: string;
  complexity: ComplexityLevels;
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

export interface ApplicationFactor {
  factorId: string;
  name: string;
  group: string;
  isSelected: boolean;
  effort?: number; // Optional effort multiplier
}

export interface PlatformConfig {
  contingency: number; // Percentage to add for uncertainties
  riskFactor: number; // Additional percentage for project risks
}

interface EstimatesState {
  userStories: UserStory[];
  screens: Screen[];
  apis: Api[];
  formFactors: FormFactor[];
  browsers: Browser[];
  applicationFactors: ApplicationFactor[];
  platformConfig: PlatformConfig;
  contingency: number; // Percentage to add for uncertainties
  riskFactor: number; // Additional percentage for project risks
  totalEffort: number;
  totalCost: number;
}

const initialApplicationFactors: ApplicationFactor[] = [
  {
    "factorId": "exception_handling",
    "name": "Exception Handling",
    "group": "Framework elements",
    "isSelected": false
  },
  {
    "factorId": "audit_log",
    "name": "Audit Log",
    "group": "Framework elements",
    "isSelected": false
  },
  {
    "factorId": "container_runtime",
    "name": "Container / Runtime",
    "group": "Framework elements",
    "isSelected": false
  },
  {
    "factorId": "user_statistics",
    "name": "User Statistics",
    "group": "Framework elements",
    "isSelected": false
  },
  {
    "factorId": "multi_navigation",
    "name": "Multi - Navigation (Carousel etc.)",
    "group": "Framework elements",
    "isSelected": false
  },
  {
    "factorId": "multi_lingual",
    "name": "Multi Lingual",
    "group": "Framework elements",
    "isSelected": false
  },
  {
    "factorId": "multi_orientation",
    "name": "Multi Orientation",
    "group": "Framework elements",
    "isSelected": false
  },
  {
    "factorId": "notification",
    "name": "Notification",
    "group": "Framework elements",
    "isSelected": false
  },
  {
    "factorId": "alerts",
    "name": "Alerts",
    "group": "Framework elements",
    "isSelected": false
  },
  {
    "factorId": "calendar_synch",
    "name": "Calendar Synch",
    "group": "Framework elements",
    "isSelected": false
  },
  {
    "factorId": "database_synch",
    "name": "Database Synch",
    "group": "Framework elements",
    "isSelected": false
  },
  {
    "factorId": "encryption",
    "name": "Encryption",
    "group": "Security Layers",
    "isSelected": false
  },
  {
    "factorId": "session_management",
    "name": "Session Management",
    "group": "Security Layers",
    "isSelected": false
  },
  {
    "factorId": "token_authentication",
    "name": "Token / Key Authentication",
    "group": "Security Layers",
    "isSelected": false
  },
  {
    "factorId": "client_certificate_validation",
    "name": "Client Certificate Validation",
    "group": "Security Layers",
    "isSelected": false
  },
  {
    "factorId": "screen_blurring",
    "name": "Screen Blurring",
    "group": "Security Layers",
    "isSelected": false
  },
  {
    "factorId": "request_filtering",
    "name": "Request Filtering",
    "group": "Security Layers",
    "isSelected": false
  },
  {
    "factorId": "jailbreak_validation",
    "name": "Jailbreak Validation",
    "group": "Security Layers",
    "isSelected": false
  },
  {
    "factorId": "code_obsfucation",
    "name": "Code Obsfucation",
    "group": "Security Layers",
    "isSelected": false
  },
  {
    "factorId": "role_access",
    "name": "Role / Functionality Access",
    "group": "Security Layers",
    "isSelected": false
  },
  {
    "factorId": "remote_wipeout",
    "name": "Remote Wipeout",
    "group": "Security Layers",
    "isSelected": false
  },
  {
    "factorId": "app_version_identification",
    "name": "Application Version Identification",
    "group": "Security Layers",
    "isSelected": false
  },
  {
    "factorId": "advance_pagination",
    "name": "Advance Pagination",
    "group": "Security Layers",
    "isSelected": false
  },
  {
    "factorId": "encrypted",
    "name": "Encrypted",
    "group": "Security Layers",
    "isSelected": false
  },
  {
    "factorId": "data_caching",
    "name": "Data caching for App in background",
    "group": "Security Layers",
    "isSelected": false
  },
  {
    "factorId": "no_of_users",
    "name": "No of Users / Subscribers",
    "group": "Non Functional Requirements",
    "isSelected": false
  },
  {
    "factorId": "screen_transition_speed",
    "name": "Screen Transition Speed",
    "group": "Non Functional Requirements",
    "isSelected": false
  },
  {
    "factorId": "carrier_validation",
    "name": "Carrier Validation",
    "group": "Non Functional Requirements",
    "isSelected": false
  },
  {
    "factorId": "memory_leakage_validation",
    "name": "Memory Leakage Validation",
    "group": "Non Functional Requirements",
    "isSelected": false
  },
  {
    "factorId": "location_service_validation",
    "name": "Location Service Validation",
    "group": "Non Functional Requirements",
    "isSelected": false
  }
];

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
  applicationFactors: initialApplicationFactors,
  platformConfig: {
    contingency: 15,
    riskFactor: 10
  },
  contingency: 15,
  riskFactor: 10,
  totalEffort: 0,
  totalCost: 0,
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
    
    updateApplicationFactors: (state, action: PayloadAction<ApplicationFactor[]>) => {
      state.applicationFactors = action.payload;
    },

    toggleApplicationFactor: (state, action: PayloadAction<string>) => {
      const factorId = action.payload;
      const factor = state.applicationFactors.find(f => f.factorId === factorId);
      if (factor) {
        factor.isSelected = !factor.isSelected;
      }
    },
    
    updatePlatformConfig: (state, action: PayloadAction<PlatformConfig>) => {
      state.platformConfig = action.payload;
      state.contingency = action.payload.contingency;
      state.riskFactor = action.payload.riskFactor;
    },
    
    updateTotalEffort: (state, action: PayloadAction<number>) => {
      state.totalEffort = action.payload;
    },
    
    updateTotalCost: (state, action: PayloadAction<number>) => {
      state.totalCost = action.payload;
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
  updateApplicationFactors,
  toggleApplicationFactor,
  updatePlatformConfig,
  updateTotalEffort,
  updateTotalCost,
} = estimatesSlice.actions;

export default estimatesSlice.reducer;
