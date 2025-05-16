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
  setSections,
  setTimeline,
  setTeam,
  setResources,
  setThorId,
  setStatus,
  setRemarks,
  saveRfp,
  SectionItem,
  RfpStatus,
} from "@/store/rfpSlice";
import { createFromRfp } from "@/store/presentationSlice";

import StepIndicator from "@/components/ui/StepIndicator";
import FileUpload from "./FileUpload";
import TechStack from "./TechStack";
import Requirements from "./Requirements";
import Timeline from "./Timeline";
import Team from "./Team";
import Resources from "./Resources";
import Preview from "./Preview";
import AiSuggestions from "./AiSuggestions";
import AiSuggestionIcon from "@/components/ui/AiSuggestionIcon";

// Define the extended TechStackByLayer type here to include new categories
interface TechStackByLayer {
  frontend: string[];
  backend: string[];
  database: string[];
  infrastructure: string[];
  other: string[];
  analyticsAndReporting: string[];
  devops: string[];
  security: string[];
  testing: string[];
}

const STEPS = [
  "Project Info",
  "Upload Files",
  "Tech Stack",
  "Requirements",
  "Timeline",
  "Resources",
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
  const [thorId, setThorIdState] = useState(rfpState.thorId || "");
  const [projectName, setProjectName] = useState(rfpState.projectName);
  const [projectDescription, setProjectDescription] = useState(rfpState.projectDescription);
  const [sector, setSector] = useState(rfpState.sector);
  const [clientInfo, setClientInfo] = useState(rfpState.clientInfo);
  const [files, setFiles] = useState<File[]>([]);
  
  // Updated techStack state to use our extended TechStackByLayer interface
  const [techStack, setTechStackState] = useState<TechStackByLayer>(rfpState.techStackByLayer as TechStackByLayer || {
    frontend: [],
    backend: [],
    database: [],
    infrastructure: [],
    other: [],
    analyticsAndReporting: [],
    devops: [],
    security: [],
    testing: []
  });

  const [requirements, setRequirementsState] = useState(rfpState.requirements);
  const [assumptions, setAssumptionsState] = useState(rfpState.assumptions);
  const [dependencies, setDependenciesState] = useState(rfpState.dependencies);
  const [sections, setSectionsState] = useState<SectionItem[]>(rfpState.sections || []);
  const [timeline, setTimelineState] = useState(rfpState.timeline);
  const [team, setTeamState] = useState(rfpState.team);
  const [resources, setResourcesState] = useState(rfpState.resources);
  const [status, setStatusState] = useState<RfpStatus>(rfpState.status || "Draft");
  const [remarks, setRemarksState] = useState(rfpState.remarks || "");

  // Update local state when Redux state changes (for imported RFPs)
  useEffect(() => {
    setProjectName(rfpState.projectName);
    setProjectDescription(rfpState.projectDescription);
    setSector(rfpState.sector);
    setClientInfo(rfpState.clientInfo);
    // Updated techStackState update to include new categories
    setTechStackState((rfpState.techStackByLayer as TechStackByLayer) || {
      frontend: [],
      backend: [],
      database: [],
      infrastructure: [],
      other: [],
      analyticsAndReporting: [],
      devops: [],
      security: [],
      testing: []
    });
    setRequirementsState(rfpState.requirements);
    setAssumptionsState(rfpState.assumptions);
    setDependenciesState(rfpState.dependencies);
    setSectionsState(rfpState.sections || []);
    setTimelineState(rfpState.timeline);
    setTeamState(rfpState.team);
    setResourcesState(rfpState.resources);
    setStatusState(rfpState.status || "Draft");
    setRemarksState(rfpState.remarks || "");
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
      
      // Also save team when moving from step 0
      dispatch(setTeam(team));
      
      // Also set Thor ID if it exists
      const thorIdMember = team.find(m => m.id === "thor-id");
      if (thorIdMember) {
        dispatch(setThorId(thorIdMember.name));
      } else if (thorId) {
        dispatch(setThorId(thorId));
      }
    } else if (currentStep === 2) {
      // Get flattened tech stack for backward compatibility
      const flattenedTechStack = [
        ...techStack.frontend,
        ...techStack.backend,
        ...techStack.database,
        ...techStack.infrastructure,
        ...techStack.other,
        ...techStack.analyticsAndReporting,
        ...techStack.devops,
        ...techStack.security,
        ...techStack.testing
      ];
      dispatch(setTechStack({
        flattenedStack: flattenedTechStack,
        byLayer: techStack
      }));
    } else if (currentStep === 3) {
      dispatch(setRequirements(requirements));
      dispatch(setAssumptions(assumptions));
      dispatch(setDependencies(dependencies));
      dispatch(setSections(sections));
    } else if (currentStep === 4) {
      dispatch(setTimeline(timeline));
    } else if (currentStep === 5) {
      // Now only set resources here, team is set in step 0
      dispatch(setResources(resources));
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
      ...techStack.other,
      ...techStack.analyticsAndReporting,
      ...techStack.devops,
      ...techStack.security,
      ...techStack.testing
    ];

    dispatch(setTechStack({
      flattenedStack: flattenedTechStack,
      byLayer: techStack
    }));

    dispatch(setRequirements(requirements));
    dispatch(setAssumptions(assumptions));
    dispatch(setDependencies(dependencies));
    dispatch(setSections(sections));
    dispatch(setTimeline(timeline));

    // Save team and resources
    dispatch(setTeam(team));
    dispatch(setResources(resources));

    // Also set Thor ID if it exists
    const thorIdMember = team.find(m => m.id === "thor-id");
    if (thorIdMember) {
      dispatch(setThorId(thorIdMember.name));
    } else if (thorId) {
      dispatch(setThorId(thorId));
    }

    // Save status and remarks
    dispatch(setStatus(status));
    dispatch(setRemarks(remarks));

    // Save to storage
    dispatch(saveRfp());

    toast.success("RFP saved successfully!");
  };

  // Add handlers for status and remarks
  const handleStatusChange = (newStatus: RfpStatus) => {
    setStatusState(newStatus);
    dispatch(setStatus(newStatus));
  };

  const handleRemarksChange = (newRemarks: string) => {
    setRemarksState(newRemarks);
    dispatch(setRemarks(newRemarks));
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

  // Add new handlers for AI suggestions
  const handleProjectDescriptionSuggestion = (suggestion: string) => {
    setProjectDescription(suggestion);
  };

  const handleRequirementsSuggestion = (suggestion: string) => {
    // Create a requirement from the suggestion
    const newRequirements = [...requirements];
    suggestion.split('\n').filter(line => line.trim()).forEach((line, index) => {
      const trimmedLine = line.replace(/^\d+\.\s*/, '').trim(); // Remove numbering
      if (trimmedLine) {
        newRequirements.push({
          id: `req-${Date.now()}-${index}`,
          description: trimmedLine,
          priority: "Medium"
        });
      }
    });
    setRequirementsState(newRequirements);
  };

  const handleTechStackSuggestion = (suggestion: string) => {
    const techItems = suggestion.split(',').map(item => item.trim()).filter(Boolean);
    const newTechStack = { ...techStack };
    
    // Add to 'other' category by default
    newTechStack.other = [...newTechStack.other, ...techItems.filter(item => !newTechStack.other.includes(item))];
    setTechStackState(newTechStack);
  };

  const handleAssumptionsSuggestion = (suggestion: string) => {
    const newAssumptions = [...assumptions];
    suggestion.split('\n').filter(line => line.trim()).forEach((line, index) => {
      const trimmedLine = line.replace(/^\d+\.\s*/, '').trim(); // Remove numbering
      if (trimmedLine) {
        newAssumptions.push({
          id: `assump-${Date.now()}-${index}`,
          description: trimmedLine
        });
      }
    });
    setAssumptionsState(newAssumptions);
  };

  const handleDependenciesSuggestion = (suggestion: string) => {
    const newDependencies = [...dependencies];
    suggestion.split('\n').filter(line => line.trim()).forEach((line, index) => {
      const trimmedLine = line.replace(/^\d+\.\s*/, '').trim(); // Remove numbering
      if (trimmedLine) {
        newDependencies.push({
          id: `dep-${Date.now()}-${index}`,
          description: trimmedLine
        });
      }
    });
    setDependenciesState(newDependencies);
  };

  const handleTimelineSuggestion = (suggestion: string) => {
    const newTimeline = [...timeline];
    suggestion.split('\n').filter(line => line.trim()).forEach((line, index) => {
      // Extract phase name and duration (if available)
      const match = line.match(/^(?:Phase\s*\d*\s*\(?(.*?)\)?:?\s*)?(.*)$/i);
      if (match && match[1]) {
        const phaseName = match[1].trim();
        const durationMatch = match[2].match(/(\d+)-?(\d+)?\s*weeks?/i);
        let durationWeeks = 2; // Default
        
        if (durationMatch) {
          // If range, take the average
          if (durationMatch[2]) {
            durationWeeks = Math.round((parseInt(durationMatch[1]) + parseInt(durationMatch[2])) / 2);
          } else {
            durationWeeks = parseInt(durationMatch[1]);
          }
        }
        
        newTimeline.push({
          id: `phase-${Date.now()}-${index}`,
          name: phaseName,
          description: match[2].replace(/\d+-?\d*\s*weeks?/i, '').trim(),
          durationWeeks: durationWeeks
        });
      }
    });
    
    if (newTimeline.length > 1) { // If we added any new phases
      setTimelineState(newTimeline);
    }
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="project-name">Project Name <span className="text-red-500">*</span></Label>
                </div>
                <Input
                  id="project-name"
                  placeholder="e.g., Customer Portal Modernization"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="project-description">Project Description</Label>
                  <AiSuggestionIcon 
                    field="projectDescription"
                    onSuggestionApplied={handleProjectDescriptionSuggestion}
                    currentValue={projectDescription}
                  />
                </div>
                <Textarea
                  id="project-description"
                  placeholder="Briefly describe the project and its objectives"
                  rows={4}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sector">Sector</Label>
                  <AiSuggestionIcon 
                    field="dependencies"
                    onSuggestionApplied={(suggestion) => setSector(suggestion.split(',')[0].trim())}
                    currentValue={projectDescription}
                  />
                </div>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="thorId">Thor ID</Label>
                </div>
                <Input
                  id="thorId"
                  placeholder="Enter Thor ID"
                  value={thorId}
                  onChange={(e) => {
                    setThorIdState(e.target.value);
                  }}
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">Team</h3>
                </div>
                <Team onTeamChange={setTeamState} initialTeam={team} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="client-info">Client Information</Label>
                  <AiSuggestionIcon 
                    field="dependencies"
                    onSuggestionApplied={(suggestion) => setClientInfo(suggestion)}
                    currentValue={projectDescription}
                  />
                </div>
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
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Technology Stack</h3>
              <AiSuggestionIcon
                field="techStack"
                currentValue={projectDescription}
                onSuggestionApplied={handleTechStackSuggestion}
              />
            </div>
            <TechStack
              onTechStackChange={setTechStackState}
              techStackByLayer={techStack}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Requirements, Assumptions & Dependencies</h3>
              <div className="flex gap-2">
                <AiSuggestionIcon
                  field="requirements"
                  onSuggestionApplied={handleRequirementsSuggestion}
                  currentValue={projectDescription}
                />
                <AiSuggestionIcon
                  field="assumptions"
                  onSuggestionApplied={handleAssumptionsSuggestion}
                  currentValue={projectDescription}
                />
                <AiSuggestionIcon
                  field="dependencies"
                  onSuggestionApplied={handleDependenciesSuggestion}
                  currentValue={projectDescription}
                />
              </div>
            </div>
            <Requirements
              onRequirementsChange={setRequirementsState}
              onAssumptionsChange={setAssumptionsState}
              onDependenciesChange={setDependenciesState}
              onSectionsChange={setSectionsState}
              initialRequirements={requirements}
              initialAssumptions={assumptions}
              initialDependencies={dependencies}
              initialSections={sections}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Project Timeline</h3>
              <AiSuggestionIcon
                field="timeline"
                onSuggestionApplied={handleTimelineSuggestion}
                currentValue={projectDescription}
              />
            </div>
            <Timeline onTimelineChange={setTimelineState} initialTimeline={timeline} />
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Resources</h3>
              <AiSuggestionIcon
                field="dependencies"
                onSuggestionApplied={(suggestion) => {
                  // Attempt to parse resources from the suggestion
                  // This is simplified - in a real app, you'd want more sophisticated parsing
                  const newResources = [...resources];
                  const lines = suggestion.split('\n').filter(line => line.trim());
                  lines.forEach((line, index) => {
                    if (line.includes('developer') || line.includes('engineer') || 
                        line.includes('designer') || line.includes('manager')) {
                      newResources.push({
                        id: `resource-${Date.now()}-${index}`,
                        title: line.trim(),
                        level: 'Mid',
                        hourlyRate: 100
                      });
                    }
                  });
                  if (newResources.length > resources.length) {
                    setResourcesState(newResources);
                  }
                }}
                currentValue={projectDescription}
              />
            </div>
            <Resources onResourcesChange={setResourcesState} initialResources={resources} />
          </div>
        );

      case 6:
        return (
          <Preview
            projectName={projectName}
            projectDescription={projectDescription}
            sector={sector}
            clientInfo={clientInfo}
            files={files}
            techStack={[
              ...techStack.frontend, 
              ...techStack.backend, 
              ...techStack.database, 
              ...techStack.infrastructure, 
              ...techStack.other,
              ...techStack.analyticsAndReporting,
              ...techStack.devops,
              ...techStack.security,
              ...techStack.testing
            ]}
            requirements={requirements}
            assumptions={assumptions}
            dependencies={dependencies}
            timeline={timeline}
            team={team}
            resources={resources}
            sections={sections}
            thorId={thorId}
            status={status}
            remarks={remarks}
            onStatusChange={handleStatusChange}
            onRemarksChange={handleRemarksChange}
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
