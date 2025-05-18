import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import AiSuggestionIcon from '@/components/ui/AiSuggestionIcon';
import { Textarea } from '@/components/ui/textarea';

interface GuidedStepsNavigatorProps {
  steps: { title: string; content: string }[];
  currentStepIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  onComplete?: () => void;
  onStepContentChange?: (stepIndex: number, newContent: string) => void;
  className?: string;
}

type AiSuggestionField = 'projectDescription' | 'requirements' | 'assumptions' | 'techStack' | 'timeline' | 'dependencies';

const mapStepTitleToAiField = (title: string): AiSuggestionField | null => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('goals') || lowerTitle.includes('overview')) return 'projectDescription';
  if (lowerTitle.includes('audience')) return 'projectDescription';
  if (lowerTitle.includes('features') || lowerTitle.includes('scope')) return 'requirements';
  if (lowerTitle.includes('technical') || lowerTitle.includes('specifications')) return 'techStack';
  if (lowerTitle.includes('metrics') || lowerTitle.includes('success')) return 'projectDescription';
  return null; 
};

const GuidedStepsNavigator: React.FC<GuidedStepsNavigatorProps> = ({
  steps,
  currentStepIndex,
  onNext,
  onPrevious,
  onComplete,
  onStepContentChange,
  className,
}) => {
  const currentStepData = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  const aiField = currentStepData ? mapStepTitleToAiField(currentStepData.title) : null;

  const handleSuggestionApplied = (suggestion: string) => {
    if (onStepContentChange && currentStepData) {
      onStepContentChange(currentStepIndex, suggestion);
    }
    // Toast is handled by AiSuggestionIcon
  };

  return (
    <Card className={cn("w-full max-w-[60rem] animate-fade-in shadow-sm", className)}>
      <CardHeader className="bg-muted/30">
        <div className="flex justify-between items-center">
          <CardTitle>Step {currentStepIndex + 1}: {currentStepData?.title || "Guidance"}</CardTitle>
          {aiField && currentStepData && (
            <AiSuggestionIcon
              field={aiField}
              currentValue={currentStepData.content}
              onSuggestionApplied={handleSuggestionApplied}
            />
          )}
        </div>
        <CardDescription>Follow the steps to complete your RFP information.</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Textarea
          value={currentStepData?.content || ''}
          onChange={(e) => {
            if (onStepContentChange && currentStepData) {
              onStepContentChange(currentStepIndex, e.target.value);
            }
          }}
          placeholder={currentStepData?.title ? `Enter details for "${currentStepData.title}"...` : "Enter step details..."}
          className="min-h-[200px] text-sm w-full resize-y bg-background"
        />
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
