import { useState, useEffect } from "react";
import { X, Plus, Users, Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { TeamMember } from "@/store/rfpSlice";

interface TeamProps {
  onTeamChange: (team: TeamMember[]) => void;
  initialTeam: TeamMember[];
}

const ROLES = [
  "Project Manager",
  "Technical Lead",
  "Developer",
  "Designer",
  "Business Analyst",
  "Tester",
  "DevOps Engineer",
  "Architect",
  "Solutions Architect",
  "Client Manager",
];

const Team = ({ onTeamChange, initialTeam }: TeamProps) => {
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  
  useEffect(() => {
    if (initialTeam) {
      setTeam(initialTeam.map(member => ({ ...member, responsibilities: member.responsibilities || "" })));
    }
  }, [initialTeam]);
  
  const handleAddMember = () => {
    const newMember: TeamMember = {
      id: Math.random().toString(36).substring(2, 9),
      name: "",
      email: "",
      role: "Developer",
      responsibilities: ""
    };
    
    const newTeam = [...team, newMember];
    setTeam(newTeam);
    onTeamChange(newTeam);
  };
  
  const handleRemoveMember = (id: string) => {
    const newTeam = team.filter(member => member.id !== id);
    setTeam(newTeam);
    onTeamChange(newTeam);
  };
  
  const handleMemberChange = (id: string, field: keyof TeamMember, value: string) => {
    const newTeam = team.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    );
    
    setTeam(newTeam);
    onTeamChange(newTeam);
  };

  const handleGenerateLink = () => {
    toast.info("Shareable link generation requires backend integration (e.g., Supabase). This feature is coming soon!");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Collaborators
        </CardTitle>
        <CardDescription>
          Add collaborators who will be involved in this RFP
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Collaborators</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleGenerateLink}
                className="flex items-center gap-1"
              >
                <LinkIcon className="h-3 w-3" /> Invite via Link
              </Button>
              <Button 
                type="button" 
                size="sm"
                variant="outline" 
                onClick={handleAddMember}
                className="flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Add Collaborator
              </Button>
            </div>
          </div>
          
          {team.filter(m => m.id !== "thor-id").map((member, index) => (
            <div key={member.id} className="p-4 border rounded-md relative space-y-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-6 w-6"
                onClick={() => handleRemoveMember(member.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div>
                <Label htmlFor={`member-name-${index}`}>Name</Label>
                <Input
                  id={`member-name-${index}`}
                  value={member.name}
                  onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)}
                  placeholder="Enter name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor={`member-email-${index}`}>Email</Label>
                <Input
                  id={`member-email-${index}`}
                  value={member.email}
                  onChange={(e) => handleMemberChange(member.id, 'email', e.target.value)}
                  placeholder="Enter email"
                  type="email"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor={`member-role-${index}`}>Role</Label>
                <Select
                  value={member.role}
                  onValueChange={(value) => handleMemberChange(member.id, 'role', value)}
                >
                  <SelectTrigger id={`member-role-${index}`} className="mt-1">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map(role => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor={`member-responsibilities-${index}`}>Responsibilities</Label>
                <Textarea
                  id={`member-responsibilities-${index}`}
                  value={member.responsibilities || ""}
                  onChange={(e) => handleMemberChange(member.id, 'responsibilities', e.target.value)}
                  placeholder="Describe responsibilities for this RFP"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <h4 className="text-md font-semibold mb-2">Shared Email Interface (for Collaborators)</h4>
          <p className="text-sm text-muted-foreground">
            A shared email interface (e.g., email address input, body, send button) for collaborators will appear here.
            This feature requires backend integration to handle email sending and communication.
          </p>
          {/* Placeholder for actual email fields and send button. Example:
          <div className="space-y-2 mt-2">
            <Input placeholder="Recipient Email Address" disabled />
            <Textarea placeholder="Email Body" rows={3} disabled />
            <Button disabled>Send Email</Button>
          </div>
          */}
        </div>
      </CardContent>
    </Card>
  );
};

export default Team;
