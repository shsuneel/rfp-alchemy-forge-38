
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { Phase } from "@/store/rfpSlice";

interface TimelineProps {
  onTimelineChange: (timeline: Phase[]) => void;
  initialTimeline?: Phase[];
}

const Timeline = ({ onTimelineChange, initialTimeline = [{
  id: "phase-1",
  name: "Discovery", 
  description: "Initial requirements gathering and analysis",
  durationWeeks: 2
}] }: TimelineProps) => {
  const [phases, setPhases] = useState<Phase[]>(initialTimeline);
  const [totalWeeks, setTotalWeeks] = useState(0);

  // Update local state when props change
  useEffect(() => {
    if (initialTimeline) {
      setPhases(initialTimeline);
    }
  }, [initialTimeline]);

  // Calculate total duration
  useEffect(() => {
    const total = phases.reduce((sum, phase) => sum + phase.durationWeeks, 0);
    setTotalWeeks(total);
  }, [phases]);

  // Update parent component when phases change
  useEffect(() => {
    onTimelineChange(phases);
  }, [phases, onTimelineChange]);

  const addPhase = () => {
    setPhases([
      ...phases,
      {
        id: `phase-${Date.now()}`,
        name: "",
        description: "",
        durationWeeks: 2
      }
    ]);
  };

  const updatePhase = (index: number, field: keyof Phase, value: any) => {
    const newPhases = [...phases];
    newPhases[index] = { ...newPhases[index], [field]: value };
    setPhases(newPhases);
  };

  const removePhase = (index: number) => {
    if (phases.length > 1) {
      setPhases(phases.filter((_, i) => i !== index));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
        <CardDescription>Define the phases and timeline for your project</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 p-3 rounded-md flex items-center justify-between">
          <div>
            <span className="font-medium text-sm">Total Project Duration</span>
            <div className="text-2xl font-bold">{totalWeeks} Weeks</div>
          </div>
          <div className="text-right">
            <span className="font-medium text-sm">Estimated Completion</span>
            <div className="text-lg">
              {totalWeeks > 0 ? `${Math.ceil(totalWeeks / 4)} Months` : "-"}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {phases.map((phase, index) => (
            <div key={phase.id} className="bg-card border p-4 rounded-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <GripVertical className="h-5 w-5 text-muted-foreground mr-2" />
                  <h3 className="font-semibold">Phase {index + 1}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePhase(index)}
                  disabled={phases.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor={`phase-name-${index}`}>Phase Name</Label>
                  <Input
                    id={`phase-name-${index}`}
                    value={phase.name}
                    onChange={(e) => updatePhase(index, "name", e.target.value)}
                    placeholder="e.g., Discovery, Development, Testing"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`phase-description-${index}`}>Description</Label>
                  <Textarea
                    id={`phase-description-${index}`}
                    value={phase.description}
                    onChange={(e) => updatePhase(index, "description", e.target.value)}
                    placeholder="Describe what will be accomplished during this phase"
                    rows={2}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <Label htmlFor={`phase-duration-${index}`}>Duration (Weeks)</Label>
                    <span className="text-sm">{phase.durationWeeks} Weeks</span>
                  </div>
                  <Slider
                    id={`phase-duration-${index}`}
                    min={1}
                    max={12}
                    step={1}
                    value={[phase.durationWeeks]}
                    onValueChange={(value) => updatePhase(index, "durationWeeks", value[0])}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Button
          type="button"
          variant="outline"
          onClick={addPhase}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Phase
        </Button>
      </CardContent>
    </Card>
  );
};

export default Timeline;
