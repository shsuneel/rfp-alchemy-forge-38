
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ContentOutlineDisplayProps {
  outline: string; // For now, a simple string. Could be a structured object later.
  className?: string;
}

const ContentOutlineDisplay: React.FC<ContentOutlineDisplayProps> = ({ outline, className }) => {
  return (
    <Card className={cn("w-full max-w-[60rem] animate-fade-in", className)} >
      <CardHeader className="bg-muted/30">
        <CardTitle>Generated Content Outline</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground mb-2">
          Here's a suggested outline based on your description.
        </p>
        <div className="p-4 border rounded-md bg-background shadow-sm whitespace-pre-wrap" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {outline || "No outline generated yet."}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentOutlineDisplay;
