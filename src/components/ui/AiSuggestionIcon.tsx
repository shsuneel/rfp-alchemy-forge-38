
import React from 'react';
import { Sparkles } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';

interface AiSuggestionIconProps {
  field: 'projectDescription' | 'requirements' | 'assumptions' | 'techStack' | 'timeline' | 'dependencies';
  onSuggestionApplied: (suggestion: string) => void;
  currentValue?: string;
}

const fieldPrompts = {
  projectDescription: "Suggest a comprehensive project description",
  requirements: "Generate key requirements based on the project",
  assumptions: "List important assumptions for this project",
  techStack: "Recommend an appropriate technology stack",
  timeline: "Suggest a realistic project timeline",
  dependencies: "Identify likely project dependencies"
};

const fieldPlaceholders = {
  projectDescription: "AI will suggest a detailed project description...",
  requirements: "AI will generate key project requirements...",
  assumptions: "AI will list important project assumptions...",
  techStack: "AI will recommend appropriate technologies...",
  timeline: "AI will suggest realistic project phases...",
  dependencies: "AI will identify likely project dependencies..."
};

const AiSuggestionIcon: React.FC<AiSuggestionIconProps> = ({ field, onSuggestionApplied, currentValue }) => {
  const [loading, setLoading] = React.useState(false);
  const [suggestion, setSuggestion] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const generateSuggestion = async () => {
    if (loading) return;

    setLoading(true);
    setSuggestion("");

    try {
      // In a real implementation, this would call an actual AI service
      // For now, we'll simulate the API call with a timeout
      const response = await axios.post('http://localhost:3020/ai/suggestion', {
        field,
        currentValue,
      });

      if (response.data && response.data.suggestion) {
        setSuggestion(response.data.suggestion);
      } else {
        throw new Error('No suggestion received from the server');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSampleFieldResponse = (fieldType: string, context: string): string => {
    const baseContext = context.toLowerCase();

    switch (fieldType) {
      case 'projectDescription':
        return `This project aims to develop a comprehensive digital platform that integrates multiple user touchpoints into a unified experience. The system will support real-time data synchronization, advanced analytics, and secure user authentication. Key objectives include improving operational efficiency, enhancing user engagement, and providing actionable insights through data visualization.`;

      case 'requirements':
        return baseContext.includes('mobile') ?
          `1. Develop responsive mobile UI with native-like experience
2. Implement offline data synchronization capabilities
3. Integrate secure biometric authentication
4. Ensure cross-platform compatibility
5. Optimize for battery efficiency and performance` :
          `1. Create a scalable web architecture supporting 1000+ concurrent users
2. Implement role-based access control system
3. Develop RESTful APIs with comprehensive documentation
4. Ensure WCAG 2.1 AA compliance for accessibility
5. Build comprehensive analytics dashboard`;

      case 'techStack':
        return baseContext.includes('mobile') ?
          `React Native, TypeScript, Redux, Firebase, Jest` :
          `React, TypeScript, Node.js, Express, PostgreSQL, Redis, Docker, AWS`;

      case 'assumptions':
        return `1. Client will provide necessary API documentation
2. Project timeline will be 3-6 months depending on scope
3. Existing user data will be migrated to the new system
4. Third-party integrations are available with documented APIs
5. Client has dedicated team for testing and feedback`;

      case 'timeline':
        return `Phase 1 (Discovery): 2-3 weeks
Phase 2 (Design & Architecture): 3-4 weeks
Phase 3 (Development): 8-10 weeks
Phase 4 (Testing & QA): 3-4 weeks
Phase 5 (Deployment & Training): 2-3 weeks`;

      case 'dependencies':
        return `1. Access to client's existing systems for integration
2. Timely feedback cycles for UI/UX approvals
3. Third-party API access credentials
4. Security compliance requirements documentation
5. Content and assets from client marketing team`;

      default:
        return `AI-generated suggestion for ${fieldType}`;
    }
  };

  const applySuggestion = () => {
    onSuggestionApplied(suggestion);
    setIsOpen(false);
    toast({
      title: "Suggestion Applied",
      description: `The AI suggestion has been applied to the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full p-0 text-amber-500 hover:bg-amber-100"
              onClick={() => {
                if (!isOpen) {
                  generateSuggestion();
                }
              }}
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Get AI suggestions for {field.replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
        </TooltipContent>
      </Tooltip>

      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <h4 className="font-medium">AI Suggestion</h4>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500 mb-2" />
              <p className="text-sm text-muted-foreground">Generating suggestions...</p>
            </div>
          ) : suggestion ? (
            <>
              <Textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                className="min-h-[150px] text-sm"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={applySuggestion}
                >
                  Apply
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center p-4">
              <p className="text-sm text-muted-foreground">{fieldPlaceholders[field]}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={generateSuggestion}
              >
                Generate Suggestion
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AiSuggestionIcon;
