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

export interface TechStackByLayer {
  frontend: string[];
  backend: string[];
  database: string[];
  infrastructure: string[];
  other: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ResourceLevel {
  id: string;
  title: string;
  level: "Junior" | "Mid" | "Senior" | "Lead";
  hourlyRate: number;
}

export interface RfpData {
  id: string;
  thorId: string;
  projectName: string;
  projectDescription: string;
  sector: string;
  clientInfo: string;
  techStack: string[];
  techStackByLayer: TechStackByLayer;
  requirements: RequirementItem[];
  assumptions: AssumptionItem[];
  dependencies: DependencyItem[];
  timeline: Phase[];
  team: TeamMember[];
  resources: ResourceLevel[];
  createdAt: string;
  updatedAt: string;
}

interface RfpState {
  thorId: string;
  projectName: string;
  projectDescription: string;
  sector: string;
  clientInfo: string;
  techStack: string[];
  techStackByLayer: TechStackByLayer;
  requirements: RequirementItem[];
  assumptions: AssumptionItem[];
  dependencies: DependencyItem[];
  timeline: Phase[];
  team: TeamMember[];
  resources: ResourceLevel[];
  savedRfps: RfpData[];
}

// Load saved RFPs from localStorage if available
const getSavedRfps = (): RfpData[] => {
  if (typeof window === 'undefined') return [];
  
  const savedRfps = localStorage.getItem('savedRfps');
  return savedRfps ? JSON.parse(savedRfps) : [];
};

const initialState: RfpState = {
  thorId: '',
  projectName: '',
  projectDescription: '',
  sector: '',
  clientInfo: '',
  techStack: [],
  techStackByLayer: {
    frontend: [],
    backend: [],
    database: [],
    infrastructure: [],
    other: []
  },
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
  team: [
    { id: "team-default", name: "", email: "", role: "Project Manager" }
  ],
  resources: [
    { id: "res-consultant", title: "Consultant", level: "Mid", hourlyRate: 75 },
    { id: "res-sr-consultant", title: "Senior Consultant", level: "Senior", hourlyRate: 125 },
    { id: "res-architect", title: "Architect", level: "Senior", hourlyRate: 150 },
    { id: "res-solution-architect", title: "Solution Architect", level: "Lead", hourlyRate: 175 },
    { id: "res-ba", title: "Business Analyst", level: "Mid", hourlyRate: 100 },
    { id: "res-tester", title: "Tester", level: "Junior", hourlyRate: 60 }
  ],
  savedRfps: getSavedRfps()
};

export const rfpSlice = createSlice({
  name: 'rfp',
  initialState,
  reducers: {
    setThorId: (state, action: PayloadAction<string>) => {
      state.thorId = action.payload;
    },
    setProjectInfo: (state, action: PayloadAction<{ name: string; description: string; sector: string; clientInfo: string }>) => {
      state.projectName = action.payload.name;
      state.projectDescription = action.payload.description;
      state.sector = action.payload.sector;
      state.clientInfo = action.payload.clientInfo;
    },
    setTechStack: (state, action: PayloadAction<{ flattenedStack: string[], byLayer: TechStackByLayer }>) => {
      state.techStack = action.payload.flattenedStack;
      state.techStackByLayer = action.payload.byLayer;
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
    setTeam: (state, action: PayloadAction<TeamMember[]>) => {
      state.team = action.payload;
    },
    setResources: (state, action: PayloadAction<ResourceLevel[]>) => {
      state.resources = action.payload;
    },
    saveRfp: (state) => {
      // Generate a new RFP data object with current state
      const newRfp: RfpData = {
        id: `rfp-${Date.now()}`,
        thorId: state.thorId,
        projectName: state.projectName,
        projectDescription: state.projectDescription,
        sector: state.sector,
        clientInfo: state.clientInfo,
        techStack: state.techStack,
        techStackByLayer: state.techStackByLayer,
        requirements: state.requirements,
        assumptions: state.assumptions,
        dependencies: state.dependencies,
        timeline: state.timeline,
        team: state.team,
        resources: state.resources,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Check if this RFP already exists (by projectName)
      const existingIndex = state.savedRfps.findIndex(rfp => 
        rfp.projectName === state.projectName && rfp.projectName !== '');
      
      if (existingIndex !== -1 && state.projectName !== '') {
        // Update existing RFP
        state.savedRfps[existingIndex] = {
          ...newRfp,
          id: state.savedRfps[existingIndex].id,
          createdAt: state.savedRfps[existingIndex].createdAt,
        };
      } else if (state.projectName !== '') {
        // Add new RFP
        state.savedRfps.push(newRfp);
      }
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('savedRfps', JSON.stringify(state.savedRfps));
      }
    },
    loadRfp: (state, action: PayloadAction<string>) => {
      const rfpId = action.payload;
      const rfpToLoad = state.savedRfps.find(rfp => rfp.id === rfpId);
      
      if (rfpToLoad) {
        state.thorId = rfpToLoad.thorId || '';
        state.projectName = rfpToLoad.projectName;
        state.projectDescription = rfpToLoad.projectDescription;
        state.sector = rfpToLoad.sector;
        state.clientInfo = rfpToLoad.clientInfo;
        state.techStack = rfpToLoad.techStack;
        
        // Handle compatibility with older saved RFPs that don't have techStackByLayer
        if (rfpToLoad.techStackByLayer) {
          state.techStackByLayer = rfpToLoad.techStackByLayer;
        } else {
          // Create a default structure with all techs in "other" category
          state.techStackByLayer = {
            frontend: [],
            backend: [],
            database: [],
            infrastructure: [],
            other: rfpToLoad.techStack || []
          };
        }
        
        state.requirements = rfpToLoad.requirements;
        state.assumptions = rfpToLoad.assumptions;
        state.dependencies = rfpToLoad.dependencies;
        state.timeline = rfpToLoad.timeline;
        // Handle compatibility with older saved RFPs that don't have team and resources
        state.team = rfpToLoad.team || initialState.team;
        state.resources = rfpToLoad.resources || initialState.resources;
      }
    },
    deleteRfp: (state, action: PayloadAction<string>) => {
      state.savedRfps = state.savedRfps.filter(rfp => rfp.id !== action.payload);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('savedRfps', JSON.stringify(state.savedRfps));
      }
    },
    clearCurrentRfp: (state) => {
      state.thorId = '';
      state.projectName = '';
      state.projectDescription = '';
      state.sector = '';
      state.clientInfo = '';
      state.techStack = [];
      state.techStackByLayer = {
        frontend: [],
        backend: [],
        database: [],
        infrastructure: [],
        other: []
      };
      state.requirements = [{ id: "req-default", description: "", priority: "Medium" }];
      state.assumptions = [{ id: "assump-default", description: "" }];
      state.dependencies = [{ id: "dep-default", description: "" }];
      state.timeline = [{
        id: "phase-default",
        name: "Discovery",
        description: "Initial requirements gathering and analysis",
        durationWeeks: 2
      }];
      state.team = [{ id: "team-default", name: "", email: "", role: "Project Manager" }];
      // Keep the default resources
      state.resources = initialState.resources;
    }
  },
});

export const {
  setThorId,
  setProjectInfo,
  setTechStack,
  setRequirements,
  setAssumptions,
  setDependencies,
  setTimeline,
  setTeam,
  setResources,
  saveRfp,
  loadRfp,
  deleteRfp,
  clearCurrentRfp,
} = rfpSlice.actions;

export default rfpSlice.reducer;
