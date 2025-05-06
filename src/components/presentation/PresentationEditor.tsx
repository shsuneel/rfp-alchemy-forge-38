
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Presentation, Image, Layout, Square, SquareDashed } from "lucide-react";
import { toast } from "sonner";
import SlidePreview from "./SlidePreview";
import TemplateSelector from "./TemplateSelector";
import SlideEditor from "./SlideEditor";
import DiagramIntegration from "./DiagramIntegration";

export type Slide = {
  id: string;
  title: string;
  content: string;
  type: "title" | "content" | "image" | "diagram" | "master";
  template: string;
  background?: string;
  elements: SlideElement[];
};

export type SlideElement = {
  id: string;
  type: "text" | "image" | "shape" | "diagram";
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style?: Record<string, string>;
};

export type Template = {
  id: string;
  name: string;
  thumbnail: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
};

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
    content: "My Company Response to Client",
    type: "title",
    template: "corporate",
    elements: [
      {
        id: "elem-1",
        type: "text",
        content: "My Company | Client Company",
        x: 50,
        y: 50,
        width: 500,
        height: 50,
        style: { fontSize: "24px", color: "#333333" },
      },
      {
        id: "elem-2",
        type: "text",
        content: "My Company Response to Client",
        x: 100,
        y: 200,
        width: 400,
        height: 120,
        style: { fontSize: "48px", fontWeight: "bold", color: "#ffffff" },
      },
      {
        id: "elem-3",
        type: "text",
        content: "9th May 2025",
        x: 100,
        y: 450,
        width: 200,
        height: 30,
        style: { fontSize: "18px", color: "#ffffff" },
      },
      {
        id: "elem-4",
        type: "image",
        content: "/lovable-uploads/def60ec4-37af-47fd-b27a-ed307e1a96c3.png",
        x: 550,
        y: 180,
        width: 550,
        height: 350,
      },
    ],
  },
];

const PresentationEditor: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [selectedSlideId, setSelectedSlideId] = useState<string>(slides[0]?.id || "");
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(defaultTemplates[0]);
  const [presentationTitle, setPresentationTitle] = useState<string>("RFP Response Presentation");

  const addNewSlide = (type: Slide["type"] = "content") => {
    const newSlide: Slide = {
      id: `slide-${slides.length + 1}`,
      title: `Slide ${slides.length + 1}`,
      content: "",
      type,
      template: selectedTemplate.id,
      elements: [],
    };
    
    setSlides([...slides, newSlide]);
    setSelectedSlideId(newSlide.id);
    toast.success("New slide added");
  };

  const deleteSlide = (id: string) => {
    if (slides.length <= 1) {
      toast.error("Cannot delete the last slide");
      return;
    }
    
    const newSlides = slides.filter(slide => slide.id !== id);
    setSlides(newSlides);
    
    if (selectedSlideId === id) {
      setSelectedSlideId(newSlides[0].id);
    }
    
    toast.success("Slide deleted");
  };

  const updateSlide = (updatedSlide: Slide) => {
    setSlides(slides.map(slide => 
      slide.id === updatedSlide.id ? updatedSlide : slide
    ));
  };

  const changeTemplate = (template: Template) => {
    setSelectedTemplate(template);
    // Update all slides to use the new template
    setSlides(slides.map(slide => ({
      ...slide,
      template: template.id
    })));
    toast.success(`Template changed to ${template.name}`);
  };

  const selectedSlide = slides.find(slide => slide.id === selectedSlideId) || slides[0];

  return (
    <div className="flex flex-col h-full">
      <div className="border-b pb-4 mb-4">
        <div className="flex justify-between items-center">
          <Input
            value={presentationTitle}
            onChange={(e) => setPresentationTitle(e.target.value)}
            className="text-xl font-bold border-none focus-visible:ring-0 w-1/2"
          />
          <div className="space-x-2">
            <Button variant="outline" onClick={() => toast.success("Presentation saved")}>
              Save
            </Button>
            <Button onClick={() => toast.success("Presentation exported as PDF")}>
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="editor" className="flex-1 flex flex-col">
        <TabsList className="mb-4">
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <SquareDashed className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="diagrams" className="flex items-center gap-2">
            <Square className="h-4 w-4" />
            Diagrams
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="flex-1 flex gap-4">
          <div className="w-[200px] border-r pr-4 space-y-4">
            <Button 
              onClick={() => addNewSlide("content")} 
              className="w-full" 
              variant="outline"
            >
              Add Slide
            </Button>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {slides.map((slide) => (
                <Card 
                  key={slide.id}
                  className={`cursor-pointer overflow-hidden ${selectedSlideId === slide.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedSlideId(slide.id)}
                >
                  <CardContent className="p-2">
                    <div className="text-xs font-medium truncate">{slide.title}</div>
                    <div 
                      className="mt-2 aspect-video bg-muted flex items-center justify-center text-xs text-muted-foreground"
                      style={{
                        backgroundColor: defaultTemplates.find(t => t.id === slide.template)?.primaryColor
                      }}
                    >
                      Slide {slides.indexOf(slide) + 1}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="flex-1">
            {selectedSlide && (
              <SlideEditor 
                slide={selectedSlide} 
                template={defaultTemplates.find(t => t.id === selectedSlide.template) || defaultTemplates[0]} 
                onUpdate={updateSlide}
                onDelete={deleteSlide}
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="templates">
          <TemplateSelector 
            templates={defaultTemplates} 
            selectedTemplate={selectedTemplate} 
            onSelectTemplate={changeTemplate}
          />
        </TabsContent>
        
        <TabsContent value="diagrams">
          <DiagramIntegration 
            onDiagramSelected={(diagramUrl) => {
              addNewSlide("diagram");
              const newSlide = {...slides[slides.length - 1]};
              newSlide.elements.push({
                id: `elem-${Date.now()}`,
                type: "diagram",
                content: diagramUrl,
                x: 50,
                y: 100,
                width: 700,
                height: 400,
              });
              updateSlide(newSlide);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PresentationEditor;
