
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SlideElement {
  id: string;
  type: "text" | "image" | "shape" | "diagram" | "footer" | "header" | "logo";
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style?: Record<string, string>;
  isGlobal?: boolean; // Indicates if element appears on all slides
  role?: "title" | "subtitle" | "body" | "footer" | "date" | "copyright" | "pageNumber" | "custom";
}

export interface Slide {
  id: string;
  title: string;
  content: string;
  type: "title" | "content" | "image" | "diagram" | "master" | "section" | "template";
  template: string;
  background?: string;
  customBackground?: string;
  elements: SlideElement[];
  applyMaster?: boolean; // Whether to apply master slide elements
}

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontPrimary?: string;
  fontSecondary?: string;
}

export interface MasterSlideSettings {
  titlePosition: { x: number, y: number };
  showFooter: boolean;
  footerHeight: number;
  showDate: boolean;
  showPageNumber: boolean;
  showCopyright: boolean;
  copyrightText: string;
  customFooterText: string;
  logoUrl?: string;
}

interface PresentationState {
  title: string;
  slides: Slide[];
  selectedSlideId: string;
  selectedTemplate: Template;
  masterSlideSettings: MasterSlideSettings;
  masterElements: SlideElement[];
}

const defaultTemplates: Template[] = [
  {
    id: "corporate",
    name: "Corporate Blue",
    thumbnail: "/lovable-uploads/def60ec4-37af-47fd-b27a-ed307e1a96c3.png",
    primaryColor: "#002060",
    secondaryColor: "#0078D4",
    accentColor: "#00B0F0",
    fontPrimary: "Arial",
    fontSecondary: "Calibri",
  },
  {
    id: "modern",
    name: "Modern Purple",
    thumbnail: "/placeholder.svg",
    primaryColor: "#7030A0",
    secondaryColor: "#9b87f5",
    accentColor: "#C5A5CF",
    fontPrimary: "Roboto",
    fontSecondary: "Open Sans",
  },
  {
    id: "minimalist",
    name: "Minimalist White",
    thumbnail: "/placeholder.svg",
    primaryColor: "#FFFFFF",
    secondaryColor: "#F2F2F2",
    accentColor: "#D9D9D9",
    fontPrimary: "Helvetica",
    fontSecondary: "Arial",
  },
  {
    id: "agenda",
    name: "Agenda Template",
    thumbnail: "/lovable-uploads/7d958b51-2c47-49c4-ad1c-03bcf81b4262.png",
    primaryColor: "#1E293B",
    secondaryColor: "#00B0F0",
    accentColor: "#FFFFFF",
    fontPrimary: "Segoe UI",
    fontSecondary: "Verdana",
  },
  {
    id: "understanding",
    name: "Understanding Template",
    thumbnail: "/lovable-uploads/f9b25e6f-fbcf-4ead-b44f-cd069f221d2d.png",
    primaryColor: "#1E293B",
    secondaryColor: "#00B0F0",
    accentColor: "#002060",
    fontPrimary: "Georgia",
    fontSecondary: "Times New Roman",
  },
  {
    id: "blank",
    name: "Blank Template",
    thumbnail: "/lovable-uploads/919105d7-797a-4abc-8b18-b7a547e61870.png",
    primaryColor: "#1E293B",
    secondaryColor: "#00B0F0",
    accentColor: "#002060",
    fontPrimary: "Arial",
    fontSecondary: "Helvetica",
  }
];

// Default master slide elements and settings
const defaultMasterElements: SlideElement[] = [
  {
    id: "master-footer",
    type: "footer",
    content: "",
    x: 0,
    y: 500,
    width: 960,
    height: 40,
    isGlobal: true,
    style: { backgroundColor: "rgba(0,0,0,0.1)", padding: "8px" },
  },
  {
    id: "master-date",
    type: "text",
    content: new Date().toLocaleDateString(),
    x: 50,
    y: 510,
    width: 200,
    height: 20,
    isGlobal: true,
    role: "date",
    style: { fontSize: "12px", color: "#555555" },
  },
  {
    id: "master-copyright",
    type: "text",
    content: "© 2025 Company Name",
    x: 700,
    y: 510,
    width: 200,
    height: 20,
    isGlobal: true,
    role: "copyright",
    style: { fontSize: "12px", color: "#555555", textAlign: "right" },
  },
];

const defaultMasterSettings: MasterSlideSettings = {
  titlePosition: { x: 50, y: 50 },
  showFooter: true,
  footerHeight: 40,
  showDate: true,
  showPageNumber: true,
  showCopyright: true,
  copyrightText: "© 2025 Company Name",
  customFooterText: "",
};

const defaultSlides: Slide[] = [
  {
    id: "slide-1",
    title: "Title Slide",
    content: "Project Presentation",
    type: "title",
    template: "corporate",
    applyMaster: true,
    elements: [
      {
        id: "elem-1",
        type: "text",
        content: "Company | Client",
        x: 50,
        y: 50,
        width: 500,
        height: 50,
        style: { fontSize: "24px", color: "#333333" },
      },
      {
        id: "elem-2",
        type: "text",
        content: "Project Presentation",
        x: 100,
        y: 200,
        width: 400,
        height: 120,
        style: { fontSize: "48px", fontWeight: "bold", color: "#ffffff" },
      },
      {
        id: "elem-3",
        type: "text",
        content: "Date",
        x: 100,
        y: 450,
        width: 200,
        height: 30,
        style: { fontSize: "18px", color: "#ffffff" },
      },
    ],
  },
];

