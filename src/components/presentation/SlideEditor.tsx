
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Image, Square, FileText, Trash2, PlusSquare } from "lucide-react";
import { Slide, SlideElement, Template } from "@/store/presentationSlice";
import SlidePreview from "./SlidePreview";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

interface SlideEditorProps {
  slide: Slide;
  template: Template;
  onUpdate: (slide: Slide) => void;
  onDelete: (id: string) => void;
}

const SlideEditor: React.FC<SlideEditorProps> = ({
  slide,
  template,
  onUpdate,
  onDelete
}) => {
  const [selectedElement, setSelectedElement] = useState<SlideElement | null>(
    slide.elements.length > 0 ? slide.elements[0] : null
  );
  const [isMasterSlide, setIsMasterSlide] = useState(slide.type === "master");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...slide,
      title: e.target.value
    });
  };

  const addElement = (type: SlideElement["type"]) => {
    const newElement: SlideElement = {
      id: `elem-${Date.now()}`,
      type,
      content: type === "text" ? "New text" : "/placeholder.svg",
      x: 100,
      y: 100,
      width: type === "text" ? 300 : 400,
      height: type === "text" ? 100 : 300,
      style: {}
    };
    
    const updatedSlide = {
      ...slide,
      elements: [...slide.elements, newElement]
    };
    
    onUpdate(updatedSlide);
    setSelectedElement(newElement);
    toast.success(`Added new ${type} element`);
  };

  const updateElement = (updatedElement: SlideElement) => {
    const updatedElements = slide.elements.map(element => 
      element.id === updatedElement.id ? updatedElement : element
    );
    
    onUpdate({
      ...slide,
      elements: updatedElements
    });
    
    setSelectedElement(updatedElement);
  };

  const deleteElement = (id: string) => {
    const updatedElements = slide.elements.filter(element => element.id !== id);
    
    onUpdate({
      ...slide,
      elements: updatedElements
    });
    
    setSelectedElement(updatedElements[0] || null);
    toast.success("Element deleted");
  };

  const handleMasterSlideChange = (checked: boolean) => {
    setIsMasterSlide(checked);
    onUpdate({
      ...slide,
      type: checked ? "master" : "content"
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real application, this would upload to a server
    // Here we're creating a temporary URL
    const imageUrl = URL.createObjectURL(file);
    
    if (selectedElement && selectedElement.type === "image") {
      updateElement({
        ...selectedElement,
        content: imageUrl
      });
      toast.success("Image updated");
    }
  };

  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real application, this would upload to a server
    // Here we're creating a temporary URL
    const imageUrl = URL.createObjectURL(file);
    
    onUpdate({
      ...slide,
      customBackground: imageUrl
    });
    
    toast.success("Background image updated");
  };

  const handleDiagramImport = () => {
    // In a real app, this would integrate with external services like draw.io
    const diagramUrl = "/placeholder.svg";
    
    if (selectedElement && selectedElement.type === "diagram") {
      updateElement({
        ...selectedElement,
        content: diagramUrl
      });
      toast.success("Diagram updated");
    }
  };

  const removeBackgroundImage = () => {
    onUpdate({
      ...slide,
      customBackground: undefined
    });
    toast.success("Background image removed");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between mb-4">
        <div className="flex-1 mr-4">
          <Input
            value={slide.title}
            onChange={handleTitleChange}
            placeholder="Slide Title"
            className="font-semibold"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="master-slide"
              checked={isMasterSlide}
              onCheckedChange={handleMasterSlideChange}
            />
            <Label htmlFor="master-slide">Master Slide</Label>
          </div>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(slide.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" /> Delete Slide
          </Button>
        </div>
      </div>
      
      <div className="flex gap-4 flex-1">
        <div className="flex-1 flex justify-center items-start overflow-auto p-4 bg-muted/30 rounded-lg">
          <SlidePreview
            slide={slide}
            template={template}
            scale={0.75}
          />
        </div>
        
        <div className="w-[300px] border-l pl-4">
          <Tabs defaultValue="elements">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="elements" className="flex-1">Elements</TabsTrigger>
              <TabsTrigger value="style" className="flex-1">Style</TabsTrigger>
              <TabsTrigger value="background" className="flex-1">Background</TabsTrigger>
            </TabsList>
            
            <TabsContent value="elements">
              <div className="flex gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => addElement("text")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Add Text
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => addElement("image")}
                >
                  <Image className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => addElement("shape")}
                >
                  <Square className="h-4 w-4 mr-2" />
                  Add Shape
                </Button>
              </div>
              
              <div className="space-y-1 mb-4">
                <Label>Slide Elements</Label>
                {slide.elements.length > 0 ? (
                  <div className="max-h-[200px] overflow-y-auto border rounded-md">
                    {slide.elements.map((element, index) => (
                      <div
                        key={element.id}
                        className={`p-2 flex justify-between items-center cursor-pointer text-sm border-b last:border-b-0 ${
                          selectedElement?.id === element.id ? "bg-accent" : ""
                        }`}
                        onClick={() => setSelectedElement(element)}
                      >
                        <div className="flex items-center">
                          {element.type === "text" && <FileText className="h-3 w-3 mr-2" />}
                          {element.type === "image" && <Image className="h-3 w-3 mr-2" />}
                          {element.type === "shape" && <Square className="h-3 w-3 mr-2" />}
                          
                          <span className="truncate w-40">
                            {element.type === "text" 
                              ? (element.content.length > 20 
                                ? element.content.substring(0, 20) + "..." 
                                : element.content) 
                              : `${element.type} ${index + 1}`}
                          </span>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteElement(element.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No elements added yet
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="style">
              {selectedElement && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Element Type</Label>
                    <div className="text-sm font-medium capitalize">
                      {selectedElement.type}
                    </div>
                  </div>
                  
                  {selectedElement.type === "text" && (
                    <div className="space-y-2">
                      <Label>Text Content</Label>
                      <Textarea
                        value={selectedElement.content}
                        onChange={(e) => updateElement({
                          ...selectedElement,
                          content: e.target.value
                        })}
                        rows={3}
                      />
                    </div>
                  )}
                  
                  {selectedElement.type === "image" && (
                    <div className="space-y-2">
                      <Label>Image</Label>
                      <div className="border rounded-md p-2 space-y-2">
                        <div className="aspect-video bg-muted flex items-center justify-center mb-2">
                          <img
                            src={selectedElement.content}
                            alt="Element preview"
                            className="max-h-full object-contain"
                          />
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>
                  )}
                  
                  {selectedElement.type === "diagram" && (
                    <div className="space-y-2">
                      <Label>Diagram</Label>
                      <div className="border rounded-md p-2 space-y-2">
                        <div className="aspect-video bg-muted flex items-center justify-center mb-2">
                          <img
                            src={selectedElement.content}
                            alt="Diagram preview"
                            className="max-h-full object-contain"
                          />
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full">
                              Import Diagram
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Import Diagram</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">
                                Import diagrams from external tools like draw.io or PlantUML.
                              </p>
                              <Button onClick={handleDiagramImport} className="w-full">
                                Import Diagram
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">X Position</Label>
                      <Input
                        type="number"
                        value={selectedElement.x}
                        onChange={(e) => updateElement({
                          ...selectedElement,
                          x: Number(e.target.value)
                        })}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs">Y Position</Label>
                      <Input
                        type="number"
                        value={selectedElement.y}
                        onChange={(e) => updateElement({
                          ...selectedElement,
                          y: Number(e.target.value)
                        })}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs">Width</Label>
                      <Input
                        type="number"
                        value={selectedElement.width}
                        onChange={(e) => updateElement({
                          ...selectedElement,
                          width: Number(e.target.value)
                        })}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs">Height</Label>
                      <Input
                        type="number"
                        value={selectedElement.height}
                        onChange={(e) => updateElement({
                          ...selectedElement,
                          height: Number(e.target.value)
                        })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="background">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Slide Background</Label>
                  {slide.customBackground ? (
                    <div className="border rounded-md p-2 space-y-2">
                      <div className="aspect-video bg-muted flex items-center justify-center mb-2">
                        <img
                          src={slide.customBackground}
                          alt="Background preview"
                          className="max-h-full object-cover w-full"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={removeBackgroundImage}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1" 
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";
                            input.onchange = (e) => handleBackgroundImageUpload(e as any);
                            input.click();
                          }}
                        >
                          <PlusSquare className="h-4 w-4 mr-1" /> Change
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-md p-4 space-y-2">
                      <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground">
                        No custom background
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleBackgroundImageUpload}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Template Color</Label>
                  <div 
                    className="h-10 rounded-md"
                    style={{ backgroundColor: template.primaryColor }}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SlideEditor;
