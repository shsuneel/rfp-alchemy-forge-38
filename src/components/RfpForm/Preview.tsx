
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RequirementItem {
  id: string;
  description: string;
  priority: "High" | "Medium" | "Low";
}

interface AssumptionItem {
  id: string;
  description: string;
}

interface DependencyItem {
  id: string;
  description: string;
}

interface Phase {
  id: string;
  name: string;
  description: string;
  durationWeeks: number;
}

interface PreviewProps {
  projectName: string;
  projectDescription: string;
  sector: string;
  clientInfo: string;
  files: File[];
  techStack: string[];
  requirements: RequirementItem[];
  assumptions: AssumptionItem[];
  dependencies: DependencyItem[];
  timeline: Phase[];
}

const Preview: React.FC<PreviewProps> = ({
  projectName,
  projectDescription,
  sector,
  clientInfo,
  files,
  techStack,
  requirements,
  assumptions,
  dependencies,
  timeline
}) => {
  const totalWeeks = timeline.reduce((sum, phase) => sum + phase.durationWeeks, 0);
  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="space-y-6 animate-scale-in print:p-8">
      <div className="print:hidden flex justify-between mb-4">
        <h2 className="text-2xl font-bold">RFP Preview</h2>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Print / Export PDF
        </button>
      </div>

      <div className="border rounded-md p-8 bg-white shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{projectName || "Request for Proposal"}</h1>
          <p className="text-muted-foreground mb-2">{sector || "Technology"} Sector</p>
          <p className="text-sm">Generated on {formattedDate}</p>
        </div>

        <div className="space-y-8">
          {/* Project Overview */}
          <section>
            <h2 className="text-xl font-bold border-b pb-2 mb-4">1. Project Overview</h2>
            <p className="mb-4">{projectDescription || "No project description provided."}</p>
            
            <h3 className="text-lg font-semibold mb-2">Client Information</h3>
            <p>{clientInfo || "No client information provided."}</p>
          </section>

          {/* Technical Requirements */}
          <section>
            <h2 className="text-xl font-bold border-b pb-2 mb-4">2. Technical Requirements</h2>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Technology Stack</h3>
              {techStack.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {techStack.map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p>No technologies specified.</p>
              )}
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Functional Requirements</h3>
              {requirements.filter(r => r.description).length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border px-3 py-2 text-left">ID</th>
                      <th className="border px-3 py-2 text-left">Requirement</th>
                      <th className="border px-3 py-2 text-left">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requirements
                      .filter(req => req.description)
                      .map((req, index) => (
                        <tr key={req.id}>
                          <td className="border px-3 py-2">REQ-{index + 1}</td>
                          <td className="border px-3 py-2">{req.description}</td>
                          <td className="border px-3 py-2">
                            <Badge variant={
                              req.priority === "High" ? "destructive" :
                              req.priority === "Medium" ? "default" : "outline"
                            }>
                              {req.priority}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <p>No requirements specified.</p>
              )}
            </div>
          </section>

          {/* Assumptions and Dependencies */}
          <section>
            <h2 className="text-xl font-bold border-b pb-2 mb-4">3. Assumptions and Dependencies</h2>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Assumptions</h3>
              {assumptions.filter(a => a.description).length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {assumptions
                    .filter(assumption => assumption.description)
                    .map((assumption, index) => (
                      <li key={assumption.id}>{assumption.description}</li>
                    ))}
                </ul>
              ) : (
                <p>No assumptions specified.</p>
              )}
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Dependencies</h3>
              {dependencies.filter(d => d.description).length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {dependencies
                    .filter(dependency => dependency.description)
                    .map((dependency, index) => (
                      <li key={dependency.id}>{dependency.description}</li>
                    ))}
                </ul>
              ) : (
                <p>No dependencies specified.</p>
              )}
            </div>
          </section>

          {/* Implementation Timeline */}
          <section>
            <h2 className="text-xl font-bold border-b pb-2 mb-4">4. Implementation Timeline</h2>
            
            <p className="mb-4">
              Estimated project duration: {totalWeeks} {totalWeeks === 1 ? "week" : "weeks"}
              ({(totalWeeks / 4).toFixed(1)} months)
            </p>
            
            {timeline.length > 0 ? (
              <div className="space-y-4">
                {timeline.map((phase, index) => (
                  <div key={phase.id} className="border rounded p-3">
                    <h4 className="font-semibold mb-1">
                      Phase {index + 1}: {phase.name} 
                      <span className="text-sm font-normal ml-2">
                        ({phase.durationWeeks} {phase.durationWeeks === 1 ? "week" : "weeks"})
                      </span>
                    </h4>
                    <p className="text-sm">{phase.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No timeline phases specified.</p>
            )}
          </section>

          {/* Supporting Documents */}
          <section>
            <h2 className="text-xl font-bold border-b pb-2 mb-4">5. Supporting Documents</h2>
            
            {files.length > 0 ? (
              <ul className="list-disc pl-5">
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            ) : (
              <p>No supporting documents attached.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Preview;
