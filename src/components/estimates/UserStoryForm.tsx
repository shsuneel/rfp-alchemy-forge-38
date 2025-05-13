
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserStory } from "@/store/estimatesSlice";
import { Plus } from "lucide-react";

interface UserStoryFormProps {
  onAdd: (story: UserStory) => void;
}

const UserStoryForm: React.FC<UserStoryFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assumptions, setAssumptions] = useState('');
  const [uiComplexity, setUiComplexity] = useState<"Low" | "Medium" | "High">("Medium");
  const [middlewareComplexity, setMiddlewareComplexity] = useState<"Low" | "Medium" | "High">("Medium");
  const [businessLogicComplexity, setBusinessLogicComplexity] = useState<"Low" | "Medium" | "High">("Medium");
  const [integrationComplexity, setIntegrationComplexity] = useState<"Low" | "Medium" | "High">("Medium");
  const [effortDays, setEffortDays] = useState(1);

  // Calculate effort based on complexity selections
  const calculateEffort = (): number => {
    // Simple calculation logic - can be replaced with API call in a real implementation
    const complexityValues = {
      "Low": 1,
      "Medium": 2,
      "High": 3
    };
    
    const uiValue = complexityValues[uiComplexity];
    const middlewareValue = complexityValues[middlewareComplexity];
    const businessValue = complexityValues[businessLogicComplexity];
    const integrationValue = complexityValues[integrationComplexity];
    
    // Base calculation formula - adjust as needed
    return (uiValue * 0.5) + (middlewareValue * 0.7) + (businessValue * 1) + (integrationValue * 1.2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate final effort based on complexity values
    const calculatedEffort = calculateEffort();
    
    const newStory: UserStory = {
      id: `story-${Date.now()}`,
      title,
      description,
      assumptions,
      complexity: {
        ui: uiComplexity,
        middleware: middlewareComplexity,
        businessLogic: businessLogicComplexity,
        integration: integrationComplexity
      },
      effortDays: calculatedEffort
    };
    
    onAdd(newStory);
    
    // Reset form
    setTitle('');
    setDescription('');
    setAssumptions('');
    setUiComplexity("Medium");
    setMiddlewareComplexity("Medium");
    setBusinessLogicComplexity("Medium");
    setIntegrationComplexity("Medium");
    setEffortDays(1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="User story title"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="As a [user], I want to [action] so that [benefit]"
          rows={3}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="assumptions">Assumptions</Label>
        <Textarea 
          id="assumptions" 
          value={assumptions}
          onChange={(e) => setAssumptions(e.target.value)}
          placeholder="List any assumptions for this user story"
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="uiComplexity">UI Complexity</Label>
          <Select 
            value={uiComplexity} 
            onValueChange={(value) => setUiComplexity(value as "Low" | "Medium" | "High")}
          >
            <SelectTrigger id="uiComplexity">
              <SelectValue placeholder="Select UI complexity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="middlewareComplexity">Middleware Complexity</Label>
          <Select 
            value={middlewareComplexity} 
            onValueChange={(value) => setMiddlewareComplexity(value as "Low" | "Medium" | "High")}
          >
            <SelectTrigger id="middlewareComplexity">
              <SelectValue placeholder="Select middleware complexity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="businessLogicComplexity">Business Logic Complexity</Label>
          <Select 
            value={businessLogicComplexity} 
            onValueChange={(value) => setBusinessLogicComplexity(value as "Low" | "Medium" | "High")}
          >
            <SelectTrigger id="businessLogicComplexity">
              <SelectValue placeholder="Select business logic complexity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="integrationComplexity">Integration Complexity</Label>
          <Select 
            value={integrationComplexity} 
            onValueChange={(value) => setIntegrationComplexity(value as "Low" | "Medium" | "High")}
          >
            <SelectTrigger id="integrationComplexity">
              <SelectValue placeholder="Select integration complexity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="effort">Calculated Effort (days)</Label>
        <Input 
          id="effort" 
          type="number"
          min="0.5"
          step="0.5"
          value={calculateEffort()}
          readOnly
          className="bg-gray-50"
        />
      </div>
      
      <Button type="submit" className="w-full flex items-center">
        <Plus className="h-4 w-4 mr-2" /> Add User Story
      </Button>
    </form>
  );
};

export default UserStoryForm;
