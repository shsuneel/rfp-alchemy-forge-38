
import { useState, useEffect } from "react";
import { X, Plus, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { v4 as uuidv4 } from "@reduxjs/toolkit";
import { ResourceLevel } from "@/store/rfpSlice";

interface ResourcesProps {
  onResourcesChange: (resources: ResourceLevel[]) => void;
  initialResources: ResourceLevel[];
}

const LEVELS = ["Junior", "Mid", "Senior", "Lead"] as const;

const Resources = ({ onResourcesChange, initialResources }: ResourcesProps) => {
  const [resources, setResources] = useState<ResourceLevel[]>(initialResources);
  
  useEffect(() => {
    if (initialResources) {
      setResources(initialResources);
    }
  }, [initialResources]);
  
  const handleAddResource = () => {
    const newResource: ResourceLevel = {
      id: uuidv4(),
      title: "",
      level: "Mid",
      hourlyRate: 100
    };
    
    const newResources = [...resources, newResource];
    setResources(newResources);
    onResourcesChange(newResources);
  };
  
  const handleRemoveResource = (id: string) => {
    const newResources = resources.filter(resource => resource.id !== id);
    setResources(newResources);
    onResourcesChange(newResources);
  };
  
  const handleResourceChange = (id: string, field: keyof ResourceLevel, value: string | number) => {
    const newResources = resources.map(resource => 
      resource.id === id ? { ...resource, [field]: value } : resource
    );
    
    setResources(newResources);
    onResourcesChange(newResources);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Resource Levels
        </CardTitle>
        <CardDescription>
          Define the resource levels and hourly rates for the project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Resources</Label>
            <Button 
              type="button" 
              size="sm"
              variant="outline" 
              onClick={handleAddResource}
              className="flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> Add Resource
            </Button>
          </div>
          
          {resources.map((resource, index) => (
            <div key={resource.id} className="p-3 border rounded-md relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-6 w-6"
                onClick={() => handleRemoveResource(resource.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="grid gap-3">
                <div>
                  <Label htmlFor={`resource-title-${index}`}>Title</Label>
                  <Input
                    id={`resource-title-${index}`}
                    value={resource.title}
                    onChange={(e) => handleResourceChange(resource.id, 'title', e.target.value)}
                    placeholder="e.g., Senior Consultant"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`resource-level-${index}`}>Level</Label>
                  <Select
                    value={resource.level}
                    onValueChange={(value) => handleResourceChange(
                      resource.id, 
                      'level', 
                      value as "Junior" | "Mid" | "Senior" | "Lead"
                    )}
                  >
                    <SelectTrigger id={`resource-level-${index}`} className="mt-1">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVELS.map(level => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor={`resource-rate-${index}`}>Hourly Rate ($)</Label>
                  <Input
                    id={`resource-rate-${index}`}
                    value={resource.hourlyRate}
                    onChange={(e) => handleResourceChange(
                      resource.id, 
                      'hourlyRate',
                      Number(e.target.value) || 0
                    )}
                    type="number"
                    min="0"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Resources;
