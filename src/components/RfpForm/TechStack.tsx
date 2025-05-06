
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "lucide-react";

interface TechStackProps {
  onTechStackChange: (selectedStack: string[]) => void;
}

const TechStack: React.FC<TechStackProps> = ({ onTechStackChange }) => {
  const techCategories = [
    {
      name: "Frontend",
      technologies: ["React", "Angular", "Vue", "Next.js", "Svelte", "jQuery", "Bootstrap", "Tailwind CSS"]
    },
    {
      name: "Backend",
      technologies: ["Node.js", "Python", "Java", "C#", ".NET", "PHP", "Ruby on Rails", "Go", "Kotlin"]
    },
    {
      name: "Database",
      technologies: ["MongoDB", "PostgreSQL", "MySQL", "Oracle", "SQL Server", "Redis", "Firebase", "DynamoDB"]
    },
    {
      name: "DevOps",
      technologies: ["Docker", "Kubernetes", "AWS", "Azure", "GCP", "Jenkins", "GitLab CI", "GitHub Actions", "Terraform"]
    },
    {
      name: "Mobile",
      technologies: ["React Native", "Flutter", "iOS (Swift)", "Android (Kotlin)", "Xamarin", "Ionic", "Capacitor"]
    }
  ];

  const [selectedTech, setSelectedTech] = useState<string[]>([]);

  const handleTechSelect = (tech: string) => {
    let updatedTech;
    if (selectedTech.includes(tech)) {
      updatedTech = selectedTech.filter(t => t !== tech);
    } else {
      updatedTech = [...selectedTech, tech];
    }
    setSelectedTech(updatedTech);
    onTechStackChange(updatedTech);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Select Tech Stack</CardTitle>
          <CardDescription>
            Choose the technologies that will be required for this project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Frontend">
            <TabsList className="mb-4 flex flex-wrap">
              {techCategories.map(category => (
                <TabsTrigger key={category.name} value={category.name}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {techCategories.map(category => (
              <TabsContent key={category.name} value={category.name} className="mt-0">
                <div className="flex flex-wrap gap-2">
                  {category.technologies.map(tech => {
                    const isSelected = selectedTech.includes(tech);
                    return (
                      <Badge
                        key={tech}
                        variant={isSelected ? "secondary" : "outline"}
                        className={`cursor-pointer py-2 px-3 text-sm ${
                          isSelected ? "bg-secondary text-secondary-foreground" : "hover:bg-muted"
                        }`}
                        onClick={() => handleTechSelect(tech)}
                      >
                        {isSelected && <CheckIcon className="mr-1 h-3 w-3" />}
                        {tech}
                      </Badge>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {selectedTech.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Technologies ({selectedTech.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedTech.map(tech => (
                <Badge key={tech} variant="secondary" className="py-1.5 px-3">
                  {tech}
                  <button
                    className="ml-1 text-secondary-foreground opacity-70 hover:opacity-100"
                    onClick={() => handleTechSelect(tech)}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TechStack;