const initialState: PresentationState = {
  title: "Project Presentation",
  slides: defaultSlides,
  selectedSlideId: defaultSlides[0].id,
  selectedTemplate: defaultTemplates[0],
  masterElements: defaultMasterElements,
  masterSlideSettings: defaultMasterSettings,
};

export const presentationSlice = createSlice({
  name: 'presentation',
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setSlides: (state, action: PayloadAction<Slide[]>) => {
      state.slides = action.payload;
    },
    addSlide: (state, action: PayloadAction<Slide>) => {
      state.slides.push(action.payload);
      state.selectedSlideId = action.payload.id;
    },
    updateSlide: (state, action: PayloadAction<Slide>) => {
      const index = state.slides.findIndex(slide => slide.id === action.payload.id);
      if (index !== -1) {
        state.slides[index] = action.payload;
      }
    },
    deleteSlide: (state, action: PayloadAction<string>) => {
      state.slides = state.slides.filter(slide => slide.id !== action.payload);
      if (state.selectedSlideId === action.payload && state.slides.length > 0) {
        state.selectedSlideId = state.slides[0].id;
      }
    },
    setSelectedSlideId: (state, action: PayloadAction<string>) => {
      state.selectedSlideId = action.payload;
    },
    setTemplate: (state, action: PayloadAction<Template>) => {
      state.selectedTemplate = action.payload;
      state.slides = state.slides.map(slide => ({
        ...slide,
        template: action.payload.id
      }));
    },
    updateSlideBackground: (state, action: PayloadAction<{slideId: string, background: string}>) => {
      const index = state.slides.findIndex(slide => slide.id === action.payload.slideId);
      if (index !== -1) {
        state.slides[index].customBackground = action.payload.background;
      }
    },
    // New actions for master slide
    updateMasterElements: (state, action: PayloadAction<SlideElement[]>) => {
      state.masterElements = action.payload;
    },
    updateMasterSettings: (state, action: PayloadAction<Partial<MasterSlideSettings>>) => {
      state.masterSlideSettings = {
        ...state.masterSlideSettings,
        ...action.payload
      };
    },
    addMasterElement: (state, action: PayloadAction<SlideElement>) => {
      state.masterElements.push(action.payload);
    },
    updateMasterElement: (state, action: PayloadAction<SlideElement>) => {
      const index = state.masterElements.findIndex(element => element.id === action.payload.id);
      if (index !== -1) {
        state.masterElements[index] = action.payload;
      }
    },
    deleteMasterElement: (state, action: PayloadAction<string>) => {
      state.masterElements = state.masterElements.filter(element => element.id !== action.payload);
    },
    toggleApplyMaster: (state, action: PayloadAction<{slideId: string, apply: boolean}>) => {
      const index = state.slides.findIndex(slide => slide.id === action.payload.slideId);
      if (index !== -1) {
        state.slides[index].applyMaster = action.payload.apply;
      }
    },
    createFromRfp: (state, action: PayloadAction<{
      projectName: string;
      projectDescription: string;
      clientInfo: string;
      requirements: Array<{description: string}>;
    }>) => {
      const { projectName, projectDescription, clientInfo, requirements } = action.payload;
      
      // Update title slide
      if (state.slides.length > 0) {
        const titleSlide = state.slides[0];
        const clientNameElement = titleSlide.elements.find(e => e.id === "elem-1");
        const titleElement = titleSlide.elements.find(e => e.id === "elem-2");
        
        if (clientNameElement) {
          clientNameElement.content = clientInfo || "Company | Client";
        }
        
        if (titleElement) {
          titleElement.content = projectName || "Project Presentation";
        }
        
        state.title = projectName || "Project Presentation";
      }
      
      // Add a summary slide
      const summarySlide: Slide = {
        id: `slide-${Date.now()}-summary`,
        title: "Project Summary",
        content: projectDescription,
        type: "content",
        template: state.selectedTemplate.id,
        elements: [
          {
            id: `elem-${Date.now()}-title`,
            type: "text",
            content: "Project Summary",
            x: 50,
            y: 50,
            width: 500,
            height: 60,
            style: { fontSize: "32px", fontWeight: "bold", color: "#333333" },
          },
          {
            id: `elem-${Date.now()}-description`,
            type: "text",
            content: projectDescription,
            x: 50,
            y: 120,
            width: 700,
            height: 200,
            style: { fontSize: "18px", color: "#333333" },
          }
        ],
      };
      
      // Add requirements slide
      const requirementsSlide: Slide = {
        id: `slide-${Date.now()}-requirements`,
        title: "Requirements",
        content: "Key Requirements",
        type: "content",
        template: state.selectedTemplate.id,
        elements: [
          {
            id: `elem-${Date.now()}-title`,
            type: "text",
            content: "Key Requirements",
            x: 50,
            y: 50,
            width: 500,
            height: 60,
            style: { fontSize: "32px", fontWeight: "bold", color: "#333333" },
          },
          ...requirements.slice(0, 5).map((req, index) => ({
            id: `elem-${Date.now()}-req-${index}`,
            type: "text" as const,
            content: `• ${req.description}`,
            x: 50,
            y: 120 + (index * 60),
            width: 700,
            height: 50,
            style: { fontSize: "18px", color: "#333333" },
          })),
        ],
      };
      
      state.slides = [...state.slides, summarySlide, requirementsSlide];
    },
  },
});

export const {
  setTitle,
  setSlides,
  addSlide,
  updateSlide,
  deleteSlide,
  setSelectedSlideId,
  setTemplate,
  updateSlideBackground,
  updateMasterElements,
  updateMasterSettings,
  addMasterElement,
  updateMasterElement,
  deleteMasterElement,
  toggleApplyMaster,
  createFromRfp
} = presentationSlice.actions;

export default presentationSlice.reducer;
