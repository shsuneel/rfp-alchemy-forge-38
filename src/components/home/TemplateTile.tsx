
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export interface RfpTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  // Potentially add more fields like 'previewImage', 'tags', etc.
}

interface TemplateTileProps {
  template: RfpTemplate;
  onSelect: (templateId: string) => void;
}

const TemplateTile: React.FC<TemplateTileProps> = ({ template, onSelect }) => {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <CardDescription className="text-xs">{template.category}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onSelect(template.id)} className="w-full">
          Use this Template
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TemplateTile;
