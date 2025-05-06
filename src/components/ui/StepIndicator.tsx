
import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex justify-between mb-8 mx-auto max-w-3xl">
      {steps.map((step, index) => (
        <div
          key={index}
          className={cn(
            "step-item",
            currentStep === index && "active",
            currentStep > index && "complete"
          )}
        >
          <div
            className={cn(
              "step",
              currentStep === index && "active",
              currentStep > index && "complete"
            )}
          >
            {currentStep > index ? (
              <Check className="h-4 w-4" />
            ) : (
              index + 1
            )}
          </div>
          <p className="text-xs md:text-sm mt-1">{step}</p>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
