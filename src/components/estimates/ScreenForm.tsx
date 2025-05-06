
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Screen } from "@/store/estimatesSlice";
import { Plus } from "lucide-react";

interface ScreenFormProps {
  onAdd: (screen: Screen) => void;
}

const ScreenForm: React.FC<ScreenFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [complexity, setComplexity] = useState<"Low" | "Medium" | "High">("Medium");
  const [effortDays, setEffortDays] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newScreen: Screen = {
      id: `screen-${Date.now()}`,
      name,
      description,
      complexity,
      effortDays: Number(effortDays)
    };
    
    onAdd(newScreen);
    
    // Reset form
    setName('');
    setDescription('');
    setComplexity("Medium");
    setEffortDays(1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Screen Name</Label>
          <Input 
            id="name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Screen name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="complexity">Complexity</Label>
          <Select 
            value={complexity} 
            onValueChange={(value) => setComplexity(value as "Low" | "Medium" | "High")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select complexity" />
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
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe screen features and functionality"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="effort">Effort (days)</Label>
        <Input 
          id="effort" 
          type="number"
          min="0.5"
          step="0.5"
          value={effortDays}
          onChange={(e) => setEffortDays(Number(e.target.value))}
        />
      </div>
      
      <Button type="submit" className="w-full flex items-center">
        <Plus className="h-4 w-4 mr-2" /> Add Screen
      </Button>
    </form>
  );
};

export default ScreenForm;
