
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { UserStory, Screen, Api, addUserStory, addScreen, addApi, updatePlatformConfig } from '@/store/estimatesSlice';
import EstimationTable from "@/components/estimates/EstimationTable";
import UserStoryForm from "@/components/estimates/UserStoryForm";
import ScreenForm from "@/components/estimates/ScreenForm";
import ApiForm from "@/components/estimates/ApiForm";
import PlatformConfigForm from "@/components/estimates/PlatformConfigForm";
import { setEstimatesActiveTab } from '@/store/navigationSlice';

const EstimatesContent = () => {
  const dispatch = useAppDispatch();
  
  // Get the current active tab from Redux
  const { estimatesActiveTab } = useAppSelector(state => state.navigation);
  
  // Get the estimates data from the Redux store
  const {
    userStories,
    screens,
    apis,
    platformConfig,
    totalEffort,
    totalCost,
  } = useAppSelector(state => state.estimates);
  
  // Handle form submissions for different components
  const handleAddUserStory = (story: UserStory) => {
    dispatch(addUserStory(story));
  };

  const handleAddScreen = (screen: Screen) => {
    dispatch(addScreen(screen));
  };

  const handleAddApi = (api: Api) => {
    dispatch(addApi(api));
  };

  const handleUpdatePlatformConfig = (config: any) => {
    dispatch(updatePlatformConfig(config));
  };

  // Update Redux when the active tab changes
  const handleTabChange = (tab: string) => {
    dispatch(setEstimatesActiveTab(tab));
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Effort Estimation</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs value={estimatesActiveTab} onValueChange={handleTabChange}>
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
                onUpdate={handleUpdatePlatformConfig}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Display estimation results */}
      <EstimationTable />
    </div>
  );
};

export default EstimatesContent;
