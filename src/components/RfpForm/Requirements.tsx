import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  initialRequirements = [{ id: "req-1", description: "", priority: "Medium" }],
  initialAssumptions = [{ id: "assump-1", description: "" }],
  initialDependencies = [{ id: "dep-1", description: "" }],
  initialSections = []
}: RequirementsProps) => {
  const [requirements, setRequirements] = useState<RequirementItem[]>(initialRequirements);
  const [assumptions, setAssumptions] = useState<AssumptionItem[]>(initialAssumptions);
  const [dependencies, setDependencies] = useState<DependencyItem[]>(initialDependencies);
  const [sections, setSections] = useState<SectionItem[]>(initialSections);
  const [showSectionMenu, setShowSectionMenu] = useState(false);

  // Use useEffect to update local state when props change
  useEffect(() => {
    if (initialRequirements) {
      setRequirements(initialRequirements);
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

  // Requirements handling
  const addRequirement = () => {
    setRequirements([
      ...requirements,
      { id: `req-${Date.now()}`, description: "", priority: "Medium" }
    ]);
  };

  const updateRequirement = (index: number, field: keyof RequirementItem, value: any) => {
    const newRequirements = [...requirements];
    newRequirements[index] = { ...newRequirements[index], [field]: value };
    setRequirements(newRequirements);
  };

  const removeRequirement = (index: number) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter((_, i) => i !== index));
    }
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
    if (assumptions.length > 1) {
      setAssumptions(assumptions.filter((_, i) => i !== index));
    }
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
    if (dependencies.length > 1) {
      setDependencies(dependencies.filter((_, i) => i !== index));
    }
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
  

  // Render section based on type
  const renderSectionContent = (section: SectionItem, index: number) => {
    return (
      <div>
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 font-medium">
              <span>Section Title</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeSection(index)}
            >
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

        <div className="space-y-2">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 font-medium">
              <Label>Agenda</Label>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeSection(index)}
            >
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

        <div className="space-y-2">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 font-medium">
              <Label>Summary</Label>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeSection(index)}
            >
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

        <div className="space-y-2">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 font-medium">
              <Label>Diagram</Label>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeSection(index)}
            >
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
                  updateSection(index, 'content', file.name);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          {section.imageUrl && (
            <div className="mt-2">
              <img
                src={section.imageUrl}
                alt="Diagram"
                className="max-w-full h-auto border rounded"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 font-medium">
              <Label>Assumption</Label>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeSection(index)}
            >
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

        <div className="space-y-2">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 font-medium">
              <Label>Dependency</Label>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeSection(index)}
            >
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

        <div className="space-y-2">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 font-medium">
              <Label>Requirement</Label>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeSection(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            value={section.content}
            onChange={(e) => updateSection(index, 'content', e.target.value)}
            placeholder="Enter requirement"
            rows={3}
            className="mb-2"
          />
          <div className="flex items-center">
            <Label htmlFor={`priority-${index}`} className="mr-2">Priority:</Label>
            <Select
              value={section.priority || "Medium"}
              onValueChange={(value) => updateSection(index, 'priority', value)}
            >
              <SelectTrigger id={`priority-${index}`} className="w-32">
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
      </div>
    );

  };

  const getSectionIcon = (type: SectionItem['type']) => {
    switch (type) {
      case 'title': return <Heading className="h-4 w-4" />;
      case 'agenda': return <FileText className="h-4 w-4" />;
      case 'summary': return <FileText className="h-4 w-4" />;
      case 'diagram': return <FileImage className="h-4 w-4" />;
      case 'assumption': return <FileMinus className="h-4 w-4" />;
      case 'dependency': return <FilePlus className="h-4 w-4" />;
      case 'requirement': return <FileText className="h-4 w-4" />;
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
            <AiSuggestionIcon 
              field="requirements"
              onSuggestionApplied={(suggestion) => {
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
                setRequirements(newRequirements);
              }}
            />
          </div>
          <CardDescription>Define the key requirements for your project</CardDescription>
        </CardHeader>
        <CardContent>
          {requirements.map((req, index) => (
            <div key={req.id} className="flex gap-2 items-start mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Requirement description"
                  value={req.description}
                  onChange={(e) => updateRequirement(index, "description", e.target.value)}
                  className="mb-2"
                />
                <div className="flex items-center">
                  <Label htmlFor={`priority-${index}`} className="mr-2">Priority:</Label>
                  <Select
                    value={req.priority}
                    onValueChange={(value) => updateRequirement(index, "priority", value as "High" | "Medium" | "Low")}
                  >
                    <SelectTrigger id={`priority-${index}`} className="w-32">
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeRequirement(index)}
                disabled={requirements.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRequirement}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Requirement
          </Button>
        </CardContent>
      </Card>

      {/* Assumptions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Assumptions</CardTitle>
            <AiSuggestionIcon 
              field="assumptions"
              onSuggestionApplied={(suggestion) => {
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
                setAssumptions(newAssumptions);
              }}
            />
          </div>
          <CardDescription>List key assumptions for the project</CardDescription>
        </CardHeader>
        <CardContent>
          {assumptions.map((assumption, index) => (
            <div key={assumption.id} className="flex gap-2 items-center mb-4">
              <Input
                placeholder="Assumption description"
                value={assumption.description}
                onChange={(e) => updateAssumption(index, e.target.value)}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeAssumption(index)}
                disabled={assumptions.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAssumption}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Assumption
          </Button>
        </CardContent>
      </Card>

      {/* Dependencies */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Dependencies</CardTitle>
            <AiSuggestionIcon 
              field="dependencies"
              onSuggestionApplied={(suggestion) => {
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
                setDependencies(newDependencies);
              }}
            />
          </div>
          <CardDescription>List external dependencies for the project</CardDescription>
        </CardHeader>
        <CardContent>
          {dependencies.map((dependency, index) => (
            <div key={dependency.id} className="flex gap-2 items-center mb-4">
              <Input
                placeholder="Dependency description"
                value={dependency.description}
                onChange={(e) => updateDependency(index, e.target.value)}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeDependency(index)}
                disabled={dependencies.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addDependency}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Dependency
          </Button>
        </CardContent>
      </Card>
      
      {/* Custom Sections */}
      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Custom Sections</CardTitle>
            <CardDescription>Your added content sections</CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={() => addSection("title")}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" /> Add Section
          </Button>
        </CardHeader>
        <CardContent>
          {sections.length === 0 && !showSectionMenu && (
            <div className="text-center py-8 text-gray-500">
              <p>No custom sections added yet.</p>
              <p className="text-sm">Click "Add Section" to create your first section.</p>
            </div>
          )}

          {sections.map((section, index) => (
            <div key={section.id} className="mb-6 border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 font-medium">
                  {'Section: ' + (index + 1)}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSection(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {renderSectionContent(section, index)}
            </div>
          ))}
        </CardContent>
      </Card> */}

      
    </div>
  );
};

export default Requirements;
