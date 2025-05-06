
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface RequirementsProps {
  onRequirementsChange: (requirements: RequirementItem[]) => void;
  onAssumptionsChange: (assumptions: AssumptionItem[]) => void;
  onDependenciesChange: (dependencies: DependencyItem[]) => void;
}

const Requirements: React.FC<RequirementsProps> = ({ 
  onRequirementsChange, 
  onAssumptionsChange, 
  onDependenciesChange 
}) => {
  const [requirements, setRequirements] = useState<RequirementItem[]>([
    { id: "req-" + Date.now(), description: "", priority: "Medium" }
  ]);
  
  const [assumptions, setAssumptions] = useState<AssumptionItem[]>([
    { id: "assump-" + Date.now(), description: "" }
  ]);
  
  const [dependencies, setDependencies] = useState<DependencyItem[]>([
    { id: "dep-" + Date.now(), description: "" }
  ]);

  // Requirements functions
  const addRequirement = () => {
    const newRequirements = [
      ...requirements,
      { id: "req-" + Date.now(), description: "", priority: "Medium" as const }
    ];
    setRequirements(newRequirements);
    onRequirementsChange(newRequirements);
  };

  const updateRequirement = (id: string, field: keyof RequirementItem, value: string) => {
    const newRequirements = requirements.map(req => {
      if (req.id === id) {
        // Type checking for priority field to ensure it's "High", "Medium", or "Low"
        if (field === "priority" && (value === "High" || value === "Medium" || value === "Low")) {
          return { ...req, [field]: value };
        } else if (field === "priority") {
          return req; // If invalid priority value, don't update
        } else {
          return { ...req, [field]: value };
        }
      }
      return req;
    });
    setRequirements(newRequirements);
    onRequirementsChange(newRequirements);
  };

  const removeRequirement = (id: string) => {
    if (requirements.length > 1) {
      const newRequirements = requirements.filter(req => req.id !== id);
      setRequirements(newRequirements);
      onRequirementsChange(newRequirements);
    }
  };

  // Assumptions functions
  const addAssumption = () => {
    const newAssumptions = [
      ...assumptions,
      { id: "assump-" + Date.now(), description: "" }
    ];
    setAssumptions(newAssumptions);
    onAssumptionsChange(newAssumptions);
  };

  const updateAssumption = (id: string, value: string) => {
    const newAssumptions = assumptions.map(assumption => {
      if (assumption.id === id) {
        return { ...assumption, description: value };
      }
      return assumption;
    });
    setAssumptions(newAssumptions);
    onAssumptionsChange(newAssumptions);
  };

  const removeAssumption = (id: string) => {
    if (assumptions.length > 1) {
      const newAssumptions = assumptions.filter(assumption => assumption.id !== id);
      setAssumptions(newAssumptions);
      onAssumptionsChange(newAssumptions);
    }
  };

  // Dependencies functions
  const addDependency = () => {
    const newDependencies = [
      ...dependencies,
      { id: "dep-" + Date.now(), description: "" }
    ];
    setDependencies(newDependencies);
    onDependenciesChange(newDependencies);
  };

  const updateDependency = (id: string, value: string) => {
    const newDependencies = dependencies.map(dependency => {
      if (dependency.id === id) {
        return { ...dependency, description: value };
      }
      return dependency;
    });
    setDependencies(newDependencies);
    onDependenciesChange(newDependencies);
  };

  const removeDependency = (id: string) => {
    if (dependencies.length > 1) {
      const newDependencies = dependencies.filter(dependency => dependency.id !== id);
      setDependencies(newDependencies);
      onDependenciesChange(newDependencies);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Project Requirements</CardTitle>
          <CardDescription>
            Define the requirements, assumptions, and dependencies for your project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="requirements">
            <TabsList className="mb-4">
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
              <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
            </TabsList>
            
            <TabsContent value="requirements" className="mt-0">
              <div className="space-y-4">
                {requirements.map((requirement, index) => (
                  <div key={requirement.id} className="grid grid-cols-12 gap-4">
                    <div className="col-span-8 sm:col-span-9">
                      <Label htmlFor={`req-${requirement.id}`} className="mb-2 block">
                        Requirement {index + 1}
                      </Label>
                      <Textarea
                        id={`req-${requirement.id}`}
                        placeholder="Describe the requirement"
                        value={requirement.description}
                        onChange={(e) => updateRequirement(requirement.id, "description", e.target.value)}
                      />
                    </div>
                    <div className="col-span-3 sm:col-span-2">
                      <Label htmlFor={`priority-${requirement.id}`} className="mb-2 block">
                        Priority
                      </Label>
                      <select
                        id={`priority-${requirement.id}`}
                        className="w-full border-input bg-background px-3 py-2 text-sm rounded-md"
                        value={requirement.priority}
                        onChange={(e) => updateRequirement(
                          requirement.id, 
                          "priority", 
                          e.target.value
                        )}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div className="col-span-1 flex items-end justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRequirement(requirement.id)}
                        disabled={requirements.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addRequirement} className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" /> Add Requirement
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="assumptions" className="mt-0">
              <div className="space-y-4">
                {assumptions.map((assumption, index) => (
                  <div key={assumption.id} className="grid grid-cols-12 gap-4">
                    <div className="col-span-11">
                      <Label htmlFor={`assump-${assumption.id}`} className="mb-2 block">
                        Assumption {index + 1}
                      </Label>
                      <Textarea
                        id={`assump-${assumption.id}`}
                        placeholder="Describe the assumption"
                        value={assumption.description}
                        onChange={(e) => updateAssumption(assumption.id, e.target.value)}
                      />
                    </div>
                    <div className="col-span-1 flex items-end justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAssumption(assumption.id)}
                        disabled={assumptions.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addAssumption} className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" /> Add Assumption
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="dependencies" className="mt-0">
              <div className="space-y-4">
                {dependencies.map((dependency, index) => (
                  <div key={dependency.id} className="grid grid-cols-12 gap-4">
                    <div className="col-span-11">
                      <Label htmlFor={`dep-${dependency.id}`} className="mb-2 block">
                        Dependency {index + 1}
                      </Label>
                      <Textarea
                        id={`dep-${dependency.id}`}
                        placeholder="Describe the dependency"
                        value={dependency.description}
                        onChange={(e) => updateDependency(dependency.id, e.target.value)}
                      />
                    </div>
                    <div className="col-span-1 flex items-end justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDependency(dependency.id)}
                        disabled={dependencies.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addDependency} className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" /> Add Dependency
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Requirements;
