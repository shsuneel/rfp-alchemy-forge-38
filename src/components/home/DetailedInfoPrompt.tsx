
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';

interface DetailedInfoPromptProps {
  onSubmit: (details: string) => void;
  isLoading?: boolean;
}

const DetailedInfoPrompt: React.FC<DetailedInfoPromptProps> = ({ onSubmit, isLoading }) => {
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (details.trim()) {
      onSubmit(details.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-lg animate-fade-in">
      <div>
        <Label htmlFor="detailed-info-prompt" className="text-lg font-medium">
          Provide More Details
        </Label>
        <p className="text-sm text-muted-foreground mb-2">
          Please elaborate on the points in the outline or add any other specific information.
        </p>
        <Textarea
          id="detailed-info-prompt"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="e.g., For user authentication, we require two-factor authentication. The payment gateway should support Stripe and PayPal..."
          rows={8}
          className="text-base"
          disabled={isLoading}
        />
      </div>
      <Button type="submit" className="w-full text-base py-3" disabled={isLoading || !details.trim()}>
        {isLoading ? 'Processing...' : 'Start Guided Steps'}
        {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
      </Button>
    </form>
  );
};

export default DetailedInfoPrompt;
