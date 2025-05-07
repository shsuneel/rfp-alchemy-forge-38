
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SlideElement {
  id: string;
  type: "text" | "image" | "shape" | "diagram";
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style?: Record<string, string>;
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
}

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

interface PresentationState {
  title: string;
  slides: Slide[];
  selectedSlideId: string;
  selectedTemplate: Template;
}

const defaultTemplates: Template[] = [
  {
    id: "corporate",
    name: "Corporate Blue",
    thumbnail: "/lovable-uploads/def60ec4-37af-47fd-b27a-ed307e1a96c3.png",
    primaryColor: "#002060",
    secondaryColor: "#0078D4",
    accentColor: "#00B0F0",
  },
  {
    id: "modern",
    name: "Modern Purple",
    thumbnail: "/placeholder.svg",
    primaryColor: "#7030A0",
    secondaryColor: "#9b87f5",
    accentColor: "#C5A5CF",
  },
  {
    id: "minimalist",
    name: "Minimalist White",
    thumbnail: "/placeholder.svg",
    primaryColor: "#FFFFFF",
    secondaryColor: "#F2F2F2",
    accentColor: "#D9D9D9",
  },
];

const defaultSlides: Slide[] = [
  {
    id: "slide-1",
    title: "Title Slide",
    content: "Project Presentation",
    type: "title",
    template: "corporate",
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
  createFromRfp
} = presentationSlice.actions;

export default presentationSlice.reducer;
