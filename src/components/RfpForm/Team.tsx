
import { useState, useEffect } from "react";
import { X, Plus, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { v4 as uuidv4 } from "@reduxjs/toolkit";
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
      setTeam(initialTeam);
    }
  }, [initialTeam]);
  
  const handleAddMember = () => {
    const newMember: TeamMember = {
      id: uuidv4(),
      name: "",
      email: "",
      role: "Developer"
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Information
        </CardTitle>
        <CardDescription>
          Add team members who will be involved in this RFP
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <Label htmlFor="thorId">Thor ID</Label>
          <Input 
            id="thorId" 
            placeholder="Enter Thor ID"
            value={team[0]?.id === "thor-id" ? team[0].name : ""}
            onChange={(e) => {
              // Special handling for Thor ID as a hidden team member
              const thorId = e.target.value;
              let newTeam = [...team];
              const thorIdIndex = newTeam.findIndex(m => m.id === "thor-id");
              
              if (thorIdIndex >= 0) {
                newTeam[thorIdIndex] = { ...newTeam[thorIdIndex], name: thorId };
              } else {
                newTeam.push({ id: "thor-id", name: thorId, email: "", role: "ThorID" });
              }
              
              setTeam(newTeam);
              onTeamChange(newTeam);
            }}
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Team Members</Label>
            <Button 
              type="button" 
              size="sm"
              variant="outline" 
              onClick={handleAddMember}
              className="flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> Add Member
            </Button>
          </div>
          
          {team.filter(m => m.id !== "thor-id").map((member, index) => (
            <div key={member.id} className="p-3 border rounded-md relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-6 w-6"
                onClick={() => handleRemoveMember(member.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="grid gap-3">
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
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Team;
