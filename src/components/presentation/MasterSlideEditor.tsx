
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Image, FileText, Trash2, PlusSquare, Calendar, Copyright, Circle, Square, Text } from "lucide-react";
import { SlideElement, Template, MasterSlideSettings } from "@/store/presentationSlice";
import SlidePreview from "./SlidePreview";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MasterSlideEditorProps {
  masterElements: SlideElement[];
  masterSettings: MasterSlideSettings;
  template: Template;
  onUpdateElements: (elements: SlideElement[]) => void;
  onUpdateSettings: (settings: Partial<MasterSlideSettings>) => void;
  onAddElement: (element: SlideElement) => void;
  onUpdateElement: (element: SlideElement) => void;
  onDeleteElement: (id: string) => void;
}

const MasterSlideEditor: React.FC<MasterSlideEditorProps> = ({
  masterElements,
  masterSettings,
  template,
  onUpdateElements,
  onUpdateSettings,
  onAddElement,
  onUpdateElement,
  onDeleteElement
}) => {
  const [selectedElement, setSelectedElement] = useState<SlideElement | null>(
    masterElements.length > 0 ? masterElements[0] : null
  );
  const [customBackground, setCustomBackground] = useState<string | undefined>(undefined);

  const handleElementChange = (updatedElement: SlideElement) => {
    onUpdateElement(updatedElement);
    setSelectedElement(updatedElement);
  };

  const addNewElement = (type: SlideElement["type"], role?: SlideElement["role"]) => {
    const newElement: SlideElement = {
      id: `master-${type}-${Date.now()}`,
      type,
      content: type === "text" ? "New Text" : "/placeholder.svg",
      x: 100,
      y: 100,
      width: type === "text" ? 300 : 200,
      height: type === "text" ? 50 : 200,
      isGlobal: true,
      role,
      style: {
        fontSize: "16px",
        color: "#333333"
      }
    };

    if (type === "shape") {
      newElement.style = {
        ...newElement.style,
        backgroundColor: template.accentColor,
        borderRadius: "0"
      };
    }

    if (role === "footer") {
      newElement.y = 500;
      newElement.x = 0;
      newElement.width = 960;
      newElement.height = 40;
      newElement.style = {
        ...newElement.style,
        backgroundColor: "rgba(0,0,0,0.1)",
        padding: "8px"
      };
    }

    if (role === "copyright") {
      newElement.content = masterSettings.copyrightText;
      newElement.y = 510;
      newElement.x = 700;
    }

    if (role === "date") {
      newElement.content = new Date().toLocaleDateString();
      newElement.y = 510;
      newElement.x = 50;
    }

    onAddElement(newElement);
    setSelectedElement(newElement);
    toast.success(`Added new ${type} element`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real application, this would upload to a server
    // Here we're creating a temporary URL
    const imageUrl = URL.createObjectURL(file);
    
    if (selectedElement && (selectedElement.type === "image" || selectedElement.type === "logo")) {
      handleElementChange({
        ...selectedElement,
        content: imageUrl
      });
      toast.success("Image updated");
    }
  };

  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const imageUrl = URL.createObjectURL(file);
    setCustomBackground(imageUrl);
    toast.success("Background image updated");
  };

  const handleColorChange = (color: string, property: string) => {
    if (selectedElement) {
      handleElementChange({
        ...selectedElement,
        style: {
          ...selectedElement.style,
          [property]: color
        }
      });
    }
  };

  const handleFontSizeChange = (value: number[]) => {
    if (selectedElement && selectedElement.type === "text") {
      handleElementChange({
        ...selectedElement,
        style: {
          ...selectedElement.style,
          fontSize: `${value[0]}px`
        }
      });
    }
  };

  // Create a mock slide for preview that includes the master elements
  const previewSlide = {
    id: "master-preview",
    title: "Master Slide Preview",
    content: "Master Slide",
    type: "master" as const,
    template: template.id,
    customBackground,
    elements: masterElements,
  };

  const handleSettingsChange = (key: keyof MasterSlideSettings, value: any) => {
    onUpdateSettings({ [key]: value });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between mb-4">
        <div className="flex-1 mr-4">
          <h2 className="text-xl font-semibold">Master Slide Template</h2>
          <p className="text-sm text-muted-foreground">
            Configure the master slide that will be applied to all presentation slides
          </p>
        </div>
      </div>
      
      <div className="flex gap-4 flex-1">
        <div className="flex-1 flex justify-center items-start overflow-auto p-4 bg-muted/30 rounded-lg">
          <SlidePreview
            slide={previewSlide}
            template={template}
            scale={0.75}
          />
        </div>
        
        <div className="w-[300px] border-l pl-4">
          <Tabs defaultValue="elements">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="elements" className="flex-1">Elements</TabsTrigger>
              <TabsTrigger value="style" className="flex-1">Style</TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="elements">
              <div className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <PlusSquare className="h-4 w-4 mr-2" />
                        Add Element
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => addNewElement("text")}>
                        <Text className="h-4 w-4 mr-2" />
                        Text
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addNewElement("image")}>
                        <Image className="h-4 w-4 mr-2" />
                        Image
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addNewElement("shape")}>
                        <Square className="h-4 w-4 mr-2" />
                        Shape
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addNewElement("logo")}>
                        <Image className="h-4 w-4 mr-2" />
                        Logo
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Footer Elements
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => addNewElement("footer", "footer")}>
                        <Square className="h-4 w-4 mr-2" />
                        Footer Container
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addNewElement("text", "date")}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Date
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addNewElement("text", "copyright")}>
                        <Copyright className="h-4 w-4 mr-2" />
                        Copyright
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addNewElement("text", "pageNumber")}>
                        <Text className="h-4 w-4 mr-2" />
                        Page Number
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-1 mb-4">
                  <Label>Master Elements</Label>
                  <div className="max-h-[200px] overflow-y-auto border rounded-md">
                    {masterElements.map((element, index) => (
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
                          {(element.type === "shape" || element.type === "footer") && <Square className="h-3 w-3 mr-2" />}
                          {element.type === "logo" && <Image className="h-3 w-3 mr-2" />}
                          
                          <span className="truncate w-40">
                            {element.role ? `${element.role} (${element.type})` : 
                              (element.type === "text" 
                                ? (element.content.length > 20 
                                  ? element.content.substring(0, 20) + "..." 
                                  : element.content) 
                                : `${element.type} ${index + 1}`)}
                          </span>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteElement(element.id);
                            if (selectedElement?.id === element.id) {
                              setSelectedElement(masterElements.length > 1 ? 
                                masterElements.find(e => e.id !== element.id) || null : null);
                            }
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="style">
              {selectedElement ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Element Type</Label>
                    <div className="text-sm font-medium capitalize">
                      {selectedElement.type} {selectedElement.role ? `(${selectedElement.role})` : ""}
                    </div>
                  </div>
                  
                  {selectedElement.type === "text" && (
                    <div className="space-y-2">
                      <Label>Text Content</Label>
                      <Textarea
                        value={selectedElement.content}
                        onChange={(e) => handleElementChange({
                          ...selectedElement,
                          content: e.target.value
                        })}
                        rows={3}
                      />
                      
                      <div className="space-y-2 pt-2">
                        <Label className="text-sm">Font Size: {selectedElement.style?.fontSize || "16px"}</Label>
                        <Slider 
                          defaultValue={[parseInt(selectedElement.style?.fontSize || "16")]} 
                          max={72} 
                          step={1} 
                          min={8}
                          onValueChange={handleFontSizeChange}
                        />
                      </div>
                      
                      <div className="space-y-2 pt-2">
                        <Label className="text-sm">Text Color</Label>
                        <div className="grid grid-cols-6 gap-2">
                          {["#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff", template.primaryColor, 
                            template.secondaryColor, template.accentColor, "#333333", "#666666", "#999999", "#cccccc"].map(color => (
                            <div 
                              key={color}
                              className={`w-full aspect-square rounded-md cursor-pointer border ${
                                selectedElement.style?.color === color ? "ring-2 ring-primary" : ""
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => handleColorChange(color, "color")}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {(selectedElement.type === "image" || selectedElement.type === "logo") && (
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
                  
                  {selectedElement.type === "shape" && (
                    <div className="space-y-2 pt-2">
                      <Label className="text-sm">Shape Color</Label>
                      <div className="grid grid-cols-6 gap-2">
                        {["#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff", template.primaryColor, 
                          template.secondaryColor, template.accentColor, "#333333", "#666666", "#999999", "#cccccc"].map(color => (
                          <div 
                            key={color}
                            className={`w-full aspect-square rounded-md cursor-pointer border ${
                              selectedElement.style?.backgroundColor === color ? "ring-2 ring-primary" : ""
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorChange(color, "backgroundColor")}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">X Position</Label>
                      <Input
                        type="number"
                        value={selectedElement.x}
                        onChange={(e) => handleElementChange({
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
                        onChange={(e) => handleElementChange({
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
                        onChange={(e) => handleElementChange({
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
                        onChange={(e) => handleElementChange({
                          ...selectedElement,
                          height: Number(e.target.value)
                        })}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  Select an element to edit its style
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Background</Label>
                  <div className="border rounded-md p-2 space-y-2">
                    <div className="aspect-video bg-muted flex items-center justify-center mb-2"
                         style={{ 
                           backgroundColor: template.primaryColor,
                           backgroundImage: customBackground ? `url(${customBackground})` : undefined,
                           backgroundSize: "cover",
                           backgroundPosition: "center"
                         }}>
                      {!customBackground && "Template Background"}
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundImageUpload}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Footer Settings</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="show-footer"
                        checked={masterSettings.showFooter}
                        onCheckedChange={(checked) => 
                          handleSettingsChange("showFooter", !!checked)
                        }
                      />
                      <Label htmlFor="show-footer">Show Footer on All Slides</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="show-date"
                        checked={masterSettings.showDate}
                        onCheckedChange={(checked) => 
                          handleSettingsChange("showDate", !!checked)
                        }
                      />
                      <Label htmlFor="show-date">Show Date</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="show-page-number"
                        checked={masterSettings.showPageNumber}
                        onCheckedChange={(checked) => 
                          handleSettingsChange("showPageNumber", !!checked)
                        }
                      />
                      <Label htmlFor="show-page-number">Show Page Numbers</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="show-copyright"
                        checked={masterSettings.showCopyright}
                        onCheckedChange={(checked) => 
                          handleSettingsChange("showCopyright", !!checked)
                        }
                      />
                      <Label htmlFor="show-copyright">Show Copyright</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Copyright Text</Label>
                  <Input 
                    value={masterSettings.copyrightText} 
                    onChange={(e) => handleSettingsChange("copyrightText", e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Custom Footer Text</Label>
                  <Input 
                    value={masterSettings.customFooterText} 
                    onChange={(e) => handleSettingsChange("customFooterText", e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Title Position</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">X Position</Label>
                      <Input
                        type="number"
                        value={masterSettings.titlePosition.x}
                        onChange={(e) => handleSettingsChange("titlePosition", {
                          ...masterSettings.titlePosition,
                          x: Number(e.target.value)
                        })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Y Position</Label>
                      <Input
                        type="number"
                        value={masterSettings.titlePosition.y}
                        onChange={(e) => handleSettingsChange("titlePosition", {
                          ...masterSettings.titlePosition,
                          y: Number(e.target.value)
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MasterSlideEditor;
