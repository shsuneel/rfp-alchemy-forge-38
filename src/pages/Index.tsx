
import { useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/layout/Sidebar";
import PresentationEditor from "@/components/presentation/PresentationEditor";
import RfpForm from "@/components/RfpForm";
import RfpList from "@/components/RfpList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Presentation, Calculator, List, Files } from "lucide-react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { setCurrentTab } from "@/store/navigationSlice";
import EstimatesContent from "@/components/estimates/EstimatesContent";
import DocumentsTab from "@/components/documents/DocumentsTab";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const { currentTab } = useAppSelector(state => state.navigation);
  
  const tabFromUrl = searchParams.get('tab');
  const locationState = location.state as { tab?: string; fromSidebar?: boolean } | null;
  
  // Update Redux state when URL changes
  useEffect(() => {
    if (tabFromUrl) {
      dispatch(setCurrentTab(tabFromUrl));
    } else if (locationState?.tab) {
      dispatch(setCurrentTab(locationState.tab));
    }
  }, [tabFromUrl, locationState, dispatch]);

  // Update URL when Redux state changes
  useEffect(() => {
    // Only update the URL if the tab has actually changed
    const currentTabInUrl = searchParams.get('tab');
    if (currentTabInUrl !== currentTab) {
      setSearchParams({ tab: currentTab }, { replace: true });
    }
  }, [currentTab, searchParams, setSearchParams]);

  const handleTabChange = (newTabValue: string) => {
    dispatch(setCurrentTab(newTabValue));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-full mx-auto">
            <header className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-3xl font-bold">RFP Presentation Forge</h1>
              </div>
              <p className="text-muted-foreground mb-6">
                Create professional RFPs and presentations for your client proposals
              </p>
              
              <Tabs value={currentTab} onValueChange={handleTabChange}>
                <TabsList className="mb-4">
                  <TabsTrigger value="rfpList" className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    RFP List
                  </TabsTrigger>
                  <TabsTrigger value="rfp" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    RFP Builder
                  </TabsTrigger>
                  <TabsTrigger value="presentation" className="flex items-center gap-2">
                    <Presentation className="h-4 w-4" />
                    Presentation
                  </TabsTrigger>
                  <TabsTrigger value="estimates" className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Estimates
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center gap-2">
                    <Files className="h-4 w-4" />
                    Documents
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="rfpList" className="mt-0">
                  <RfpList />
                </TabsContent>
                
                <TabsContent value="rfp" className="mt-0">
                  <RfpForm />
                </TabsContent>
                
                <TabsContent value="presentation" className="mt-0">
                  <PresentationEditor />
                </TabsContent>

                <TabsContent value="estimates" className="mt-0">
                  <EstimatesContent />
                </TabsContent>

                <TabsContent value="documents" className="mt-0">
                  <DocumentsTab />
                </TabsContent>
              </Tabs>
            </header>
            
            <footer className="mt-12 pt-4 border-t text-center text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} RFP Alchemy Forge. All rights reserved.</p>
            </footer>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
