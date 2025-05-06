
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/layout/Sidebar";
import PresentationEditor from "@/components/presentation/PresentationEditor";
import RfpForm from "@/components/RfpForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Presentation } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("rfp");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-full mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-2">RFP Presentation Forge</h1>
              <p className="text-muted-foreground mb-6">
                Create professional RFPs and presentations for your client proposals
              </p>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="rfp" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    RFP Builder
                  </TabsTrigger>
                  <TabsTrigger value="presentation" className="flex items-center gap-2">
                    <Presentation className="h-4 w-4" />
                    Presentation Editor
                  </TabsTrigger>
                </TabsList>
                
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
