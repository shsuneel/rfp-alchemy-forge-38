
import React from 'react';
import TemplateTile, { RfpTemplate } from './TemplateTile';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Mock data for templates - in a real app, this would come from a database
const mockTemplates: RfpTemplate[] = [
  { id: 'tech-project', name: 'Software Development RFP', description: 'A comprehensive template for soliciting proposals for custom software development projects.', category: 'Technology' },
  { id: 'marketing-services', name: 'Marketing Services RFP', description: 'Template for seeking proposals from marketing agencies for various services like SEO, content creation, etc.', category: 'Marketing' },
  { id: 'consulting-services', name: 'Consulting Services RFP', description: 'A general-purpose template for requesting proposals for consulting engagements.', category: 'Professional Services' },
  { id: 'construction-project', name: 'Construction Project RFP', description: 'Detailed template for construction project bids, covering scope, materials, and timelines.', category: 'Construction' },
];

interface TemplateSelectionViewProps {
  onSelectTemplate: (templateId: string) => void;
  onStartBlank: () => void;
  className?: string;
}

const TemplateSelectionView: React.FC<TemplateSelectionViewProps> = ({
  onSelectTemplate,
  onStartBlank,
  className,
}) => {
  return (
    <div className={`w-full max-w-4xl p-6 rounded-xl bg-card/80 backdrop-blur-md shadow-xl border border-border/30 ${className}`}>
      <h2 className="text-3xl font-semibold text-center mb-2 text-white">Choose a Template</h2>
      <p className="text-center text-gray-200 mb-8">
        Select a pre-built template to get started quickly, or begin with a blank RFP using the information you've provided.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {mockTemplates.map(template => (
          <TemplateTile key={template.id} template={template} onSelect={onSelectTemplate} />
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" size="lg" onClick={onStartBlank} className="text-base py-3 bg-transparent text-white hover:bg-white/10 border-white/50 hover:border-white">
          Or Start with a Blank RFP <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
       <p className="text-xs text-center text-gray-400 mt-4">
        Note: Template integration is currently illustrative. Selecting a template will proceed with your entered data for now. Full template functionality would require database integration.
      </p>
    </div>
  );
};

export default TemplateSelectionView;
