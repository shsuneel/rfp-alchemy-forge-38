
import React from "react";
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

  const addNewSlide = (type: Slide["type"] = "content") => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      title: `Slide ${slides.length + 1}`,
      content: "",
      type,
      template: selectedTemplate.id,
      elements: [],
    };
    
    dispatch(addSlide(newSlide));
    toast.success("New slide added");
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
                  onClick={() => dispatch(setSelectedSlideId(slide.id))}
                >
                  <CardContent className="p-2">
                    <div className="text-xs font-medium truncate">{slide.title}</div>
                    <div 
                      className="mt-2 aspect-video bg-muted flex items-center justify-center text-xs text-muted-foreground"
                      style={{
                        backgroundColor: selectedTemplate.primaryColor
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
                template={selectedTemplate} 
                onUpdate={handleUpdateSlide}
                onDelete={handleDeleteSlide}
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="templates">
          <TemplateSelector 
            templates={[selectedTemplate, selectedTemplate, selectedTemplate, selectedTemplate, selectedTemplate]} 
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
