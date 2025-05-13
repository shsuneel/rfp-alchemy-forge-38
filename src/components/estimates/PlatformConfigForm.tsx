
import { useState } from "react";
import { 
  FormFactor, 
  Browser,
  ApplicationFactor, 
  updateFormFactors, 
  updateBrowsers,
  updateApplicationFactors,
  toggleApplicationFactor,
  updatePlatformConfig
} from "@/store/estimatesSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

interface PlatformConfigFormProps {
  onUpdate: (config: any) => void;
}

const PlatformConfigForm: React.FC<PlatformConfigFormProps> = ({ onUpdate }) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const formFactors = useAppSelector(state => state.estimates.formFactors);
  const browsers = useAppSelector(state => state.estimates.browsers);
  const applicationFactors = useAppSelector(state => state.estimates.applicationFactors);
  const [contingency, setContingency] = useState(useAppSelector(state => state.estimates.contingency));
  const [riskFactor, setRiskFactor] = useState(useAppSelector(state => state.estimates.riskFactor));
  
  // Group application factors by their group property
  const factorsByGroup = applicationFactors.reduce((groups, factor) => {
    if (!groups[factor.group]) {
      groups[factor.group] = [];
    }
    groups[factor.group].push(factor);
    return groups;
  }, {} as Record<string, ApplicationFactor[]>);
  
  // Track which groups are expanded
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    return Object.keys(factorsByGroup).reduce((acc, group) => {
      acc[group] = true; // Start with all expanded
      return acc;
    }, {} as Record<string, boolean>);
  });
  
  const handleFormFactorToggle = (id: string, checked: boolean) => {
    const updated = formFactors.map(ff => 
      ff.id === id ? { ...ff, isSelected: checked } : ff
    );
    dispatch(updateFormFactors(updated));
  };
  
  const handleBrowserToggle = (id: string, checked: boolean) => {
    const updated = browsers.map(b => 
      b.id === id ? { ...b, isSelected: checked } : b
    );
    dispatch(updateBrowsers(updated));
  };
  
  const handleContingencyChange = (value: number[]) => {
    setContingency(value[0]);
  };
  
  const handleRiskFactorChange = (value: number[]) => {
    setRiskFactor(value[0]);
  };
  
  const handleApplicationFactorToggle = (factorId: string, checked: boolean) => {
    dispatch(toggleApplicationFactor(factorId));
  };
  
  const handleToggleGroup = (group: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const handleSaveConfig = () => {
    // Save the updated configuration
    dispatch(updatePlatformConfig({
      contingency,
      riskFactor
    }));
    
    onUpdate({
      contingency,
      riskFactor
    });
    
    toast({
      title: "Platform configuration saved",
      description: "Your platform settings have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Form Factors</h3>
              <div className="space-y-2">
                {formFactors.map(formFactor => (
                  <div key={formFactor.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`ff-${formFactor.id}`}
                      checked={formFactor.isSelected}
                      onCheckedChange={(checked) => handleFormFactorToggle(
                        formFactor.id, 
                        checked as boolean
                      )}
                    />
                    <Label htmlFor={`ff-${formFactor.id}`} className="flex-1">
                      {formFactor.name}
                    </Label>
                    <div className="text-muted-foreground text-sm">
                      x{formFactor.effort.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Supported Browsers</h3>
              <div className="space-y-2">
                {browsers.map(browser => (
                  <div key={browser.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`browser-${browser.id}`}
                      checked={browser.isSelected}
                      onCheckedChange={(checked) => handleBrowserToggle(
                        browser.id, 
                        checked as boolean
                      )}
                    />
                    <Label htmlFor={`browser-${browser.id}`} className="flex-1">
                      {browser.name}
                    </Label>
                    <div className="text-muted-foreground text-sm">
                      x{browser.effort.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Application Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {Object.keys(factorsByGroup).map(group => (
                <Collapsible 
                  key={group}
                  open={expandedGroups[group]}
                  onOpenChange={() => handleToggleGroup(group)}
                >
                  <div className="flex items-center mb-2">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-0">
                        {expandedGroups[group] ? (
                          <ChevronDown className="h-4 w-4 mr-2" />
                        ) : (
                          <ChevronRight className="h-4 w-4 mr-2" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <h3 className="text-md font-semibold">{group}</h3>
                  </div>
                  
                  <CollapsibleContent>
                    <div className="ml-6 space-y-2">
                      {factorsByGroup[group].map(factor => (
                        <div key={factor.factorId} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`factor-${factor.factorId}`}
                            checked={factor.isSelected}
                            onCheckedChange={(checked) => handleApplicationFactorToggle(
                              factor.factorId, 
                              checked as boolean
                            )}
                          />
                          <Label htmlFor={`factor-${factor.factorId}`} className="flex-1">
                            {factor.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                  <Separator className="my-4" />
                </Collapsible>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Risk Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="contingency">Contingency</Label>
                  <span className="text-muted-foreground">{contingency}%</span>
                </div>
                <Slider
                  id="contingency"
                  min={0}
                  max={50}
                  step={5}
                  value={[contingency]}
                  onValueChange={handleContingencyChange}
                />
                <p className="text-sm text-muted-foreground">
                  Buffer for addressing uncertainties in requirements
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="risk-factor">Risk Factor</Label>
                  <span className="text-muted-foreground">{riskFactor}%</span>
                </div>
                <Slider
                  id="risk-factor"
                  min={0}
                  max={50}
                  step={5}
                  value={[riskFactor]}
                  onValueChange={handleRiskFactorChange}
                />
                <p className="text-sm text-muted-foreground">
                  Additional buffer for project-specific risks
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSaveConfig}>
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformConfigForm;
