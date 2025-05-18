
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ContentOutlineDisplayProps {
  outline: string; // For now, a simple string. Could be a structured object later.
  className?: string;
}

const ContentOutlineDisplay: React.FC<ContentOutlineDisplayProps> = ({ outline, className }) => {
  return (
    <Card className={cn("w-full animate-fade-in", className)} style={{ width: '900px' }}>
      <CardHeader >
        <CardTitle>Generated Content Outline</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          Here's a suggested outline based on your description.
        </p>
        <div className="p-4 border rounded-md bg-muted/50 whitespace-pre-wrap" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {outline || "No outline generated yet."}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentOutlineDisplay;
