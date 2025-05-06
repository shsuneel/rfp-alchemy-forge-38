
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { toast } from "sonner";

import StepIndicator from "@/components/ui/StepIndicator";
import FileUpload from "./FileUpload";
import TechStack from "./TechStack";
import Requirements from "./Requirements";
import Timeline from "./Timeline";
import Preview from "./Preview";

const STEPS = [
  "Project Info", 
  "Upload Files", 
  "Tech Stack", 
  "Requirements", 
  "Timeline", 
  "Preview"
];

const SECTORS = [
  "Banking & Finance",
  "Insurance",
  "Healthcare",
  "Technology",
  "Manufacturing",
  "Retail",
  "Government",
  "Education",
  "Telecommunications",
  "Utilities",
  "Other"
];

interface RequirementItem {
  id: string;
  description: string;
  priority: "High" | "Medium" | "Low";
}

interface AssumptionItem {
  id: string;
  description: string;
}

interface DependencyItem {
  id: string;
  description: string;
}

interface Phase {
  id: string;
  name: string;
  description: string;
  durationWeeks: number;
}

const RfpForm = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [sector, setSector] = useState("");
  const [clientInfo, setClientInfo] = useState("");
  
  const [files, setFiles] = useState<File[]>([]);
  const [techStack, setTechStack] = useState<string[]>([]);
  
  const [requirements, setRequirements] = useState<RequirementItem[]>([
    { id: "req-default", description: "", priority: "Medium" }
  ]);
  const [assumptions, setAssumptions] = useState<AssumptionItem[]>([
    { id: "assump-default", description: "" }
  ]);
  const [dependencies, setDependencies] = useState<DependencyItem[]>([
    { id: "dep-default", description: "" }
  ]);
  
  const [timeline, setTimeline] = useState<Phase[]>([
    {
      id: "phase-default",
      name: "Discovery",
      description: "Initial requirements gathering and analysis",
      durationWeeks: 2
    }
  ]);

  const handleNext = () => {
    if (currentStep === 0 && !projectName.trim()) {
      toast.error("Project name is required");
      return;
    }
    
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSave = () => {
    // In a real app, this would save to a database
    toast.success("RFP saved successfully!");
    console.log({
      projectName,
      projectDescription,
      sector,
      clientInfo,
      files,
      techStack,
      requirements,
      assumptions,
      dependencies,
      timeline
    });
  };

  // Form steps rendering
  const renderFormStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>
                Provide basic information about your project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name <span className="text-red-500">*</span></Label>
                <Input 
                  id="project-name" 
                  placeholder="e.g., Customer Portal Modernization"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project-description">Project Description</Label>
                <Textarea 
                  id="project-description" 
                  placeholder="Briefly describe the project and its objectives"
                  rows={4}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Select value={sector} onValueChange={setSector}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTORS.map(sectorOption => (
                      <SelectItem key={sectorOption} value={sectorOption}>
                        {sectorOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client-info">Client Information</Label>
                <Textarea 
                  id="client-info"
                  placeholder="Information about the client and stakeholders"
                  rows={3}
                  value={clientInfo}
                  onChange={(e) => setClientInfo(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        );
        
      case 1:
        return <FileUpload onFilesChange={setFiles} />;
        
      case 2:
        return <TechStack onTechStackChange={setTechStack} />;
        
      case 3:
        return (
          <Requirements 
            onRequirementsChange={setRequirements}
            onAssumptionsChange={setAssumptions}
            onDependenciesChange={setDependencies}
          />
        );
        
      case 4:
        return <Timeline onTimelineChange={setTimeline} />;
        
      case 5:
        return (
          <Preview
            projectName={projectName}
            projectDescription={projectDescription}
            sector={sector}
            clientInfo={clientInfo}
            files={files}
            techStack={techStack}
            requirements={requirements}
            assumptions={assumptions}
            dependencies={dependencies}
            timeline={timeline}
          />
        );
        
      default:
        return null;
    }
  };

  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div>
      <StepIndicator steps={STEPS} currentStep={currentStep} />
      
      <div className="mb-6">
        {renderFormStep()}
      </div>
      
      <div className="flex justify-between mt-6">
        <Button 
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> Previous
        </Button>
        
        <div className="flex space-x-2">
          {isLastStep && (
            <Button type="button" onClick={handleSave} className="flex items-center">
              <Save className="h-4 w-4 mr-2" /> Save RFP
            </Button>
          )}
          
          {!isLastStep && (
            <Button type="button" onClick={handleNext} className="flex items-center">
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RfpForm;
