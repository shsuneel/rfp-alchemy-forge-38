import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { RequirementItem, AssumptionItem, DependencyItem, setExtractedInfo } from '@/store/rfpSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';

interface AiSuggestionsProps {
  projectDescription: string;
}

const AiSuggestions: React.FC<AiSuggestionsProps> = ({ projectDescription }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string>('');
  const dispatch = useAppDispatch();

  const generateSuggestions = async () => {
    if (!projectDescription.trim()) {
      toast({
        title: "Missing Description",
        description: "Please add a project description first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call with a timeout for now
      // In production, this would call an actual AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Sample response for demonstration
      const sampleResponse = generateSampleResponse(projectDescription);
      setSuggestions(sampleResponse.suggestedText);

      // Extract and dispatch information
      dispatch(setExtractedInfo({
        requirements: sampleResponse.requirements,
        techStack: sampleResponse.techStack,
        assumptions: sampleResponse.assumptions,
        dependencies: sampleResponse.dependencies
      }));

      toast({
        title: "Suggestions Generated",
        description: "AI has generated suggestions based on your project description",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // This function simulates an AI response for demo purposes
  // In a real implementation, this would be replaced with an actual API call
  const generateSampleResponse = (description: string) => {
    const lowerDesc = description.toLowerCase();
    
    const requirements: RequirementItem[] = [
      { 
        id: `req-${Date.now()}-1`, 
        description: lowerDesc.includes('mobile') ? 
          "Develop responsive mobile UI with native-like experience" : 
          "Implement responsive web interface with modern design principles",
        priority: "High"
      },
      { 
        id: `req-${Date.now()}-2`, 
        description: lowerDesc.includes('dashboard') ? 
          "Create analytics dashboard with interactive charts and real-time data" : 
          "Build user management system with role-based access control",
        priority: "Medium"
      },
      { 
        id: `req-${Date.now()}-3`, 
        description: "Ensure compliance with data protection regulations and implement secure authentication",
        priority: "High"
      }
    ];

    const techStack = lowerDesc.includes('mobile') ? 
      ['React Native', 'TypeScript', 'Redux', 'Jest'] : 
      ['React', 'TypeScript', 'Redux', 'Material UI', 'Jest'];
    
    if (lowerDesc.includes('database') || lowerDesc.includes('data')) {
      techStack.push('PostgreSQL');
      techStack.push('Prisma');
    }
    
    if (lowerDesc.includes('api') || lowerDesc.includes('backend')) {
      techStack.push('Node.js');
      techStack.push('Express');
    }

    const assumptions: AssumptionItem[] = [
      { id: `assump-${Date.now()}-1`, description: "Project timeline will be 3-6 months depending on scope" },
      { id: `assump-${Date.now()}-2`, description: "Client will provide necessary API documentation and access" }
    ];

    const dependencies: DependencyItem[] = [
      { id: `dep-${Date.now()}-1`, description: "Access to client's existing systems for integration" },
      { id: `dep-${Date.now()}-2`, description: "Timely feedback cycles for UI/UX approvals" }
    ];

    const suggestedText = `Based on the project description, I recommend the following approach:

1. Technology Stack:
   - ${techStack.join(', ')}

2. Key Requirements:
   - ${requirements[0].description}
   - ${requirements[1].description}
   - ${requirements[2].description}

3. Implementation Strategy:
   - Begin with a discovery phase to refine requirements
   - Develop a prototype for early feedback
   - Implement core features with an agile approach
   - Perform comprehensive testing before deployment

4. Resource Recommendations:
   - 1 Project Manager
   - 2 Frontend Developers
   - 1 Backend Developer
   - 1 QA Engineer
`;

    return {
      suggestedText,
      requirements,
      techStack,
      assumptions,
      dependencies
    };
  };

  const applyToRfp = () => {
    toast({
      title: "Suggestions Applied",
      description: "The AI suggestions have been applied to your RFP",
    });
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
          AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!suggestions && (
          <div className="text-center p-6">
            <p className="text-muted-foreground mb-4">
              Generate comprehensive AI suggestions based on your project description to get started quickly.
            </p>
            <Button 
              onClick={generateSuggestions} 
              className="flex items-center" 
              disabled={loading || !projectDescription.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Comprehensive Suggestions
                </>
              )}
            </Button>
          </div>
        )}
        
        {suggestions && (
          <div className="space-y-4">
            <Textarea 
              value={suggestions} 
              onChange={(e) => setSuggestions(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
              readOnly
            />
            <div className="text-sm text-muted-foreground">
              <p>Note: These suggestions have been applied to your RFP automatically.</p>
              <p>You can find them in the Requirements, Tech Stack, and other relevant sections.</p>
              <p className="mt-2 text-amber-600">Need specific suggestions? Try the AI icons <Sparkles className="h-3 w-3 inline" /> next to individual fields!</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AiSuggestions;
