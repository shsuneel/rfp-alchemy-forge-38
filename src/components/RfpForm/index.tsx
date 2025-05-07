
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Save, Presentation } from "lucide-react";
import { toast } from "sonner";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { 
  setProjectInfo, 
  setTechStack, 
  setRequirements, 
  setAssumptions, 
  setDependencies, 
  setTimeline,
  saveRfp
} from "@/store/rfpSlice";
import { createFromRfp } from "@/store/presentationSlice";

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

const RfpForm = () => {
  const dispatch = useAppDispatch();
  const rfpState = useAppSelector(state => state.rfp);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [projectName, setProjectName] = useState(rfpState.projectName);
  const [projectDescription, setProjectDescription] = useState(rfpState.projectDescription);
  const [sector, setSector] = useState(rfpState.sector);
  const [clientInfo, setClientInfo] = useState(rfpState.clientInfo);
  const [files, setFiles] = useState<File[]>([]);
  const [techStack, setTechStackState] = useState<{
    frontend: string[];
    backend: string[];
    database: string[];
    infrastructure: string[];
    other: string[];
  }>(rfpState.techStackByLayer || {
    frontend: [],
    backend: [],
    database: [],
    infrastructure: [],
    other: []
  });

  const [requirements, setRequirementsState] = useState(rfpState.requirements);
  const [assumptions, setAssumptionsState] = useState(rfpState.assumptions);
  const [dependencies, setDependenciesState] = useState(rfpState.dependencies);
  const [timeline, setTimelineState] = useState(rfpState.timeline);

  // Update local state when Redux state changes (for imported RFPs)
  useEffect(() => {
    setProjectName(rfpState.projectName);
    setProjectDescription(rfpState.projectDescription);
    setSector(rfpState.sector);
    setClientInfo(rfpState.clientInfo);
    setTechStackState(rfpState.techStackByLayer || {
      frontend: [],
      backend: [],
      database: [],
      infrastructure: [],
      other: []
    });
    setRequirementsState(rfpState.requirements);
    setAssumptionsState(rfpState.assumptions);
    setDependenciesState(rfpState.dependencies);
    setTimelineState(rfpState.timeline);
  }, [rfpState]);

  const handleNext = () => {
    if (currentStep === 0 && !projectName.trim()) {
      toast.error("Project name is required");
      return;
    }
    
    // Save data to Redux based on current step
    if (currentStep === 0) {
      dispatch(setProjectInfo({ 
        name: projectName, 
        description: projectDescription,
        sector,
        clientInfo
      }));
    } else if (currentStep === 2) {
      // Get flattened tech stack for backward compatibility
      const flattenedTechStack = [
        ...techStack.frontend, 
        ...techStack.backend, 
        ...techStack.database,
        ...techStack.infrastructure,
        ...techStack.other
      ];
      dispatch(setTechStack({
        flattenedStack: flattenedTechStack,
        byLayer: techStack
      }));
    } else if (currentStep === 3) {
      dispatch(setRequirements(requirements));
      dispatch(setAssumptions(assumptions));
      dispatch(setDependencies(dependencies));
    } else if (currentStep === 4) {
      dispatch(setTimeline(timeline));
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
    // Save all data to Redux
    dispatch(setProjectInfo({ 
      name: projectName, 
      description: projectDescription,
      sector,
      clientInfo
    }));
    
    // Get flattened tech stack for backward compatibility
    const flattenedTechStack = [
      ...techStack.frontend, 
      ...techStack.backend, 
      ...techStack.database,
      ...techStack.infrastructure,
      ...techStack.other
    ];
    
    dispatch(setTechStack({
      flattenedStack: flattenedTechStack,
      byLayer: techStack
    }));
    
    dispatch(setRequirements(requirements));
    dispatch(setAssumptions(assumptions));
    dispatch(setDependencies(dependencies));
    dispatch(setTimeline(timeline));
    
    // Save to storage
    dispatch(saveRfp());
    
    toast.success("RFP saved successfully!");
  };
  
  const handleCreatePresentation = () => {
    dispatch(createFromRfp({
      projectName,
      projectDescription,
      clientInfo,
      requirements
    }));
    
    toast.success("Presentation created from RFP data!");
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
        return <TechStack 
          onTechStackChange={setTechStackState} 
          techStackByLayer={techStack} 
        />;
        
      case 3:
        return (
          <Requirements 
            onRequirementsChange={setRequirementsState}
            onAssumptionsChange={setAssumptionsState}
            onDependenciesChange={setDependenciesState}
            initialRequirements={requirements}
            initialAssumptions={assumptions}
            initialDependencies={dependencies}
          />
        );
        
      case 4:
        return <Timeline onTimelineChange={setTimelineState} initialTimeline={timeline} />;
        
      case 5:
        return (
          <Preview
            projectName={projectName}
            projectDescription={projectDescription}
            sector={sector}
            clientInfo={clientInfo}
            files={files}
            techStack={[...techStack.frontend, ...techStack.backend, ...techStack.database, ...techStack.infrastructure, ...techStack.other]}
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
          <Button type="button" onClick={handleSave} className="flex items-center">
            <Save className="h-4 w-4 mr-2" /> Save RFP
          </Button>
          
          {isLastStep && (
            <Button 
              type="button" 
              onClick={handleCreatePresentation} 
              variant="secondary"
              className="flex items-center"
            >
              <Presentation className="h-4 w-4 mr-2" /> Create Presentation
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
