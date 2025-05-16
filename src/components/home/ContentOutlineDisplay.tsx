
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContentOutlineDisplayProps {
  outline: string; // For now, a simple string. Could be a structured object later.
}

const ContentOutlineDisplay: React.FC<ContentOutlineDisplayProps> = ({ outline }) => {
  return (
    <Card className="w-full max-w-lg animate-fade-in">
      <CardHeader>
        <CardTitle>Generated Content Outline</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          Here's a suggested outline based on your description.
        </p>
        <div className="p-4 border rounded-md bg-muted/50 whitespace-pre-wrap">
          {outline || "No outline generated yet."}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentOutlineDisplay;
