
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/layout/Sidebar";
import RfpForm from "@/components/RfpForm";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-2">RFP Alchemy Forge</h1>
              <p className="text-muted-foreground">
                Create comprehensive, professional Requests for Proposals with ease
              </p>
            </header>
            
            <main>
              <RfpForm />
            </main>
            
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
