
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RequirementItem {
  id: string;
  description: string;
  priority: "High" | "Medium" | "Low";
}

export interface AssumptionItem {
  id: string;
  description: string;
}

export interface DependencyItem {
  id: string;
  description: string;
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  durationWeeks: number;
}

interface RfpState {
  projectName: string;
  projectDescription: string;
  sector: string;
  clientInfo: string;
  techStack: string[];
  requirements: RequirementItem[];
  assumptions: AssumptionItem[];
  dependencies: DependencyItem[];
  timeline: Phase[];
}

const initialState: RfpState = {
  projectName: '',
  projectDescription: '',
  sector: '',
  clientInfo: '',
  techStack: [],
  requirements: [
    { id: "req-default", description: "", priority: "Medium" }
  ],
  assumptions: [
    { id: "assump-default", description: "" }
  ],
  dependencies: [
    { id: "dep-default", description: "" }
  ],
  timeline: [
    {
      id: "phase-default",
      name: "Discovery",
      description: "Initial requirements gathering and analysis",
      durationWeeks: 2
    }
  ],
};

export const rfpSlice = createSlice({
  name: 'rfp',
  initialState,
  reducers: {
    setProjectInfo: (state, action: PayloadAction<{ name: string; description: string; sector: string; clientInfo: string }>) => {
      state.projectName = action.payload.name;
      state.projectDescription = action.payload.description;
      state.sector = action.payload.sector;
      state.clientInfo = action.payload.clientInfo;
    },
    setTechStack: (state, action: PayloadAction<string[]>) => {
      state.techStack = action.payload;
    },
    setRequirements: (state, action: PayloadAction<RequirementItem[]>) => {
      state.requirements = action.payload;
    },
    setAssumptions: (state, action: PayloadAction<AssumptionItem[]>) => {
      state.assumptions = action.payload;
    },
    setDependencies: (state, action: PayloadAction<DependencyItem[]>) => {
      state.dependencies = action.payload;
    },
    setTimeline: (state, action: PayloadAction<Phase[]>) => {
      state.timeline = action.payload;
    },
  },
});

export const {
  setProjectInfo,
  setTechStack,
  setRequirements,
  setAssumptions,
  setDependencies,
  setTimeline,
} = rfpSlice.actions;

export default rfpSlice.reducer;
