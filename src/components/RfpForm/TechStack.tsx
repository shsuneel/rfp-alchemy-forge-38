
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Database, Layout, Server, Cloud, Code, X } from "lucide-react";

// Define technology categories by layer
const TECHNOLOGIES_BY_LAYER = {
  frontend: [
    "React", "Angular", "Vue", "Next.js", "Svelte", "TypeScript",
    "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Material UI",
    "Bootstrap", "Redux", "MobX", "SASS/SCSS"
  ],
  backend: [
    "Node.js", "Express", "Django", "Flask", "Spring Boot",
    "Laravel", "Ruby on Rails", "ASP.NET Core", "Java", "Python", 
    "C#", "GraphQL", "REST", "gRPC", "PHP", "Go"
  ],
  database: [
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Firebase", 
    "DynamoDB", "Oracle", "MS SQL Server", "SQLite", "Cassandra",
    "Neo4j", "Elasticsearch"
  ],
  infrastructure: [
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", 
    "Terraform", "Serverless", "GitHub Actions", "Jenkins",
    "CircleCI", "Travis CI", "Nginx", "Apache"
  ],
  other: [
    "Git", "Jira", "Confluence", "Slack", "Notion",
    "Figma", "Adobe XD", "WebSockets", "OAuth", "JWT"
  ]
};

interface TechStackByLayer {
  frontend: string[];
  backend: string[];
  database: string[];
  infrastructure: string[];
  other: string[];
}

interface TechStackProps {
  onTechStackChange: (techStack: TechStackByLayer) => void;
  techStackByLayer?: TechStackByLayer;
}

const TechStack = ({ 
  onTechStackChange, 
  techStackByLayer = { frontend: [], backend: [], database: [], infrastructure: [], other: [] }
}: TechStackProps) => {
  const [activeTab, setActiveTab] = useState("frontend");
  const [newTech, setNewTech] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [techStack, setTechStack] = useState<TechStackByLayer>({
    frontend: techStackByLayer.frontend || [],
    backend: techStackByLayer.backend || [],
    database: techStackByLayer.database || [],
    infrastructure: techStackByLayer.infrastructure || [],
    other: techStackByLayer.other || [],
  });

  // Update local state when props change
  useEffect(() => {
    if (techStackByLayer) {
      setTechStack({
        frontend: techStackByLayer.frontend || [],
        backend: techStackByLayer.backend || [],
        database: techStackByLayer.database || [],
        infrastructure: techStackByLayer.infrastructure || [],
        other: techStackByLayer.other || [],
      });
    }
  }, [techStackByLayer]);

  // Update parent component when local state changes
  useEffect(() => {
    onTechStackChange(techStack);
  }, [techStack, onTechStackChange]);

  const getCurrentLayerTech = () => {
    return techStack[activeTab as keyof TechStackByLayer];
  };

  const addTechnology = () => {
    if (newTech.trim() && !getCurrentLayerTech().includes(newTech.trim())) {
      const updatedTechStack = {
        ...techStack,
        [activeTab]: [...techStack[activeTab as keyof TechStackByLayer], newTech.trim()],
      };
      setTechStack(updatedTechStack);
      setNewTech("");
      setSuggestions([]);
    }
  };

  const removeTechnology = (tech: string) => {
    const updatedTechStack = {
      ...techStack,
      [activeTab]: techStack[activeTab as keyof TechStackByLayer].filter(t => t !== tech),
    };
    setTechStack(updatedTechStack);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewTech(value);
    
    if (value.trim()) {
      const currentLayerTech = getCurrentLayerTech();
      const techSuggestions = TECHNOLOGIES_BY_LAYER[activeTab as keyof typeof TECHNOLOGIES_BY_LAYER] || [];
      
      const filtered = techSuggestions.filter(
        tech => tech.toLowerCase().includes(value.toLowerCase()) && !currentLayerTech.includes(tech)
      );
      setSuggestions(filtered.slice(0, 6));
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (tech: string) => {
    const currentLayerTech = getCurrentLayerTech();
    if (!currentLayerTech.includes(tech)) {
      const updatedTechStack = {
        ...techStack,
        [activeTab]: [...techStack[activeTab as keyof TechStackByLayer], tech],
      };
      setTechStack(updatedTechStack);
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

  const getTabIcon = (tabName: string) => {
    switch (tabName) {
      case 'frontend': return <Layout className="h-4 w-4" />;
      case 'backend': return <Server className="h-4 w-4" />;
      case 'database': return <Database className="h-4 w-4" />;
      case 'infrastructure': return <Cloud className="h-4 w-4" />;
      case 'other': return <Code className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
    }
  };

  const getTotalSelectedCount = () => {
    return Object.values(techStack).reduce((sum, arr) => sum + arr.length, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technology Stack</CardTitle>
        <CardDescription>
          Select or enter the technologies that will be used in the project, organized by layer
          {getTotalSelectedCount() > 0 && (
            <span className="ml-2 text-sm font-medium">
              ({getTotalSelectedCount()} selected)
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="frontend" className="flex items-center gap-2">
              <Layout className="h-4 w-4" /> Frontend
              {techStack.frontend.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">{techStack.frontend.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="backend" className="flex items-center gap-2">
              <Server className="h-4 w-4" /> Backend
              {techStack.backend.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">{techStack.backend.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" /> Database
              {techStack.database.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">{techStack.database.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="infrastructure" className="flex items-center gap-2">
              <Cloud className="h-4 w-4" /> Infrastructure
              {techStack.infrastructure.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">{techStack.infrastructure.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="other" className="flex items-center gap-2">
              <Code className="h-4 w-4" /> Other
              {techStack.other.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">{techStack.other.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          {/* The content for each tab is similar, so we'll use the same rendering */}
          {Object.keys(techStack).map((layer) => (
            <TabsContent key={layer} value={layer} className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  {layer === activeTab && (
                    <Input
                      placeholder={`Add a ${layer} technology or framework`}
                      value={newTech}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                    />
                  )}
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
                {layer === activeTab && (
                  <Button type="button" onClick={addTechnology}>Add</Button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {techStack[layer as keyof TechStackByLayer].map((tech, index) => (
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
                {techStack[layer as keyof TechStackByLayer].length === 0 && (
                  <p className="text-sm text-muted-foreground">No {layer} technologies selected yet.</p>
                )}
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Common {layer.charAt(0).toUpperCase() + layer.slice(1)} Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {TECHNOLOGIES_BY_LAYER[layer as keyof typeof TECHNOLOGIES_BY_LAYER]
                    .filter(tech => !techStack[layer as keyof TechStackByLayer].includes(tech))
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
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TechStack;
