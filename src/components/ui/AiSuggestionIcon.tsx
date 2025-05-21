
import React from 'react';
import { Sparkles } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  // TooltipProvider, // Not strictly needed here if handled globally
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger, // Ensure this is imported
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast'; // Corrected import path
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
  const [userInputPrefix, setUserInputPrefix] = React.useState("");

  React.useEffect(() => {
    if (isOpen) {
      // Reset state when popover opens
      setUserInputPrefix("");
      setSuggestion("");
      setLoading(false);
    }
  }, [isOpen]);

  const handleGenerateSuggestion = async () => {
    if (loading) return;

    setLoading(true);
    setSuggestion(""); // Clear previous suggestion before new API call

    const combinedValue = userInputPrefix
      ? `${userInputPrefix}\n${currentValue || ""}`.trim()
      : currentValue;

    try {
      const response = await axios.post('http://localhost:3020/ai/suggestion', {
        field,
        currentValue: combinedValue,
      });

      if (response.data && response.data.suggestion) {
        setSuggestion(response.data.suggestion);
      } else {
        throw new Error('No suggestion received from the server');
      }
    } catch (error) {
      // console.error("Failed to generate suggestion:", error);
      toast({
        title: "Error",
        description: "Failed to generate suggestion. Please try again.",
        variant: "destructive",
      });
      setSuggestion("");
    } finally {
      setLoading(false);
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

  const formattedFieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip> {/* Tooltip Root */}
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            {/* The Button is the child of PopoverTrigger, which is the child of TooltipTrigger. Both use asChild. */}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full p-0 text-amber-500 hover:bg-amber-100"
              aria-label={`Get AI suggestions for ${formattedFieldName}`}
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Get AI suggestions for {formattedFieldName}</p>
        </TooltipContent>
      </Tooltip> {/* Tooltip Root ends */}

      <PopoverContent className="w-96">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h4 className="font-semibold text-lg">AI Suggestion</h4>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-6">
              <Loader2 className="h-10 w-10 animate-spin text-amber-500 mb-3" />
              <p className="text-md text-muted-foreground">Generating suggestions...</p>
            </div>
          ) : suggestion ? (
            <>
              <p className="text-sm font-medium text-gray-700">Generated Suggestion:</p>
              <Textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                className="min-h-[180px] text-sm"
                rows={8}
              />
              <div className="flex justify-end gap-2 mt-3">
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
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Apply Suggestion
                </Button>
              </div>
            </>
          ) : (
            // Prefix input stage
            <div className="space-y-3">
              <div>
                <label htmlFor={`ai-prefix-input-${field}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Refine AI Prompt for "{formattedFieldName}"
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Optionally, add a prefix or specific instructions to guide the AI.
                </p>
                <Textarea
                  id={`ai-prefix-input-${field}`} // Unique ID per field instance
                  placeholder="e.g., Make this more concise:, Generate 3 examples for:"
                  value={userInputPrefix}
                  onChange={(e) => setUserInputPrefix(e.target.value)}
                  rows={3}
                  className="text-sm"
                />
              </div>

              {currentValue && currentValue.trim() !== "" && (
                <div className="text-xs text-muted-foreground p-2 border rounded-md bg-gray-50 max-h-24 overflow-y-auto">
                  <p className="font-semibold mb-0.5">Current context:</p>
                  <p className="whitespace-pre-wrap break-words">{currentValue}</p>
                </div>
              )}
              
              <div className="flex justify-end mt-4">
                <Button
                  size="sm"
                  onClick={handleGenerateSuggestion}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                  disabled={loading} // Disable button while loading
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Generate Suggestion
                </Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AiSuggestionIcon;

