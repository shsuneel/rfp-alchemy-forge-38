
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { 
  FileText, 
  FilePlus, 
  Settings, 
  Calculator, 
  ChevronRight, 
  ChevronLeft, 
  Presentation, 
  Layout, 
  Layers 
} from "lucide-react";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    { 
      title: "RFP Builder", 
      icon: <FileText className="h-5 w-5" />, 
      path: "/?tab=rfp",
      active: location.pathname === "/" && (!location.search || location.search.includes("tab=rfp"))
    },
    { 
      title: "Presentations", 
      icon: <Presentation className="h-5 w-5" />,
      path: "/?tab=presentation",
      active: location.pathname === "/" && location.search.includes("tab=presentation")
    },
    { 
      title: "Estimates", 
      icon: <Calculator className="h-5 w-5" />,
      path: "/estimates",
      active: location.pathname === "/estimates"
    },
    { 
      title: "Templates", 
      icon: <Layout className="h-5 w-5" />,
      path: "#",
      active: false
    },
    { 
      title: "Settings", 
      icon: <Settings className="h-5 w-5" />,
      path: "#",
      active: false
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <SidebarComponent>
      <SidebarHeader className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center">
            <Presentation className="h-5 w-5 text-accent-foreground" />
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
                  <SidebarMenuButton 
                    asChild 
                    className={item.active ? "bg-sidebar-accent" : ""}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <button className="flex items-center space-x-2">
                      {item.icon}
                      {isOpen && <span>{item.title}</span>}
                    </button>
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
