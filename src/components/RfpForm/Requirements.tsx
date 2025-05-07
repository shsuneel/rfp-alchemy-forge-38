
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { RequirementItem, AssumptionItem, DependencyItem } from "@/store/rfpSlice"; 

interface RequirementsProps {
  onRequirementsChange: (requirements: RequirementItem[]) => void;
  onAssumptionsChange: (assumptions: AssumptionItem[]) => void;
  onDependenciesChange: (dependencies: DependencyItem[]) => void;
  initialRequirements?: RequirementItem[];
  initialAssumptions?: AssumptionItem[];
  initialDependencies?: DependencyItem[];
}

const Requirements = ({
  onRequirementsChange,
  onAssumptionsChange,
  onDependenciesChange,
  initialRequirements = [{ id: "req-1", description: "", priority: "Medium" }],
  initialAssumptions = [{ id: "assump-1", description: "" }],
  initialDependencies = [{ id: "dep-1", description: "" }]
}: RequirementsProps) => {
  const [requirements, setRequirements] = useState<RequirementItem[]>(initialRequirements);
  const [assumptions, setAssumptions] = useState<AssumptionItem[]>(initialAssumptions);
  const [dependencies, setDependencies] = useState<DependencyItem[]>(initialDependencies);

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
  }, [initialRequirements, initialAssumptions, initialDependencies]);

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

  return (
    <div className="space-y-8">
      {/* Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Project Requirements</CardTitle>
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
          <CardTitle>Assumptions</CardTitle>
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
          <CardTitle>Dependencies</CardTitle>
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
    </div>
  );
};

export default Requirements;
