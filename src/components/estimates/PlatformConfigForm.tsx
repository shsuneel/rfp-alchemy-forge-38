
import { 
  FormFactor, 
  Browser, 
  updateFormFactors, 
  updateBrowsers,
  // These actions are not exported from estimatesSlice
  // setContingency,
  // setRiskFactor
} from "@/store/estimatesSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const PlatformConfigForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const formFactors = useAppSelector(state => state.estimates.formFactors);
  const browsers = useAppSelector(state => state.estimates.browsers);
  const contingency = useAppSelector(state => state.estimates.contingency);
  const riskFactor = useAppSelector(state => state.estimates.riskFactor);
  
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
    // Commented out until setContingency action is implemented
    // dispatch(setContingency(value[0]));
  };
  
  const handleRiskFactorChange = (value: number[]) => {
    // Commented out until setRiskFactor action is implemented
    // dispatch(setRiskFactor(value[0]));
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
                  defaultValue={[contingency]}
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
                  defaultValue={[riskFactor]}
                  onValueChange={handleRiskFactorChange}
                />
                <p className="text-sm text-muted-foreground">
                  Additional buffer for project-specific risks
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformConfigForm;
