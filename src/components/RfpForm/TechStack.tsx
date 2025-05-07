
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const COMMON_TECHNOLOGIES = [
  "React", "Angular", "Vue", "Next.js", "Node.js", "Express", 
  "Django", "Flask", "Spring Boot", "Laravel", "Ruby on Rails",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "AWS", "Azure", "GCP",
  "Docker", "Kubernetes", "GraphQL", "REST", "TypeScript", "Python", "Java"
];

interface TechStackProps {
  onTechStackChange: (techStack: string[]) => void;
  techStack?: string[];
}

const TechStack = ({ onTechStackChange, techStack = [] }: TechStackProps) => {
  const [selectedTech, setSelectedTech] = useState<string[]>(techStack);
  const [newTech, setNewTech] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Update local state when props change
  useEffect(() => {
    if (techStack) {
      setSelectedTech(techStack);
    }
  }, [techStack]);

  // Update parent component when local state changes
  useEffect(() => {
    onTechStackChange(selectedTech);
  }, [selectedTech, onTechStackChange]);

  const addTechnology = () => {
    if (newTech.trim() && !selectedTech.includes(newTech.trim())) {
      setSelectedTech([...selectedTech, newTech.trim()]);
      setNewTech("");
      setSuggestions([]);
    }
  };

  const removeTechnology = (tech: string) => {
    setSelectedTech(selectedTech.filter(t => t !== tech));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewTech(value);
    
    if (value.trim()) {
      const filtered = COMMON_TECHNOLOGIES.filter(
        tech => tech.toLowerCase().includes(value.toLowerCase()) && !selectedTech.includes(tech)
      );
      setSuggestions(filtered.slice(0, 6));
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (tech: string) => {
    if (!selectedTech.includes(tech)) {
      setSelectedTech([...selectedTech, tech]);
      setNewTech("");
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technology Stack</CardTitle>
        <CardDescription>
          Select or enter the technologies that will be used in the project
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Add a technology or framework"
                value={newTech}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              {suggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-md">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-accent cursor-pointer"
                      onClick={() => selectSuggestion(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button type="button" onClick={addTechnology}>Add</Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {selectedTech.map((tech, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                {tech}
                <button
                  type="button"
                  onClick={() => removeTechnology(tech)}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {tech}</span>
                </button>
              </Badge>
            ))}
            {selectedTech.length === 0 && (
              <p className="text-sm text-muted-foreground">No technologies selected yet.</p>
            )}
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Common Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {COMMON_TECHNOLOGIES.filter(tech => !selectedTech.includes(tech))
                .slice(0, 12)
                .map((tech, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => selectSuggestion(tech)}
                  >
                    {tech}
                  </Badge>
                ))
              }
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechStack;
