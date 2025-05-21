
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
  // SidebarTrigger, // Not used directly here, toggle is custom
  useSidebar // Import useSidebar hook
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Presentation, 
  Settings, 
  ChevronRight, 
  ChevronLeft, 
  Layout, 
  // Layers // Layers icon not used in menuItems
} from "lucide-react";
import { ROUTES } from "@/routes";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setCurrentTab } from "@/store/navigationSlice";

export const Sidebar = () => {
  // const [isOpen, setIsOpen] = useState(true); // Remove local state
  const { open, toggleSidebar, isMobile } // Get state and toggle function from context
    = useSidebar(); 
  
  const location = useLocation();
  const { navigateTo } = useNavigation();
  const { currentTab } = useAppSelector(state => state.navigation);
  const dispatch = useAppDispatch();
  
  const menuItems = [
    { 
      title: "RFP Builder", 
      icon: <FileText className="h-5 w-5" />, 
      path: ROUTES.HOME,
      tabValue: "rfp",
      active: location.pathname === ROUTES.HOME && currentTab === "rfp"
    },
    { 
      title: "Presentations", 
      icon: <Presentation className="h-5 w-5" />,
      path: ROUTES.HOME,
      tabValue: "presentation",
      active: location.pathname === ROUTES.HOME && currentTab === "presentation"
    },
    { 
      title: "RFP List", 
      icon: <Layout className="h-5 w-5" />,
      path: ROUTES.HOME,
      tabValue: "rfpList",
      active: location.pathname === ROUTES.HOME && currentTab === "rfpList"
    },
    { 
      title: "Settings", 
      icon: <Settings className="h-5 w-5" />,
      path: "#", // Path "#" indicates no navigation action
      active: false
    },
  ];

  const handleNavigation = (path: string, tabValue?: string) => {
    if (path.startsWith('#')) return;
    
    if (path === ROUTES.HOME && tabValue) {
      dispatch(setCurrentTab(tabValue));
    }
    
    navigateTo(path, undefined, { replace: false, state: { fromSidebar: true, tab: tabValue } });
  };

  // On mobile, the ui/sidebar.tsx Sheet component takes over.
  // The `open` state from useSidebar refers to the desktop sidebar state.
  // If it's mobile, the sidebar content defined here will be inside the Sheet,
  // and the Sheet has its own open/close mechanism.
  // The `toggleSidebar` function from `useSidebar` correctly handles toggling 
  // for both mobile (Sheet) and desktop (collapsible sidebar).

  return (
    <SidebarComponent collapsible="icon"> {/* Add collapsible="icon" prop */}
      <SidebarHeader className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center">
            <Presentation className="h-5 w-5 text-accent-foreground" />
          </div>
          {/* Use `open` from context for conditional rendering (for desktop) */}
          {/* On mobile, the ui/sidebar.tsx Sheet will manage full visibility, so this condition primarily affects desktop */}
          {(open || isMobile) && <h3 className="font-bold text-sidebar-foreground">RFP Alchemy</h3>}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} // Use toggleSidebar from context
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {/* Use `open` from context for icon (for desktop) */}
          {/* isMobile check can be added if specific mobile icon behavior is needed, but toggleSidebar handles it */}
          {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          {/* SidebarGroupLabel is styled by ui/sidebar.tsx to hide on icon collapse */}
          {/* The className toggle here is mostly for 'offcanvas' or if specific sr-only is needed beyond ui/sidebar's handling */}
          <SidebarGroupLabel className={(open || isMobile) ? "" : "sr-only"}>
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={item.active ? "bg-sidebar-accent" : ""}
                    onClick={() => handleNavigation(item.path, item.tabValue)}
                    // Tooltip for collapsed state can be added here if desired,
                    // by passing `tooltip={item.title}` to SidebarMenuButton
                  >
                    <button className="flex items-center space-x-2">
                      {item.icon}
                      {/* Always render the span; ui/sidebar.tsx handles its visibility/truncation */}
                      <span>{item.title}</span>
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
