import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { UserStory, Screen, Api } from '@/store/estimatesSlice';
import EstimationTable from "@/components/estimates/EstimationTable";
import UserStoryForm from "@/components/estimates/UserStoryForm";
import ScreenForm from "@/components/estimates/ScreenForm";
import ApiForm from "@/components/estimates/ApiForm";
import PlatformConfigForm from "@/components/estimates/PlatformConfigForm";
import { ArrowLeft } from 'lucide-react';
import { useNavigation } from '@/hooks/useNavigation';
import { ROUTES } from '@/routes';

interface EstimatesProps {
  // Define any props here
}

const Estimates = () => {
  const [activeTab, setActiveTab] = useState('userStories');
  const location = useLocation();
  const { goToHome } = useNavigation();
  
  // Get the estimates data from the Redux store
  const {
    userStories,
    screens,
    apis,
    platformConfig,
    totalEffort,
    totalCost,
  } = useAppSelector(state => state.estimates);
  
  const dispatch = useAppDispatch();
  
  // Handle form submissions for different components
  const handleAddUserStory = (story: UserStory) => {
    dispatch({
      type: 'estimates/addUserStory',
      payload: story,
    });
  };

  const handleAddScreen = (screen: Screen) => {
    dispatch({
      type: 'estimates/addScreen',
      payload: screen,
    });
  };

  const handleAddApi = (api: Api) => {
    dispatch({
      type: 'estimates/addApi',
      payload: api,
    });
  };

  const handleUpdatePlatformConfig = (config: any) => {
    dispatch({
      type: 'estimates/updatePlatformConfig',
      payload: config,
    });
  };

  const handleGoBack = () => {
    goToHome();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Button 
            variant="outline" 
            onClick={handleGoBack}
            className="mb-4" 
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to RFP Builder
          </Button>
          
          <div className="max-w-full mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Project Estimations</h1>
              <p className="text-muted-foreground">
                Build detailed project estimates for RFPs
              </p>
            </header>
            
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Effort Estimation</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4 grid grid-cols-4 lg:w-[600px]">
                      <TabsTrigger value="userStories">User Stories</TabsTrigger>
                      <TabsTrigger value="screens">Screens</TabsTrigger>
                      <TabsTrigger value="apis">APIs</TabsTrigger>
                      <TabsTrigger value="platform">Platform</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="userStories">
                      <UserStoryForm 
                        onAdd={handleAddUserStory} 
                      />
                    </TabsContent>
                    
                    <TabsContent value="screens">
                      <ScreenForm 
                        onAdd={handleAddScreen} 
                      />
                    </TabsContent>
                    
                    <TabsContent value="apis">
                      <ApiForm 
                        onAdd={handleAddApi} 
                      />
                    </TabsContent>
                    
                    <TabsContent value="platform">
                      <PlatformConfigForm 
                        config={platformConfig}
                        onUpdate={handleUpdatePlatformConfig}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              {/* Display estimation results */}
              <EstimationTable 
                userStories={userStories}
                screens={screens}
                apis={apis}
                platformConfig={platformConfig}
                totalEffort={totalEffort}
                totalCost={totalCost}
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Estimates;
