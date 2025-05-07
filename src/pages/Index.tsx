
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/layout/Sidebar";
import PresentationEditor from "@/components/presentation/PresentationEditor";
import RfpForm from "@/components/RfpForm";
import RfpList from "@/components/RfpList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Presentation, Calculator, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<string>(tabFromUrl || "rfpList");

  // Update URL when tab changes
  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  // Update tab when URL changes
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-full mx-auto">
            <header className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-3xl font-bold">RFP Presentation Forge</h1>
                <Link to="/estimates">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Estimates
                  </Button>
                </Link>
              </div>
              <p className="text-muted-foreground mb-6">
                Create professional RFPs and presentations for your client proposals
              </p>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                    Presentation Editor
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
