import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/Section";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RfpStatus } from "@/store/rfpSlice";

export interface PreviewProps {
  projectName: string;
  projectDescription: string;
  sector: string;
  clientInfo: string;
  files: File[];
  techStack: string[];
  requirements: any[];
  assumptions: any[];
  dependencies: any[];
  timeline: any[];
  collaborator: any[];
  resources: any[];
  sections: any[];
  thorId: string;
  status?: RfpStatus;
  remarks?: string;
  onStatusChange?: (status: RfpStatus) => void;
  onRemarksChange?: (remarks: string) => void;
}

const Preview: React.FC<PreviewProps> = (props) => {
  return (
    <div>
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>RFP Preview</CardTitle>
          <CardDescription>
            Review the information before saving
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Section title="Project Overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Project Name</h4>
                <p>{props.projectName || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Sector</h4>
                <p>{props.sector || "N/A"}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Project Description</h4>
              <p>{props.projectDescription || "N/A"}</p>
            </div>
          </Section>

          <Section title="Client Information">
            <h4 className="text-sm font-medium mb-1">Client Info</h4>
            <p>{props.clientInfo || "N/A"}</p>
          </Section>

          <Section title="Thor ID">
            <h4 className="text-sm font-medium mb-1">Thor ID</h4>
            <p>{props.thorId || "N/A"}</p>
          </Section>

          <Section title="Status & Remarks">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Status</h4>
                <Select 
                  value={props.status || "InProgress"} 
                  onValueChange={props.onStatusChange}
                  disabled={!props.onStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="InProgress">In Progress</SelectItem>
                    <SelectItem value="OnHold">On Hold</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Remarks</h4>
                <Textarea 
                  value={props.remarks || ""} 
                  onChange={e => props.onRemarksChange?.(e.target.value)}
                  placeholder="Add any additional notes or remarks"
                  disabled={!props.onRemarksChange}
                />
              </div>
            </div>
          </Section>

          <Section title="Tech Stack">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {props.techStack.map((tech, index) => (
                <Badge key={index}>{tech}</Badge>
              ))}
            </div>
          </Section>

          <Section title="Requirements">
            {props.requirements.map((req, index) => (
              <div key={index} className="mb-2">
                <h4 className="text-sm font-medium">Requirement {index + 1}</h4>
                <p>{req.description || "N/A"}</p>
              </div>
            ))}
          </Section>

          <Section title="Assumptions">
            {props.assumptions.map((assumption, index) => (
              <div key={index} className="mb-2">
                <h4 className="text-sm font-medium">Assumption {index + 1}</h4>
                <p>{assumption.description || "N/A"}</p>
              </div>
            ))}
          </Section>

          <Section title="Dependencies">
            {props.dependencies.map((dependency, index) => (
              <div key={index} className="mb-2">
                <h4 className="text-sm font-medium">Dependency {index + 1}</h4>
                <p>{dependency.description || "N/A"}</p>
              </div>
            ))}
          </Section>

          <Section title="Timeline">
            {props.timeline.map((phase, index) => (
              <div key={index} className="mb-2">
                <h4 className="text-sm font-medium">{phase.name}</h4>
                <p>{phase.description || "N/A"}</p>
                <p>Duration: {phase.durationWeeks} weeks</p>
              </div>
            ))}
          </Section>

          <Section title="Team">
            {props.collaborator.map((member, index) => (
              <div key={index} className="mb-2">
                <h4 className="text-sm font-medium">{member.name}</h4>
                <p>Role: {member.role || "N/A"}</p>
                <p>Email: {member.email || "N/A"}</p>
              </div>
            ))}
          </Section>

          <Section title="Resources">
            {props.resources.map((resource, index) => (
              <div key={index} className="mb-2">
                <h4 className="text-sm font-medium">{resource.title}</h4>
                <p>Level: {resource.level || "N/A"}</p>
                <p>Hourly Rate: ${resource.hourlyRate || "N/A"}</p>
              </div>
            ))}
          </Section>
        </CardContent>
      </Card>
    </div>
  );
};

export default Preview;
