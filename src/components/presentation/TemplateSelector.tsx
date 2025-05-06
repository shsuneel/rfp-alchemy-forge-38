
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Template } from "./PresentationEditor";

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplate: Template;
  onSelectTemplate: (template: Template) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onSelectTemplate,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Select a Template</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              selectedTemplate.id === template.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onSelectTemplate(template)}
          >
            <CardContent className="p-4">
              <div className="mb-2 font-medium">{template.name}</div>
              <div 
                className="aspect-video rounded-md overflow-hidden"
                style={{ backgroundColor: template.primaryColor }}
              >
                {template.thumbnail ? (
                  <img 
                    src={template.thumbnail} 
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted">
                    No preview
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-2">
                <div 
                  className="w-6 h-6 rounded-full" 
                  style={{ backgroundColor: template.primaryColor }}
                />
                <div 
                  className="w-6 h-6 rounded-full" 
                  style={{ backgroundColor: template.secondaryColor }}
                />
                <div 
                  className="w-6 h-6 rounded-full" 
                  style={{ backgroundColor: template.accentColor }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
