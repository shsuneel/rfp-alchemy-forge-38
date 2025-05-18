
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';

interface RfpPromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
}

const RfpPromptInput: React.FC<RfpPromptInputProps> = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-lg">
      <div>
        <Label htmlFor="rfp-prompt" className="text-lg font-medium">
          Describe your RFP
        </Label>
        <p className="text-sm text-muted-foreground mb-2">
          Tell us about your RFP. What are the main goals and requirements?
        </p>
        <Textarea
          id="rfp-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="We need a new e-commerce platform for selling handmade crafts, focusing on mobile-first design and easy vendor onboarding..."
          rows={6}
          className="text-base"
        />
      </div>
      <Button type="submit" className="w-full text-base py-3" disabled={isLoading || !prompt.trim()}>
        {isLoading ? 'Generating Outline...' : 'Generate Content Outline'}
        {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
      </Button>
    </form>
  );
};

export default RfpPromptInput;
