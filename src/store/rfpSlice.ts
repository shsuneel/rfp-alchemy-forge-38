/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';


export interface RequirementItem {
  id: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  phase?: string; // New field for phase
  relatedAssumptions?: string; // New field for assumptions specific to this requirement
  relatedDependencies?: string; // New field for dependencies specific to this requirement
}

export interface AssumptionItem {
  id: string;
  description: string;
}

export interface DependencyItem {
  id: string;
  description: string;
}

export interface SectionItem {
  id: string;
  type: 'title' | 'agenda' | 'summary' | 'diagram' | 'assumption' | 'dependency' | 'requirement';
  content: string;
  priority?: "High" | "Medium" | "Low"; // Only for requirements
  imageUrl?: string; // Only for diagrams
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
  analyticsAndReporting: string[];
  devops: string[];
  security: string[];
  testing: string[];
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
  level: "Junior" | "Mid" | "Senior" | "Lead" | "";
  hourlyRate: number;
}

export type RfpStatus = "InProgress" | "Completed" | "OnHold" | "Draft";

export interface RfpData {
  id: string;
  thorId: string;
  client: string;
  projectName: string;
  projectDescription: string;
  sector: string;
  clientInfo: string;
  techStack: string[];
  techStackByLayer: TechStackByLayer;
  requirements: RequirementItem[]; // Will use the updated interface
  assumptions: AssumptionItem[];
  dependencies: DependencyItem[];
  sections: SectionItem[];
  timeline: Phase[];
  team: TeamMember[];
  resources: ResourceLevel[];
  status: RfpStatus;
  remarks: string;
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
  techStackByLayer: TechStackByLayer; // Uses the updated interface
  requirements: RequirementItem[]; // Will use the updated interface
  assumptions: AssumptionItem[];
  dependencies: DependencyItem[];
  sections: SectionItem[];
  timeline: Phase[];
  team: TeamMember[];
  resources: ResourceLevel[];
  status: RfpStatus;
  remarks: string;
  initialData: any;
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
  techStackByLayer: { // Ensure this resets to the full structure
    frontend: [],
    backend: [],
    database: [],
    infrastructure: [],
    other: [],
    analyticsAndReporting: [],
    devops: [],
    security: [],
    testing: []
  },
  requirements: [
    { 
      id: "req-default", 
      description: "", 
      priority: "Medium",
      phase: "", // Initialize new field
      relatedAssumptions: "", // Initialize new field
      relatedDependencies: "" // Initialize new field
    }
  ],
  assumptions: [
    { id: "assump-default", description: "" }
  ],
  dependencies: [
    { id: "dep-default", description: "" }
  ],
  sections: [],
  timeline: [
    {
      id: "phase-default",
      name: "Discovery",
      description: "Initial requirements gathering and analysis",
      durationWeeks: 2
    }
  ],
  team: [
    { id: "team-default", name: "", email: "", role: "" }
  ],
  resources: [
    { id: "res-consultant", title: "", level: "", hourlyRate: 75 },
  ],
  status: "Draft",
  remarks: "",
  initialData: {},
  savedRfps: getSavedRfps()
};

