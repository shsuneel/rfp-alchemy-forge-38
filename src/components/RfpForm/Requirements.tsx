import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Trash2,
  Plus,
  FileText,
  FileImage,
  FileMinus,
  FilePlus,
  Heading,
  PlusCircle
} from "lucide-react";
import AiSuggestionIcon from "@/components/ui/AiSuggestionIcon";

import { RequirementItem, AssumptionItem, DependencyItem } from "@/store/rfpSlice";

// Define section types
export interface SectionItem {
  id: string;
  type: 'title' | 'agenda' | 'summary' | 'diagram' | 'assumption' | 'dependency' | 'requirement';
  content: string;
  priority?: "High" | "Medium" | "Low"; // Only for requirements
  imageUrl?: string; // Only for diagrams
}

interface RequirementsProps {
  onRequirementsChange: (requirements: RequirementItem[]) => void;
  onAssumptionsChange: (assumptions: AssumptionItem[]) => void;
  onDependenciesChange: (dependencies: DependencyItem[]) => void;
  onSectionsChange?: (sections: SectionItem[]) => void;
  initialRequirements?: RequirementItem[];
  initialAssumptions?: AssumptionItem[];
  initialDependencies?: DependencyItem[];
  initialSections?: SectionItem[];
}

const Requirements = ({
  onRequirementsChange,
  onAssumptionsChange,
  onDependenciesChange,
  onSectionsChange,
  initialRequirements = [{ 
    id: "req-1", 
    description: "", 
    priority: "Medium", 
    phase: "", 
    relatedAssumptions: "", 
    relatedDependencies: "" 
  }],
  initialAssumptions = [{ id: "assump-1", description: "" }],
  initialDependencies = [{ id: "dep-1", description: "" }],
  initialSections = []
}: RequirementsProps) => {
  const [requirements, setRequirements] = useState<RequirementItem[]>(
    initialRequirements.map(req => ({
      phase: "",
      relatedAssumptions: "",
      relatedDependencies: "",
      ...req
    }))
  );
  const [assumptions, setAssumptions] = useState<AssumptionItem[]>(initialAssumptions);
  const [dependencies, setDependencies] = useState<DependencyItem[]>(initialDependencies);
  const [sections, setSections] = useState<SectionItem[]>(initialSections);
  const [showSectionMenu, setShowSectionMenu] = useState(false);

  // Use useEffect to update local state when props change
  useEffect(() => {
    if (initialRequirements) {
      setRequirements(initialRequirements.map(req => ({
        phase: "",
        relatedAssumptions: "",
        relatedDependencies: "",
        ...req
      })));
    }
    if (initialAssumptions) {
      setAssumptions(initialAssumptions);
    }
    if (initialDependencies) {
      setDependencies(initialDependencies);
    }
    if (initialSections) {
      setSections(initialSections);
    }
  }, [initialRequirements, initialAssumptions, initialDependencies, initialSections]);

  // Update parent component when local state changes
  useEffect(() => {
    onRequirementsChange(requirements);
  }, [requirements, onRequirementsChange]);

  useEffect(() => {
    onAssumptionsChange(assumptions);
  }, [assumptions, onAssumptionsChange]);

  useEffect(() => {
    onDependenciesChange(dependencies);
  }, [dependencies, onDependenciesChange]);

  useEffect(() => {
    if (onSectionsChange) {
      onSectionsChange(sections);
    }
  }, [sections, onSectionsChange]);

  const addRequirement = () => {
    setRequirements([
      ...requirements,
      {
        id: `req-${Date.now()}`,
        description: "",
        priority: "Medium",
        phase: "",
        relatedAssumptions: "",
        relatedDependencies: ""
      }
    ]);
  };

  const updateRequirement = (index: number, field: keyof RequirementItem, value: any) => {
    const newRequirements = [...requirements];
    // Ensure all fields exist on the item being updated
    const currentReq = newRequirements[index];
    newRequirements[index] = {
        phase: "", // default if not present
        relatedAssumptions: "", // default if not present
        relatedDependencies: "", // default if not present
        ...currentReq, 
        [field]: value 
    };
    setRequirements(newRequirements);
  };

  const removeRequirement = (index: number) => {
    if (requirements.length > 1 || (requirements.length === 1 && requirements[0].description !== "")) { // Allow deleting the last one if it's not truly empty
        setRequirements(requirements.filter((_, i) => i !== index));
    }
    if (requirements.length === 1 && requirements.filter((_, i) => i !== index).length === 0) {
        // If all requirements are removed, add a default blank one back
        setRequirements([{
            id: `req-default-${Date.now()}`,
            description: "",
            priority: "Medium",
            phase: "",
            relatedAssumptions: "",
            relatedDependencies: ""
        }]);
    }
  };
  
  const handleAiAddRequirements = (suggestion: string) => {
    const newReqDescriptions = suggestion.split('\n').filter(desc => desc.trim() !== '');
    const newReqItems: RequirementItem[] = newReqDescriptions.map((desc, idx) => ({
      id: `req-ai-${Date.now()}-${idx}`,
      description: desc,
      priority: "Medium",
      phase: "",
      relatedAssumptions: "",
      relatedDependencies: "",
    }));
    if (newReqItems.length > 0) {
      // If the only requirement is the default empty one, replace it
      if (requirements.length === 1 && requirements[0].description === "" && (requirements[0].id.startsWith("req-default") || requirements[0].id.startsWith("req-1"))) {
        setRequirements(newReqItems);
      } else {
        setRequirements(prev => [...prev, ...newReqItems]);
      }
    }
  };
  
  const getCurrentRequirementsContext = () => {
    return requirements.map(req => req.description).filter(desc => desc.trim() !== "").join("\n");
  };

  // Assumptions handling
  const addAssumption = () => {
    setAssumptions([
      ...assumptions,
      { id: `assump-${Date.now()}`, description: "" }
    ]);
  };

  const updateAssumption = (index: number, description: string) => {
    const newAssumptions = [...assumptions];
    newAssumptions[index] = { ...newAssumptions[index], description };
    setAssumptions(newAssumptions);
  };

  const removeAssumption = (index: number) => {
    if (assumptions.length > 1 || (assumptions.length === 1 && assumptions[0].description !== "")) {
      setAssumptions(assumptions.filter((_, i) => i !== index));
    }
     if (assumptions.length === 1 && assumptions.filter((_, i) => i !== index).length === 0) {
        setAssumptions([{ id: `assump-default-${Date.now()}`, description: "" }]);
    }
  };
  
  const handleAiAddAssumptions = (suggestion: string) => {
    const newAssumpDescriptions = suggestion.split('\n').filter(desc => desc.trim() !== '');
    const newAssumpItems: AssumptionItem[] = newAssumpDescriptions.map((desc, idx) => ({
      id: `assump-ai-${Date.now()}-${idx}`,
      description: desc,
    }));
    if (newAssumpItems.length > 0) {
      if (assumptions.length === 1 && assumptions[0].description === "" && (assumptions[0].id.startsWith("assump-default") || assumptions[0].id.startsWith("assump-1"))) {
        setAssumptions(newAssumpItems);
      } else {
        setAssumptions(prev => [...prev, ...newAssumpItems]);
      }
    }
  };

  const getCurrentAssumptionsContext = () => {
    return assumptions.map(a => a.description).filter(desc => desc.trim() !== "").join("\n");
  };

  // Dependencies handling
  const addDependency = () => {
    setDependencies([
      ...dependencies,
      { id: `dep-${Date.now()}`, description: "" }
    ]);
  };

  const updateDependency = (index: number, description: string) => {
    const newDependencies = [...dependencies];
    newDependencies[index] = { ...newDependencies[index], description };
    setDependencies(newDependencies);
  };

  const removeDependency = (index: number) => {
    if (dependencies.length > 1 || (dependencies.length === 1 && dependencies[0].description !== "" )) {
      setDependencies(dependencies.filter((_, i) => i !== index));
    }
    if (dependencies.length === 1 && dependencies.filter((_, i) => i !== index).length === 0) {
       setDependencies([{ id: `dep-default-${Date.now()}`, description: "" }]);
    }
  };

  const handleAiAddDependencies = (suggestion: string) => {
    const newDepDescriptions = suggestion.split('\n').filter(desc => desc.trim() !== '');
    const newDepItems: DependencyItem[] = newDepDescriptions.map((desc, idx) => ({
      id: `dep-ai-${Date.now()}-${idx}`,
      description: desc,
    }));
    if (newDepItems.length > 0) {
       if (dependencies.length === 1 && dependencies[0].description === "" && (dependencies[0].id.startsWith("dep-default") || dependencies[0].id.startsWith("dep-1"))) {
        setDependencies(newDepItems);
      } else {
        setDependencies(prev => [...prev, ...newDepItems]);
      }
    }
  };

  const getCurrentDependenciesContext = () => {
    return dependencies.map(d => d.description).filter(desc => desc.trim() !== "").join("\n");
  };

  // Sections handling
  const addSection = (type: SectionItem['type']) => {
    const newSection: SectionItem = {
      id: `section-${Date.now()}`,
      type,
      content: "",
      priority: type === 'requirement' ? "Medium" : undefined,
    };

    setSections([...sections, newSection]);
    setShowSectionMenu(false);
  };

  const updateSection = (index: number, field: keyof SectionItem, value: any) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setSections(newSections);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const removeSectionItem = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const renderSectionContent = (section: SectionItem, index: number) => {
    switch (section.type) {
      case 'title':
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 font-medium">
                <Heading className="h-5 w-5" /> <span>Title</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeSectionItem(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Input
              value={section.content}
              onChange={(e) => updateSection(index, 'content', e.target.value)}
              placeholder="Enter title"
              className="font-bold text-lg"
            />
          </div>
        );
      case 'agenda':
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 font-medium">
                <FileText className="h-5 w-5" /> <span>Agenda</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeSectionItem(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              value={section.content}
              onChange={(e) => updateSection(index, 'content', e.target.value)}
              placeholder="Enter agenda items"
              rows={4}
            />
          </div>
        );
      case 'summary':
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 font-medium">
                <FileText className="h-5 w-5" /> <span>Summary</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeSectionItem(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              value={section.content}
              onChange={(e) => updateSection(index, 'content', e.target.value)}
              placeholder="Enter summary text"
              rows={4}
            />
          </div>
        );
      case 'diagram':
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 font-medium">
                <FileImage className="h-5 w-5" /> <span>Diagram</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeSectionItem(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    updateSection(index, 'imageUrl', reader.result as string);
                    updateSection(index, 'content', file.name); // Store filename as content
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            {section.imageUrl && (
              <div className="mt-2">
                <img
                  src={section.imageUrl}
                  alt={section.content || "Diagram"}
                  className="max-w-full h-auto border rounded"
                />
              </div>
            )}
            {section.imageUrl && (
                <Input
                    value={section.content} // This is the filename now
                    onChange={(e) => updateSection(index, 'content', e.target.value)}
                    placeholder="Optional: Diagram title or description"
                    className="mt-2"
                />
            )}
          </div>
        );
      case 'assumption':
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 font-medium">
                <FileMinus className="h-5 w-5" /> <span>Assumption</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeSectionItem(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              value={section.content}
              onChange={(e) => updateSection(index, 'content', e.target.value)}
              placeholder="Enter assumption"
              rows={3}
            />
          </div>
        );
      case 'dependency':
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 font-medium">
                <FilePlus className="h-5 w-5" /> <span>Dependency</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeSectionItem(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              value={section.content}
              onChange={(e) => updateSection(index, 'content', e.target.value)}
              placeholder="Enter dependency"
              rows={3}
            />
          </div>
        );
      case 'requirement': // This is for a generic custom requirement section
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 font-medium">
                <FileText className="h-5 w-5" /> <span>Requirement</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeSectionItem(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              value={section.content}
              onChange={(e) => updateSection(index, 'content', e.target.value)}
              placeholder="Enter requirement details"
              rows={3}
              className="mb-2"
            />
             <div className="flex items-center">
              <Label htmlFor={`priority-${section.id}`} className="mr-2">Priority:</Label>
              <Select
                value={section.priority || "Medium"}
                onValueChange={(value) => updateSection(index, 'priority', value as "High" | "Medium" | "Low")}
              >
                <SelectTrigger id={`priority-${section.id}`} className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      default:
        return <p>Unknown section type</p>;
    }
  };

  const getSectionIcon = (type: SectionItem['type']) => {
    switch (type) {
      case 'title': return <Heading className="h-4 w-4" />;
      case 'agenda': return <FileText className="h-4 w-4" />;
      case 'summary': return <FileText className="h-4 w-4" />;
      case 'diagram': return <FileImage className="h-4 w-4" />;
      case 'assumption': return <FileMinus className="h-4 w-4" />;
      case 'dependency': return <FilePlus className="h-4 w-4" />;
      case 'requirement': return <FileText className="h-4 w-4" />; // Generic custom requirement
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getSectionTitle = (type: SectionItem['type']) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="space-y-8">
      {/* Requirements */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Project Requirements</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRequirement}
              >
                <Plus className="h-4 w-4 mr-1" /> Add New Requirement
              </Button>
              <AiSuggestionIcon
                field="requirements" // Changed from requirements_bulk
                currentValue={getCurrentRequirementsContext()}
                onSuggestionApplied={handleAiAddRequirements}
              />
            </div>
          </div>
          <CardDescription>Define the key requirements for your project. All fields are editable.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[150px]">Priority</TableHead>
                <TableHead className="w-[200px]">Phase</TableHead>
                <TableHead className="w-[200px]">Related Assumptions</TableHead>
                <TableHead className="w-[200px]">Related Dependencies</TableHead>
                <TableHead className="w-[100px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requirements.map((req, index) => (
                <TableRow key={req.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <Textarea
                        placeholder="Requirement description"
                        value={req.description}
                        onChange={(e) => updateRequirement(index, "description", e.target.value)}
                        className="min-h-[60px] flex-grow"
                        rows={2}
                      />
                       <AiSuggestionIcon
                          field="requirements" // Changed from requirement_item
                          currentValue={req.description}
                          onSuggestionApplied={(suggestion) => updateRequirement(index, "description", suggestion)}
                        />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={req.priority}
                      onValueChange={(value) => updateRequirement(index, "priority", value as "High" | "Medium" | "Low")}
                    >
                      <SelectTrigger id={`priority-${req.id}-item`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="e.g., Development, Testing"
                      value={req.phase || ""}
                      onChange={(e) => updateRequirement(index, "phase", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                     <Textarea
                        placeholder="Assumptions specific to this requirement"
                        value={req.relatedAssumptions || ""}
                        onChange={(e) => updateRequirement(index, "relatedAssumptions", e.target.value)}
                        rows={2}
                        className="min-h-[60px]"
                      />
                  </TableCell>
                  <TableCell>
                     <Textarea
                        placeholder="Dependencies specific to this requirement"
                        value={req.relatedDependencies || ""}
                        onChange={(e) => updateRequirement(index, "relatedDependencies", e.target.value)}
                        rows={2}
                        className="min-h-[60px]"
                      />
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRequirement(index)}
                      disabled={requirements.length === 1 && requirements[0].description === "" && (requirements[0].id.startsWith("req-default") || requirements[0].id.startsWith("req-1"))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Assumptions Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Project Assumptions</CardTitle>
             <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAssumption}
                >
                    <Plus className="h-4 w-4 mr-1" /> Add Assumption
                </Button>
                <AiSuggestionIcon
                    field="assumptions" // Changed from assumptions_bulk
                    currentValue={getCurrentAssumptionsContext()}
                    onSuggestionApplied={handleAiAddAssumptions}
                />
            </div>
          </div>
          <CardDescription>List key assumptions for the project. These are general assumptions, distinct from those tied to specific requirements.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assumptions.map((assumption, index) => (
                <TableRow key={assumption.id}>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <Textarea
                        placeholder="Assumption description"
                        value={assumption.description}
                        onChange={(e) => updateAssumption(index, e.target.value)}
                        className="min-h-[60px] flex-grow"
                        rows={2}
                      />
                      <AiSuggestionIcon
                        field="assumptions" // Changed from assumption_item
                        currentValue={assumption.description}
                        onSuggestionApplied={(suggestion) => updateAssumption(index, suggestion)}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center align-top pt-5"> {/* Align button to top */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAssumption(index)}
                      disabled={assumptions.length === 1 && assumptions[0].description === "" && (assumptions[0].id.startsWith("assump-default") || assumptions[0].id.startsWith("assump-1"))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dependencies Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Project Dependencies</CardTitle>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addDependency}
                >
                    <Plus className="h-4 w-4 mr-1" /> Add Dependency
                </Button>
                <AiSuggestionIcon
                    field="dependencies" // Changed from dependencies_bulk
                    currentValue={getCurrentDependenciesContext()}
                    onSuggestionApplied={handleAiAddDependencies}
                />
            </div>
          </div>
          <CardDescription>List external dependencies for the project. These are general dependencies, distinct from those tied to specific requirements.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dependencies.map((dependency, index) => (
                <TableRow key={dependency.id}>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <Textarea
                        placeholder="Dependency description"
                        value={dependency.description}
                        onChange={(e) => updateDependency(index, e.target.value)}
                        className="min-h-[60px] flex-grow"
                        rows={2}
                      />
                      <AiSuggestionIcon
                        field="dependencies" // Changed from dependency_item
                        currentValue={dependency.description}
                        onSuggestionApplied={(suggestion) => updateDependency(index, suggestion)}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center align-top pt-5"> {/* Align button to top */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDependency(index)}
                      disabled={dependencies.length === 1 && dependencies[0].description === "" && (dependencies[0].id.startsWith("dep-default") || dependencies[0].id.startsWith("dep-1"))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Custom Sections */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Custom Proposal Sections</CardTitle>
            <CardDescription>Add or organize additional content for your proposal document.</CardDescription>
          </div>
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowSectionMenu(!showSectionMenu)}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" /> Add Section Component
            </Button>
            {showSectionMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-popover border z-10">
                <div className="py-1">
                  {(['title', 'agenda', 'summary', 'diagram', 'assumption', 'dependency', 'requirement'] as SectionItem['type'][]).map((type) => (
                    <button
                      key={type}
                      onClick={() => addSection(type)}
                      className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-accent"
                    >
                      {getSectionIcon(type)}
                      <span className="ml-2">{getSectionTitle(type)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {sections.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No custom sections added yet.</p>
              <p className="text-sm">Click "Add Section Component" to create your first section.</p>
            </div>
          ) : (
            sections.map((section, index) => (
              <div key={section.id} className="mb-6 border rounded-lg p-4 relative group">
                {renderSectionContent(section, index)}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Requirements;
