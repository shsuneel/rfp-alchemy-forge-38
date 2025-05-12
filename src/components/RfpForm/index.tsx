
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
  RfpStatus
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
  const [thorId, setThorIdState] = useState('');
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
      ...techStack.other
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

              <div className="space-y-4">
                <Label htmlFor="thorId">Thor ID</Label>
                <Input
                  id="thorId"
                  placeholder="Enter Thor ID"
                  value={thorId}
                  onChange={(e) => {
                    setThorIdState(e.target.value);
                  }}
                />
              </div>
              
              {/* Team component moved to Project Info */}
              <Team onTeamChange={setTeamState} initialTeam={team} />

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
            onSectionsChange={setSectionsState}
            initialRequirements={requirements}
            initialAssumptions={assumptions}
            initialDependencies={dependencies}
            initialSections={sections}
          />
        );

      case 4:
        return <Timeline onTimelineChange={setTimelineState} initialTimeline={timeline} />;

      case 5:
        return <Resources onResourcesChange={setResourcesState} initialResources={resources} />;

      case 6:
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