export const fetchInitialData = createAsyncThunk(
  'data/fetchInitialData',
  async () => {
    const baseData = await axios.get('http://localhost:3020/rfp/basedata');
    const rfps = await axios.get('http://localhost:3020/rfp/rfps');
    return { baseData: baseData.data, rfps: rfps.data.rfps };
  }
);

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
      // Ensure all keys are present when setting byLayer
      state.techStackByLayer = {
        ...initialState.techStackByLayer, // provides defaults for new keys
        ...action.payload.byLayer,
      };
    },
    setRequirements: (state, action: PayloadAction<RequirementItem[]>) => {
      state.requirements = action.payload.map(req => ({
        phase: "", // Default if not provided
        relatedAssumptions: "", // Default if not provided
        relatedDependencies: "", // Default if not provided
        ...req, 
      }));
    },
    setAssumptions: (state, action: PayloadAction<AssumptionItem[]>) => {
      state.assumptions = action.payload;
    },
    setDependencies: (state, action: PayloadAction<DependencyItem[]>) => {
      state.dependencies = action.payload;
    },
    setSections: (state, action: PayloadAction<SectionItem[]>) => {
      state.sections = action.payload;
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
    setStatus: (state, action: PayloadAction<RfpStatus>) => {
      state.status = action.payload;
    },
    setRemarks: (state, action: PayloadAction<string>) => {
      state.remarks = action.payload;
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
        techStackByLayer: { 
            ...initialState.techStackByLayer,
            ...state.techStackByLayer,
        },
        requirements: state.requirements.map(req => ({ // Ensure new fields are saved
            phase: "",
            relatedAssumptions: "",
            relatedDependencies: "",
            ...req
        })),
        assumptions: state.assumptions,
        dependencies: state.dependencies,
        sections: state.sections,
        timeline: state.timeline,
        team: state.team,
        resources: state.resources,
        status: state.status,
        remarks: state.remarks,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        client: state.clientInfo.split('\n')[0] || '', 
      };

      // Check if this RFP already exists (by projectName)
      const existingIndex = state.savedRfps.findIndex(rfp =>
        rfp.projectName === state.projectName && state.projectName !== '');

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

        // Handle compatibility with older saved RFPs
        const defaultTechStackByLayer = {
            frontend: [],
            backend: [],
            database: [],
            infrastructure: [],
            other: rfpToLoad.techStack || [],
            analyticsAndReporting: [],
            devops: [],
            security: [],
            testing: []
        };
        
        state.techStackByLayer = rfpToLoad.techStackByLayer 
          ? { ...defaultTechStackByLayer, ...rfpToLoad.techStackByLayer }
          : defaultTechStackByLayer;

        state.requirements = rfpToLoad.requirements.map(req => ({ // Ensure new fields are loaded with defaults
          phase: "",
          relatedAssumptions: "",
          relatedDependencies: "",
          ...req
        }));
        state.assumptions = rfpToLoad.assumptions;
        state.dependencies = rfpToLoad.dependencies;
        state.sections = rfpToLoad.sections || [];
        state.timeline = rfpToLoad.timeline;
        state.team = rfpToLoad.team || initialState.team;
        state.resources = rfpToLoad.resources || initialState.resources;
        state.status = rfpToLoad.status || "Draft"; // Changed default to Draft
        state.remarks = rfpToLoad.remarks || "";
      }
    },
    deleteRfp: (state, action: PayloadAction<string>) => {
      state.savedRfps = state.savedRfps.filter(rfp => rfp.id !== action.payload);
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
      state.techStackByLayer = { // Ensure this resets to the full structure
        frontend: [],
        backend: [],
        database: [],
        infrastructure: [],
        other: [],
        analyticsAndReporting: [],
        devops: [],
        security: [],
        testing: []
      };
      state.requirements = [{ 
        id: "req-default", 
        description: "", 
        priority: "Medium",
        phase: "", // Reset new field
        relatedAssumptions: "", // Reset new field
        relatedDependencies: "" // Reset new field
      }];
      state.assumptions = [{ id: "assump-default", description: "" }];
      state.dependencies = [{ id: "dep-default", description: "" }];
      state.sections = [];
      state.timeline = [{
        id: "phase-default",
        name: "Discovery",
        description: "Initial requirements gathering and analysis",
        durationWeeks: 2
      }];
      state.team = [{ id: "team-default", name: "", email: "", role: "Project Manager" }];
      state.resources = initialState.resources; // Keep default resources
      state.status = "Draft"; // Default status
      state.remarks = "";
    },
    setExtractedInfo: (state, action: PayloadAction<{
      projectDescription?: string;
      requirements?: RequirementItem[]; // Will use updated RequirementItem
      techStack?: string[];
      assumptions?: AssumptionItem[];
      dependencies?: DependencyItem[];
    }>) => {
      if (action.payload.projectDescription) {
        state.projectDescription = action.payload.projectDescription;
      }
      
      if (action.payload.requirements && action.payload.requirements.length > 0) {
        state.requirements = action.payload.requirements.map(req => ({
          phase: "", // Default if not provided
          relatedAssumptions: "", // Default if not provided
          relatedDependencies: "", // Default if not provided
          ...req,
        }));
      }
      
      if (action.payload.techStack && action.payload.techStack.length > 0) {
        state.techStack = action.payload.techStack;
        state.techStackByLayer.other = [
          ...state.techStackByLayer.other,
          ...action.payload.techStack.filter(tech => 
            !state.techStackByLayer.other.includes(tech))
        ];
      }
      
      if (action.payload.assumptions && action.payload.assumptions.length > 0) {
        state.assumptions = action.payload.assumptions;
      }
      
      if (action.payload.dependencies && action.payload.dependencies.length > 0) {
        state.dependencies = action.payload.dependencies;
      }
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchInitialData.fulfilled, (state, action) => {
      state.initialData = action.payload;
      state.savedRfps = action.payload.rfps.map((rfp: RfpData) => ({
        ...rfp,
        requirements: rfp.requirements.map(req => ({
          phase: "",
          relatedAssumptions: "",
          relatedDependencies: "",
          ...req,
        }))
      }));
    })
    .addCase(fetchInitialData.rejected, (state, action) => {
      console.error("Error fetching initial data:", action.error.message);
    })
    .addCase(fetchInitialData.pending, (state) => {
      // Optionally handle loading state
    })
  },
});

export const {
  setThorId,
  setProjectInfo,
  setTechStack,
  setRequirements,
  setAssumptions,
  setDependencies,
  setSections,
  setTimeline,
  setTeam,
  setResources,
  setStatus,
  setRemarks,
  saveRfp,
  loadRfp,
  deleteRfp,
  clearCurrentRfp,
  setExtractedInfo,
} = rfpSlice.actions;

export default rfpSlice.reducer;
