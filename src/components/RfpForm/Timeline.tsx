
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Calendar } from "lucide-react";

interface Phase {
  id: string;
  name: string;
  description: string;
  durationWeeks: number;
}

interface TimelineProps {
  onTimelineChange: (phases: Phase[]) => void;
}

const Timeline: React.FC<TimelineProps> = ({ onTimelineChange }) => {
  const [phases, setPhases] = useState<Phase[]>([
    {
      id: "phase-" + Date.now(),
      name: "Discovery",
      description: "Initial requirements gathering and analysis",
      durationWeeks: 2
    }
  ]);

  const addPhase = () => {
    const newPhases = [
      ...phases,
      {
        id: "phase-" + Date.now(),
        name: "",
        description: "",
        durationWeeks: 2
      }
    ];
    setPhases(newPhases);
    onTimelineChange(newPhases);
  };

  const updatePhase = (id: string, field: keyof Phase, value: string | number) => {
    const newPhases = phases.map(phase => {
      if (phase.id === id) {
        return { ...phase, [field]: value };
      }
      return phase;
    });
    setPhases(newPhases);
    onTimelineChange(newPhases);
  };

  const removePhase = (id: string) => {
    if (phases.length > 1) {
      const newPhases = phases.filter(phase => phase.id !== id);
      setPhases(newPhases);
      onTimelineChange(newPhases);
    }
  };

  const totalWeeks = phases.reduce((sum, phase) => sum + phase.durationWeeks, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Implementation Timeline</CardTitle>
          <CardDescription>
            Define the implementation phases and their estimated duration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {phases.map((phase, index) => (
              <div key={phase.id} className="border p-4 rounded-md bg-muted/30">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-11 sm:col-span-6">
                    <Label htmlFor={`phase-name-${phase.id}`} className="block mb-1">
                      Phase {index + 1} Name
                    </Label>
                    <Input
                      id={`phase-name-${phase.id}`}
                      placeholder="e.g., Discovery, Development"
                      value={phase.name}
                      onChange={(e) => updatePhase(phase.id, "name", e.target.value)}
                    />
                  </div>
                  
                  <div className="col-span-11 sm:col-span-5">
                    <Label htmlFor={`phase-duration-${phase.id}`} className="block mb-1">
                      Duration (Weeks): {phase.durationWeeks}
                    </Label>
                    <div className="pt-2">
                      <Slider
                        id={`phase-duration-${phase.id}`}
                        value={[phase.durationWeeks]}
                        min={1}
                        max={26}
                        step={1}
                        onValueChange={(value) => updatePhase(phase.id, "durationWeeks", value[0])}
                      />
                    </div>
                  </div>
                  
                  <div className="col-span-1 flex justify-end sm:items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePhase(phase.id)}
                      disabled={phases.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="col-span-12">
                    <Label htmlFor={`phase-desc-${phase.id}`} className="block mb-1">
                      Description
                    </Label>
                    <Textarea
                      id={`phase-desc-${phase.id}`}
                      placeholder="Describe what happens during this phase"
                      value={phase.description}
                      onChange={(e) => updatePhase(phase.id, "description", e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addPhase} className="flex items-center">
              <Plus className="h-4 w-4 mr-2" /> Add Phase
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Timeline Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="w-full bg-muted h-10 rounded-md relative overflow-hidden">
              {phases.map((phase, index) => {
                const previousPhasesDuration = phases
                  .slice(0, index)
                  .reduce((sum, p) => sum + p.durationWeeks, 0);
                
                const phaseWidth = (phase.durationWeeks / totalWeeks) * 100;
                const phaseOffset = (previousPhasesDuration / totalWeeks) * 100;
                
                return (
                  <div
                    key={phase.id}
                    className="absolute top-0 bottom-0 flex items-center justify-center text-xs font-medium overflow-hidden"
                    style={{
                      left: `${phaseOffset}%`,
                      width: `${phaseWidth}%`,
                      backgroundColor: getPhaseColor(index),
                      color: index % 2 === 0 ? "white" : "black",
                      borderRight: "1px solid white"
                    }}
                    title={`${phase.name}: ${phase.durationWeeks} weeks`}
                  >
                    {phaseWidth > 10 ? phase.name : ""}
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Week 1</span>
              <span>Week {totalWeeks}</span>
            </div>
            
            <div className="pt-2">
              <p className="text-sm">
                <span className="font-semibold">Estimated timeline:</span>{" "}
                {totalWeeks} {totalWeeks === 1 ? "week" : "weeks"} ({(totalWeeks / 4).toFixed(1)} months)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to get a color for each phase
function getPhaseColor(index: number): string {
  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "hsl(var(--accent))",
    "#4a6fa5",
    "#6b8e23",
    "#9370db"
  ];
  return colors[index % colors.length];
}

export default Timeline;
