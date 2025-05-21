
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Layout, Server, Database, Cloud, Code, X, Sparkles, 
  BarChart3, GitMerge, ShieldCheck, ClipboardCheck // Added new icons
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import AiSuggestionIcon from "@/components/ui/AiSuggestionIcon"; // Import AiSuggestionIcon

// Define technology categories by layer
const TECHNOLOGIES_BY_LAYER = {
  frontend: [
    "React", "Angular", "Vue", "Next.js", "Svelte", "TypeScript",
    "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Material UI",
    "Bootstrap", "Redux", "MobX", "SASS/SCSS", "jQuery", "Ember.js"
  ],
  backend: [
    "Node.js", "Express", "Django", "Flask", "Spring Boot",
    "Laravel", "Ruby on Rails", "ASP.NET Core", "Java", "Python", 
    "C#", "GraphQL", "REST", "gRPC", "PHP", "Go", "Kotlin", "Scala"
  ],
  database: [
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Firebase Realtime Database", "Firestore",
    "DynamoDB", "Oracle", "MS SQL Server", "SQLite", "Cassandra",
    "Neo4j", "Elasticsearch", "MariaDB", "Couchbase"
  ],
  infrastructure: [
    "AWS", "Azure", "GCP", "DigitalOcean", "Heroku", "Netlify", "Vercel",
    "Nginx", "Apache HTTP Server", "Serverless Framework", "OpenStack", "VMware"
  ],
  analyticsAndReporting: [ // New Category
    "Tableau", "Power BI", "Google Analytics", "Mixpanel", "Looker", "Qlik Sense",
    "Grafana", "Prometheus", "Kibana", "Segment", "Amplitude"
  ],
  devops: [ // New Category
    "Docker", "Kubernetes", "Terraform", "Ansible", "Puppet", "Chef", 
    "Jenkins", "GitLab CI/CD", "GitHub Actions", "CircleCI", "Travis CI", 
    "ArgoCD", "Spinnaker", "Helm"
  ],
  security: [ // New Category
    "OAuth2", "OpenID Connect", "SAML", "JWT", "Snyk", "Veracode", "SonarQube",
    "HashiCorp Vault", "CyberArk", "Okta", "Auth0", "Keycloak", "SSL/TLS"
  ],
  testing: [ // New Category
    "Jest", "Mocha", "Chai", "Cypress", "Selenium", "Playwright", "Appium",
    "JUnit", "TestNG", "PyTest", "Postman", "Storybook", "BrowserStack", "Sauce Labs"
  ],
  other: [
    "Git", "Jira", "Confluence", "Slack", "Notion", "Trello",
    "Figma", "Adobe XD", "Sketch", "WebSockets", "Apache Kafka", "RabbitMQ",
    "Stripe API", "PayPal API", "Twilio API"
  ]
};

interface TechStackByLayer {
  frontend: string[];
  backend: string[];
  database: string[];
  infrastructure: string[];
  analyticsAndReporting: string[]; // New
  devops: string[]; // New
  security: string[]; // New
  testing: string[]; // New
  other: string[];
}

interface TechStackProps {
  onTechStackChange: (techStack: TechStackByLayer) => void;
  techStackByLayer?: TechStackByLayer;
  projectDescription?: string; // For AI suggestion context
}

