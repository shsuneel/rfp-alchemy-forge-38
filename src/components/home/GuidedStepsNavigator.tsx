
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'; // Removed Sparkles as it's not used directly here
import { cn } from '@/lib/utils';
import AiSuggestionIcon from '@/components/ui/AiSuggestionIcon';
// Removed toast import as AiSuggestionIcon handles its own toast for application
// import { toast } from "@/components/ui/use-toast"; 

interface GuidedStepsNavigatorProps {
  steps: { title: string; content: string }[];
  currentStepIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  onComplete?: () => void;
  onStepContentChange?: (stepIndex: number, newContent: string) => void; // New prop
  className?: string;
}

type AiSuggestionField = 'projectDescription' | 'requirements' | 'assumptions' | 'techStack' | 'timeline' | 'dependencies';

const mapStepTitleToAiField = (title: string): AiSuggestionField | null => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('goals') || lowerTitle.includes('overview')) return 'projectDescription';
  if (lowerTitle.includes('audience')) return 'projectDescription'; // General context
  if (lowerTitle.includes('features') || lowerTitle.includes('scope')) return 'requirements';
  if (lowerTitle.includes('technical') || lowerTitle.includes('specifications')) return 'techStack';
  if (lowerTitle.includes('metrics') || lowerTitle.includes('success')) return 'projectDescription'; // General context
  return null; 
};

const GuidedStepsNavigator: React.FC<GuidedStepsNavigatorProps> = ({
  steps,
  currentStepIndex,
  onNext,
  onPrevious,
  onComplete,
  onStepContentChange, // Destructure new prop
  className,
}) => {
  const currentStepData = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  const aiField = currentStepData ? mapStepTitleToAiField(currentStepData.title) : null;

  const handleSuggestionApplied = (suggestion: string) => {
    // Call the new prop to update the parent's state
    if (onStepContentChange && currentStepData) {
      onStepContentChange(currentStepIndex, suggestion);
    }
    // The AiSuggestionIcon component already shows a toast when a suggestion is applied.
    // Removed redundant toast from here.
    // toast({
    //   title: "AI Suggestion Applied",
    //   description: `Suggestion for "${currentStepData?.title}" has been applied.`,
    //   duration: 5000,
    // });
  };

  return (
    <Card className={cn("w-full max-w-lg animate-fade-in", className)}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Step {currentStepIndex + 1}: {currentStepData?.title || "Guidance"}</CardTitle>
          {aiField && currentStepData && (
            <AiSuggestionIcon
              field={aiField}
              currentValue={currentStepData.content} // Pass current content as context
              onSuggestionApplied={handleSuggestionApplied} // This will now trigger content update
            />
          )}
        </div>
        <CardDescription>Follow the steps to complete your RFP information.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 border rounded-md bg-muted/50 min-h-[150px] text-sm whitespace-pre-wrap">
          {currentStepData?.content || "Loading step..."}
        </div>
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={currentStepIndex === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {isLastStep ? (
            <Button onClick={onComplete}>
              Proceed to Templates <Check className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={onNext}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GuidedStepsNavigator;
