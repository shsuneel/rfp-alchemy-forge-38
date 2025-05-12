
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigation } from "@/hooks/useNavigation";
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
import { ROUTES } from "@/routes";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const { navigateTo } = useNavigation();
  
  const menuItems = [
    { 
      title: "RFP Builder", 
      icon: <FileText className="h-5 w-5" />, 
      path: ROUTES.HOME + "?tab=rfp",
      active: location.pathname === ROUTES.HOME && (!location.search || location.search.includes("tab=rfp"))
    },
    { 
      title: "Presentations", 
      icon: <Presentation className="h-5 w-5" />,
      path: ROUTES.HOME + "?tab=presentation",
      active: location.pathname === ROUTES.HOME && location.search.includes("tab=presentation")
    },
    { 
      title: "Estimates", 
      icon: <Calculator className="h-5 w-5" />,
      path: ROUTES.ESTIMATES,
      active: location.pathname === ROUTES.ESTIMATES
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
    if (path.startsWith('#')) return;
    
    // Use the navigateTo function which prevents flickering
    if (path.includes('?')) {
      const [route, search] = path.split('?');
      navigateTo(route, undefined, { replace: false, state: { fromSidebar: true } });
    } else {
      navigateTo(path, undefined, { replace: false, state: { fromSidebar: true } });
    }
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