const TechStack = ({ 
  onTechStackChange, 
  techStackByLayer = { 
    frontend: [], backend: [], database: [], infrastructure: [], 
    analyticsAndReporting: [], devops: [], security: [], testing: [], // Initialize new
    other: [] 
  },
  projectDescription
}: TechStackProps) => {
  const [activeTab, setActiveTab] = useState("frontend");
  const [newTech, setNewTech] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [techStack, setTechStack] = useState<TechStackByLayer>({
    frontend: techStackByLayer.frontend || [],
    backend: techStackByLayer.backend || [],
    database: techStackByLayer.database || [],
    infrastructure: techStackByLayer.infrastructure || [],
    analyticsAndReporting: techStackByLayer.analyticsAndReporting || [], // New
    devops: techStackByLayer.devops || [], // New
    security: techStackByLayer.security || [], // New
    testing: techStackByLayer.testing || [], // New
    other: techStackByLayer.other || [],
  });
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [showAiSuggestionBox, setShowAiSuggestionBox] = useState(false);

  // Update local state when props change
  useEffect(() => {
    if (techStackByLayer) {
      setTechStack({
        frontend: techStackByLayer.frontend || [],
        backend: techStackByLayer.backend || [],
        database: techStackByLayer.database || [],
        infrastructure: techStackByLayer.infrastructure || [],
        analyticsAndReporting: techStackByLayer.analyticsAndReporting || [],
        devops: techStackByLayer.devops || [],
        security: techStackByLayer.security || [],
        testing: techStackByLayer.testing || [],
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

  const removeTechnology = (tech: string, layer: keyof TechStackByLayer) => {
    const updatedTechStack = {
      ...techStack,
      [layer]: techStack[layer].filter(t => t !== tech),
    };
    setTechStack(updatedTechStack);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewTech(value);
    
    if (value.trim()) {
      const currentLayerTech = getCurrentLayerTech();
      const techSuggestionsList = TECHNOLOGIES_BY_LAYER[activeTab as keyof typeof TECHNOLOGIES_BY_LAYER] || [];
      
      const filtered = techSuggestionsList.filter(
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
      case 'analyticsAndReporting': return <BarChart3 className="h-4 w-4" />;
      case 'devops': return <GitMerge className="h-4 w-4" />;
      case 'security': return <ShieldCheck className="h-4 w-4" />;
      case 'testing': return <ClipboardCheck className="h-4 w-4" />;
      case 'other': return <Code className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
    }
  };

  const getTotalSelectedCount = () => {
    return Object.values(techStack).reduce((sum, arr) => sum + arr.length, 0);
  };

  const toggleAiSuggestionBox = () => {
    setShowAiSuggestionBox(!showAiSuggestionBox);
  };
  
  const processAndApplyAISuggestions = (suggestionText: string) => {
    if (!suggestionText.trim()) return;

    const techList = suggestionText
      .split(/[,\n]+/)
      .map(tech => tech.trim())
      .filter(tech => tech.length > 0);

    const newlyCategorizedTech: TechStackByLayer = {
      frontend: [], backend: [], database: [], infrastructure: [], other: [],
      analyticsAndReporting: [], devops: [], security: [], testing: []
    };

    techList.forEach(tech => {
      let isTechCategorized = false;
      for (const [layer, knownTechnologiesInLayer] of Object.entries(TECHNOLOGIES_BY_LAYER)) {
        if (knownTechnologiesInLayer.some(t => t.toLowerCase() === tech.toLowerCase() || t.toLowerCase().replace(/\s/g, '') === tech.toLowerCase().replace(/\s/g, ''))) {
          const layerKey = layer as keyof TechStackByLayer;
          if (!newlyCategorizedTech[layerKey].includes(tech)) {
            newlyCategorizedTech[layerKey].push(tech);
          }
          isTechCategorized = true;
          break; 
        }
      }
      
      if (!isTechCategorized) {
        if (!newlyCategorizedTech.other.includes(tech)) {
          newlyCategorizedTech.other.push(tech);
        }
      }
    });

    setTechStack(prevTechStack => {
      const updatedTechStack = { ...prevTechStack };
      (Object.keys(newlyCategorizedTech) as Array<keyof TechStackByLayer>).forEach(layer => {
        if (newlyCategorizedTech[layer].length > 0) {
          updatedTechStack[layer] = [
            ...updatedTechStack[layer],
            ...newlyCategorizedTech[layer].filter(item => !updatedTechStack[layer].includes(item))
          ];
        }
      });
      return updatedTechStack;
    });
    
    toast({
      title: "AI Suggestions Applied",
      description: `${techList.length} technologies attempt to be categorized and added. Review selections.`,
    });
    // Do not clear aiSuggestion here if it's from external icon, user might want to see it.
    // If called from internal "Apply Suggestions" button, it's fine.
  };

  // This is for the button within the Textarea box
  const selectAllSuggestionsFromTextArea = () => {
    processAndApplyAISuggestions(aiSuggestion);
  };

  // This is for the AiSuggestionIcon
  const handleExternalAiSuggestionApplied = (suggestionFromIcon: string) => {
    setAiSuggestion(suggestionFromIcon); // Populate the Textarea
    setShowAiSuggestionBox(true); // Show the Textarea container
    processAndApplyAISuggestions(suggestionFromIcon); // Automatically process and apply
  };

  const tabOrder: (keyof TechStackByLayer)[] = [
    "frontend", "backend", "database", "infrastructure", 
    "analyticsAndReporting", "devops", "security", "testing", "other"
  ];


  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          Select or enter the technologies for the project, organized by layer.
          <AiSuggestionIcon
            field="techStack"
            onSuggestionApplied={handleExternalAiSuggestionApplied}
            currentValue={projectDescription + "\n\nExisting Tech: " + Object.values(techStack).flat().filter(t => t).join(', ')}
          />
        </div>
        <CardDescription>
          {getTotalSelectedCount() > 0 && (
            <span className="ml-2 text-sm font-medium">
              ({getTotalSelectedCount()} selected)
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showAiSuggestionBox && (
          <div className="mb-6 border rounded-md p-4 bg-amber-50/50 dark:bg-amber-950/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Sparkles className="h-4 w-4 text-amber-500 mr-2" />
                <h3 className="text-sm font-medium">AI Technology Suggestions</h3>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={toggleAiSuggestionBox}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Paste AI-generated tech stack suggestions here, or use the <Sparkles className="h-3 w-3 inline text-amber-500" /> icon in the header. The system will attempt to categorize them.
            </p>
            <Textarea 
              value={aiSuggestion} 
              onChange={(e) => setAiSuggestion(e.target.value)}
              placeholder="Example: React, Node.js, Express, MongoDB, AWS, Docker, Tableau, Jenkins, Snyk, Cypress"
              className="mb-2 min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={selectAllSuggestionsFromTextArea}
                className="flex items-center gap-1"
                disabled={!aiSuggestion.trim()}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Apply Suggestions from Text Area
              </Button>
            </div>
          </div>
        )}

        {!showAiSuggestionBox && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-4 text-xs flex items-center gap-1"
            onClick={toggleAiSuggestionBox}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Manually Add from AI Suggestions / Review
          </Button>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 mb-4">
            {tabOrder.map(tabKey => (
              <TabsTrigger key={tabKey} value={tabKey} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3">
                {getTabIcon(tabKey)} {tabKey.charAt(0).toUpperCase() + tabKey.slice(1).replace(/([A-Z])/g, ' $1')}
                {techStack[tabKey].length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0.5">{techStack[tabKey].length}</Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {tabOrder.map((layer) => (
            <TabsContent key={layer} value={layer} className="space-y-4">
              {layer === activeTab && (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder={`Add a ${layer.replace(/([A-Z])/g, ' $1').toLowerCase()} technology`}
                      value={newTech}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                    />
                    {suggestions.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.map((suggestionItem, index) => (
                          <div
                            key={index}
                            className="px-3 py-2 hover:bg-accent cursor-pointer text-sm"
                            onClick={() => selectSuggestion(suggestionItem)}
                          >
                            {suggestionItem}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button type="button" onClick={addTechnology} disabled={!newTech.trim()}>Add</Button>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 min-h-[2.5rem]"> {/* Added min-h for consistent spacing */}
                {techStack[layer as keyof TechStackByLayer].map((tech, index) => (
                  <Badge key={`${layer}-${tech}-${index}`} variant="secondary" className="flex items-center gap-1 px-3 py-1 text-sm">
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech, layer as keyof TechStackByLayer)}
                      className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                      aria-label={`Remove ${tech}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {techStack[layer as keyof TechStackByLayer].length === 0 && (
                  <p className="text-sm text-muted-foreground w-full">No {layer.replace(/([A-Z])/g, ' $1').toLowerCase()} technologies selected yet.</p>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">
                  Common {layer.charAt(0).toUpperCase() + layer.slice(1).replace(/([A-Z])/g, ' $1')} Technologies
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {(TECHNOLOGIES_BY_LAYER[layer as keyof typeof TECHNOLOGIES_BY_LAYER] || [])
                    .filter(tech => !techStack[layer as keyof TechStackByLayer].includes(tech))
                    .slice(0, 15) // Show a few more suggestions
                    .map((tech, index) => (
                      <Badge
                        key={`common-${layer}-${tech}-${index}`}
                        variant="outline"
                        className="cursor-pointer hover:bg-accent hover:border-primary text-xs px-2 py-0.5"
                        onClick={() => selectSuggestion(tech)}
                        title={`Add ${tech}`}
                      >
                        {tech}
                      </Badge>
                    ))
                  }
                  {(TECHNOLOGIES_BY_LAYER[layer as keyof typeof TECHNOLOGIES_BY_LAYER] || [])
                    .filter(tech => !techStack[layer as keyof TechStackByLayer].includes(tech))
                    .length === 0 && (
                      <p className="text-xs text-muted-foreground">All common technologies for this layer have been added or are not listed.</p>
                    )
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

