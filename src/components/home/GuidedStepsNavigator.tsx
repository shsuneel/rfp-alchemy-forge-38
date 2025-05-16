
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface GuidedStepsNavigatorProps {
  steps: { title: string; content: string }[]; // Example structure
  currentStepIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  onComplete?: () => void;
}

const GuidedStepsNavigator: React.FC<GuidedStepsNavigatorProps> = ({
  steps,
  currentStepIndex,
  onNext,
  onPrevious,
  onComplete,
}) => {
  const currentStepData = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <Card className="w-full max-w-lg animate-fade-in">
      <CardHeader>
        <CardTitle>Step {currentStepIndex + 1}: {currentStepData?.title || "Guidance"}</CardTitle>
        <CardDescription>Follow the steps to complete your RFP information.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 border rounded-md bg-muted/50 min-h-[150px]">
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
              Complete <Check className="ml-2 h-4 w-4" />
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
