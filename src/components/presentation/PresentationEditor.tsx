import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Presentation, Image, Layout, Square, SquareDashed, Plus } from "lucide-react";
import { toast } from "sonner";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SlidePreview from "./SlidePreview";
import TemplateSelector from "./TemplateSelector";
import SlideEditor from "./SlideEditor";
import DiagramIntegration from "./DiagramIntegration";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  setTitle,
  addSlide,
  updateSlide,
  deleteSlide,
  setSelectedSlideId,
  setTemplate,
  Slide,
  SlideElement,
  Template
} from "@/store/presentationSlice";

const PresentationEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    title,
    slides,
    selectedSlideId,
    selectedTemplate
  } = useAppSelector(state => state.presentation);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitle(e.target.value));
  };

  // Get all available templates from the store
  const allTemplates = [
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
    {
      id: "agenda",
      name: "Agenda Template",
      thumbnail: "/lovable-uploads/7d958b51-2c47-49c4-ad1c-03bcf81b4262.png",
      primaryColor: "#1E293B",
      secondaryColor: "#00B0F0",
      accentColor: "#FFFFFF",
    },
    {
      id: "understanding",
      name: "Understanding Template",
      thumbnail: "/lovable-uploads/f9b25e6f-fbcf-4ead-b44f-cd069f221d2d.png",
      primaryColor: "#1E293B",
      secondaryColor: "#00B0F0",
      accentColor: "#002060",
    },
    {
      id: "blank",
      name: "Blank Template",
      thumbnail: "/lovable-uploads/919105d7-797a-4abc-8b18-b7a547e61870.png",
      primaryColor: "#1E293B",
      secondaryColor: "#00B0F0",
      accentColor: "#002060",
    }
  ];

  const addNewSlide = (type: Slide["type"] = "content") => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Slide`,
      content: "",
      type,
      template: selectedTemplate.id,
      elements: [],
    };
    
    // Add default elements based on slide type
    if (type === "section") {
      if (selectedTemplate.id === "agenda") {
        // Create agenda slide with numbered items
        newSlide.elements.push(
          {
            id: `agenda-item-1`,
            type: "text",
            content: "Our Understanding",
            x: 600,
            y: 200,
            width: 300,
            height: 40,
            style: { fontSize: "20px", color: "#ffffff" }
          },
          {
            id: `agenda-item-2`,
            type: "text",
            content: "Overall Process & Approach",
            x: 600,
            y: 270,
            width: 300,
            height: 40,
            style: { fontSize: "20px", color: "#ffffff" }
          },
          {
            id: `agenda-item-3`,
            type: "text",
            content: "Technical Architecture",
            x: 600,
            y: 340,
            width: 300,
            height: 40,
            style: { fontSize: "20px", color: "#ffffff" }
          },
          {
            id: `agenda-item-4`,
            type: "text",
            content: "Implementation Plan",
            x: 600,
            y: 410,
            width: 300,
            height: 40,
            style: { fontSize: "20px", color: "#ffffff" }
          }
        );
      } else if (selectedTemplate.id === "understanding") {
        newSlide.elements.push({
          id: `elem-${Date.now()}-title`,
          type: "text",
          content: "Understanding of Ask",
          x: 100,
          y: 300,
          width: 300,
          height: 60,
          style: { fontSize: "32px", fontWeight: "bold", color: "#ffffff" }
        });
      } else {
        newSlide.elements.push({
          id: `elem-${Date.now()}-title`,
          type: "text",
          content: "Section Title",
          x: 50,
          y: 240,
          width: 860,
          height: 80,
          style: { fontSize: "64px", fontWeight: "bold", color: "#ffffff", textAlign: "center" }
        });
      }
    } else if (type === "template") {
      newSlide.elements.push({
        id: `elem-${Date.now()}-layout`,
        type: "text",
        content: "Template Slide",
        x: 50,
        y: 50,
        width: 500,
        height: 50,
        style: { fontSize: "32px", fontWeight: "bold", color: "#333333" }
      });
    }
    
    dispatch(addSlide(newSlide));
    toast.success(`New ${type} slide added`);
  };

  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) {
      toast.error("Cannot delete the last slide");
      return;
    }
    dispatch(deleteSlide(id));
    toast.success("Slide deleted");
  };

  const handleUpdateSlide = (updatedSlide: Slide) => {
    dispatch(updateSlide(updatedSlide));
  };

  const handleChangeTemplate = (template: Template) => {
    dispatch(setTemplate(template));
    toast.success(`Template changed to ${template.name}`);
  };

  const selectedSlide = slides.find(slide => slide.id === selectedSlideId) || slides[0];

  return (
    <div className="flex flex-col h-full">
      <div className="border-b pb-4 mb-4">
        <div className="flex justify-between items-center">
          <Input
            value={title}
            onChange={handleTitleChange}
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
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <SquareDashed className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="diagrams" className="flex items-center gap-2">
            <Square className="h-4 w-4" />
            Diagrams
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="flex-1 flex gap-4">
          <div className="w-[200px] border-r pr-4 space-y-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Slide
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => addNewSlide("content")}>
                  Content Slide
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewSlide("section")}>
                  Section Slide
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewSlide("template")}>
                  Template Slide
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewSlide("image")}>
                  Image Slide
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {slides.map((slide) => (
                <Card 
                  key={slide.id}
                  className={`cursor-pointer overflow-hidden ${selectedSlideId === slide.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => dispatch(setSelectedSlideId(slide.id))}
                >
                  <CardContent className="p-2">
                    <div className="flex justify-between items-center">
                      <div className="text-xs font-medium truncate">{slide.title}</div>
                      <div className="text-[10px] text-muted-foreground capitalize">{slide.type}</div>
                    </div>
                    <div 
                      className="mt-2 aspect-video bg-muted flex items-center justify-center text-xs text-muted-foreground"
                      style={{
                        backgroundColor: selectedTemplate.primaryColor,
                        backgroundImage: slide.customBackground ? `url(${slide.customBackground})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {!slide.customBackground && `Slide ${slides.indexOf(slide) + 1}`}
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
                template={selectedTemplate} 
                onUpdate={handleUpdateSlide}
                onDelete={handleDeleteSlide}
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="templates">
          <TemplateSelector 
            templates={allTemplates} 
            selectedTemplate={selectedTemplate} 
            onSelectTemplate={handleChangeTemplate}
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
              handleUpdateSlide(newSlide);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PresentationEditor;
