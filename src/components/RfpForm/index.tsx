import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Save, Presentation, Tag } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

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
  setDeadlineDate,
  setNotes,
  setTags,
  saveRfp,
  SectionItem,
  RfpStatus,
  TeamMember,
} from "@/store/rfpSlice";
import { createFromRfp } from "@/store/presentationSlice";

import StepIndicator from "@/components/ui/StepIndicator";
import FileUpload from "./FileUpload";
import TechStack from "./TechStack";
import Requirements from "./Requirements";
import Timeline from "./Timeline";
import TeamComponent from "./Team";
import Resources from "./Resources";
import Preview from "./Preview";
import AiSuggestions from "./AiSuggestions";
import AiSuggestionIcon from "@/components/ui/AiSuggestionIcon";
import { generatePPTX } from "@/lib/utils";

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
  const [team, setTeamState] = useState<TeamMember[]>(rfpState.team);
  const [resources, setResourcesState] = useState(rfpState.resources);
  const [status, setStatusState] = useState<RfpStatus>(rfpState.status || "Draft");
  const [remarks, setRemarksState] = useState(rfpState.remarks || "");
  const [deadlineDate, setDeadlineDateState] = useState<Date | undefined>(
    rfpState.deadlineDate ? parseISO(rfpState.deadlineDate) : undefined
  );
  const [notes, setNotesState] = useState(rfpState.notes || "");
  const [tagsString, setTagsStringState] = useState((rfpState.tags || []).join(", "));

  const rfp = useAppSelector(state => state.rfp);

  useEffect(() => {
    setThorIdState(rfpState.thorId || "");
    setProjectName(rfpState.projectName);
    setProjectDescription(rfpState.projectDescription);
    setSector(rfpState.sector);
    setClientInfo(rfpState.clientInfo);
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
    setDeadlineDateState(rfpState.deadlineDate ? parseISO(rfpState.deadlineDate) : undefined);
    setNotesState(rfpState.notes || "");
    setTagsStringState((rfpState.tags || []).join(", "));
  }, [rfpState]);

  const handleNext = () => {
    if (currentStep === 0 && !projectName.trim()) {
      toast.error("Project name is required");
      return;
    }

    if (currentStep === 0) {
      dispatch(setProjectInfo({
        name: projectName,
        description: projectDescription,
        sector,
        clientInfo
      }));
      dispatch(setTeam(team));
      dispatch(setThorId(thorId));
      dispatch(setDeadlineDate(deadlineDate ? deadlineDate.toISOString() : undefined));
      dispatch(setNotes(notes));
      const parsedTags = tagsString.split(',').map(tag => tag.trim()).filter(Boolean);
      dispatch(setTags(parsedTags));
    } else if (currentStep === 2) {
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
    dispatch(setProjectInfo({
      name: projectName,
      description: projectDescription,
      sector,
      clientInfo
    }));
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
    dispatch(setTeam(team));
    dispatch(setResources(resources));
    dispatch(setThorId(thorId));
    dispatch(setStatus(status));
    dispatch(setRemarks(remarks));
    dispatch(setDeadlineDate(deadlineDate ? deadlineDate.toISOString() : undefined));
    dispatch(setNotes(notes));
    const parsedTags = tagsString.split(',').map(tag => tag.trim()).filter(Boolean);
    dispatch(setTags(parsedTags));
    dispatch(saveRfp());
    toast.success("RFP saved successfully!");
  };

  const handleStatusChange = (newStatus: RfpStatus) => {
    setStatusState(newStatus);
    dispatch(setStatus(newStatus));
  };

  const handleRemarksChange = (newRemarks: string) => {
    setRemarksState(newRemarks);
    dispatch(setRemarks(newRemarks));
  };

  const handleCreatePresentation = async () => {
    dispatch(createFromRfp({
      projectName,
      projectDescription,
      clientInfo,
      requirements
    }));

    const ppt = await generatePPTX(rfp);
    window.open(ppt, 'new')

    toast.success("Presentation created from RFP data!");
  };

  const handleProjectDescriptionSuggestion = (suggestion: string) => {
    setProjectDescription(suggestion);
  };

  const handleRequirementsSuggestion = (suggestion: string) => {
    const newRequirements = [...requirements];
    suggestion.split('\n').filter(line => line.trim()).forEach((line, index) => {
      const trimmedLine = line.replace(/^\d+\.\s*/, '').trim(); 
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
    newTechStack.other = [...newTechStack.other, ...techItems.filter(item => !newTechStack.other.includes(item))];
    setTechStackState(newTechStack);
  };

  const handleAssumptionsSuggestion = (suggestion: string) => {
    const newAssumptions = [...assumptions];
    suggestion.split('\n').filter(line => line.trim()).forEach((line, index) => {
      const trimmedLine = line.replace(/^\d+\.\s*/, '').trim();
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
      const trimmedLine = line.replace(/^\d+\.\s*/, '').trim();
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
      const match = line.match(/^(?:Phase\s*\d*\s*\(?(.*?)\)?:?\s*)?(.*)$/i);
      if (match && match[1]) {
        const phaseName = match[1].trim();
        const durationMatch = match[2].match(/(\d+)-?(\d+)?\s*weeks?/i);
        let durationWeeks = 2; 

        if (durationMatch) {
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

    if (newTimeline.length > timeline.length) { // Check if timeline actually changed
      setTimelineState(newTimeline);
    }
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>
                Provide basic information about your project, including deadline and collaborators.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="deadlineDate">Deadline Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !deadlineDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deadlineDate ? format(deadlineDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                      <Calendar
                        mode="single"
                        selected={deadlineDate}
                        onSelect={setDeadlineDateState}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags <span className="text-xs text-muted-foreground">(comma-separated)</span></Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="tags"
                      placeholder="e.g., urgent, client-facing, phase1"
                      value={tagsString}
                      onChange={(e) => setTagsStringState(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional comments or context for the RFP"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotesState(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="thorId">Thor ID</Label>
                <Input
                  id="thorId"
                  placeholder="Enter Thor ID"
                  value={thorId}
                  onChange={(e) => setThorIdState(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-info">Client Information</Label>
                 <AiSuggestionIcon
                    field="clientInfo"
                    onSuggestionApplied={(suggestion) => setClientInfo(suggestion)}
                    currentValue={clientInfo}
                  />
                <Textarea
                  id="client-info"
                  placeholder="Information about the client and stakeholders"
                  rows={3}
                  value={clientInfo}
                  onChange={(e) => setClientInfo(e.target.value)}
                />
              </div>

              <div>
                <TeamComponent onTeamChange={setTeamState} initialTeam={team} />
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
                onSuggestionApplied={handleTechStackSuggestion}
                currentValue={projectDescription} 
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
                field="resources"
                onSuggestionApplied={(suggestion) => {
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
            deadlineDate={deadlineDate ? deadlineDate.toISOString() : undefined}
            notes={notes}
            tags={tagsString.split(',').map(tag => tag.trim()).filter(Boolean)}
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
