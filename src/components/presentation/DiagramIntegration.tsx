
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface DiagramIntegrationProps {
  onDiagramSelected: (diagramUrl: string) => void;
}

const DiagramIntegration: React.FC<DiagramIntegrationProps> = ({
  onDiagramSelected,
}) => {
  const [plantUmlCode, setPlantUmlCode] = useState<string>(
    "@startuml\nparticipant User\nparticipant System\nUser -> System: Request\nSystem --> User: Response\n@enduml"
  );
  const [diagramUrl, setDiagramUrl] = useState<string>("");
  const [uploadedDiagram, setUploadedDiagram] = useState<string | null>(null);
  
  const handlePlantUmlGenerate = () => {
    // In a real application, this would send the PlantUML code to a rendering service
    // For now, we'll just pretend to have generated a diagram
    toast.success("Diagram generated from PlantUML code");
    setDiagramUrl("/placeholder.svg");
  };
  
  const handleDiagramUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real application, this would upload the file to a server
    // For now, we'll create a temporary URL
    const fileUrl = URL.createObjectURL(file);
    setUploadedDiagram(fileUrl);
    toast.success("Diagram uploaded successfully");
  };
  
  const handleDiagramInsert = (imageUrl: string) => {
    onDiagramSelected(imageUrl);
    toast.success("Diagram inserted into presentation");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Diagram Integration</h2>
      
      <Tabs defaultValue="plantuml">
        <TabsList className="w-full">
          <TabsTrigger value="plantuml" className="flex-1">PlantUML</TabsTrigger>
          <TabsTrigger value="drawio" className="flex-1">Draw.io</TabsTrigger>
          <TabsTrigger value="upload" className="flex-1">Upload Diagram</TabsTrigger>
        </TabsList>
        
        <TabsContent value="plantuml" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Write PlantUML code to generate sequence diagrams, class diagrams, and more.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Textarea
                value={plantUmlCode}
                onChange={(e) => setPlantUmlCode(e.target.value)}
                rows={10}
                className="font-mono text-sm"
                placeholder="Enter PlantUML code here"
              />
              
              <Button 
                onClick={handlePlantUmlGenerate}
                className="mt-2"
              >
                Generate Diagram
              </Button>
            </div>
            
            <div className="flex-1 border rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">Preview</h3>
              {diagramUrl ? (
                <div className="space-y-2">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <img
                      src={diagramUrl}
                      alt="Generated diagram"
                      className="max-h-full object-contain"
                    />
                  </div>
                  <Button 
                    onClick={() => handleDiagramInsert(diagramUrl)}
                    variant="outline"
                    className="w-full"
                  >
                    Insert this diagram
                  </Button>
                </div>
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center text-sm text-muted-foreground">
                  Generate a diagram to preview
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="drawio" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Import diagrams from draw.io by entering a public URL or importing a file.
          </p>
          
          <div className="space-y-2">
            <Input
              placeholder="Enter draw.io diagram URL"
              onChange={(e) => setDiagramUrl(e.target.value)}
            />
            <Button 
              onClick={() => {
                if (diagramUrl) {
                  handleDiagramInsert(diagramUrl);
                } else {
                  toast.error("Please enter a diagram URL");
                }
              }}
            >
              Import from URL
            </Button>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <p className="text-sm text-muted-foreground mb-2">
              Or import a .drawio file:
            </p>
            <Input
              type="file"
              accept=".drawio,.xml"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // In a real app, we'd process the draw.io file
                  // For now, just show a placeholder
                  handleDiagramInsert("/placeholder.svg");
                }
              }}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload diagram images directly from your computer.
          </p>
          
          <Input
            type="file"
            accept="image/*"
            onChange={handleDiagramUpload}
          />
          
          {uploadedDiagram && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium mb-2">Uploaded Diagram</h3>
                <div className="aspect-video bg-muted flex items-center justify-center mb-2">
                  <img
                    src={uploadedDiagram}
                    alt="Uploaded diagram"
                    className="max-h-full object-contain"
                  />
                </div>
                <Button 
                  onClick={() => handleDiagramInsert(uploadedDiagram)}
                  variant="outline"
                  className="w-full"
                >
                  Insert this diagram
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiagramIntegration;
