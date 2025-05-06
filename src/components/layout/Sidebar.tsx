
import { useState } from "react";
import { 
  Sidebar as SidebarComponent, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { FileText, FilePlus, Settings, Calendar, ChevronRight, ChevronLeft } from "lucide-react";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  
  const menuItems = [
    { title: "My RFPs", icon: <FileText className="h-5 w-5" />, active: true },
    { title: "New RFP", icon: <FilePlus className="h-5 w-5" /> },
    { title: "Timeline", icon: <Calendar className="h-5 w-5" /> },
    { title: "Settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <SidebarComponent defaultCollapsed={false} collapsed={!isOpen}>
      <SidebarHeader className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center">
            <FileText className="h-5 w-5 text-accent-foreground" />
          </div>
          {isOpen && <h3 className="font-bold text-sidebar-foreground">RFP Alchemy</h3>}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={isOpen ? "" : "sr-only"}>
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={item.active ? "bg-sidebar-accent" : ""}>
                    <a href="#" className="flex items-center space-x-2">
                      {item.icon}
                      {isOpen && <span>{item.title}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarComponent>
  );
};

export default Sidebar;
