
import { useState } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { 
  addUserStory, 
  deleteUserStory, 
  addScreen, 
  deleteScreen,
  addApi,
  deleteApi,
  UserStory,
  Screen,
  Api
} from "@/store/estimatesSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Calculator } from "lucide-react";
import { toast } from "sonner";

import UserStoryForm from "@/components/estimates/UserStoryForm";
import ScreenForm from "@/components/estimates/ScreenForm";
import ApiForm from "@/components/estimates/ApiForm";
import EstimationTable from "@/components/estimates/EstimationTable";
import PlatformConfigForm from "@/components/estimates/PlatformConfigForm";

const Estimates = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<string>("userStories");
  
  const handleAddUserStory = (story: UserStory) => {
    dispatch(addUserStory(story));
    toast.success("User story added");
  };
  
  const handleDeleteUserStory = (id: string) => {
    dispatch(deleteUserStory(id));
    toast.success("User story removed");
  };
  
  const handleAddScreen = (screen: Screen) => {
    dispatch(addScreen(screen));
    toast.success("Screen added");
  };
  
  const handleDeleteScreen = (id: string) => {
    dispatch(deleteScreen(id));
    toast.success("Screen removed");
  };
  
  const handleAddApi = (api: Api) => {
    dispatch(addApi(api));
    toast.success("API added");
  };
  
  const handleDeleteApi = (id: string) => {
    dispatch(deleteApi(id));
    toast.success("API removed");
  };
  
  const handleSaveEstimate = () => {
    // In a real app, this would save to a database
    toast.success("Estimate saved successfully!");
  };

  return (
    <div className="container mx-auto py-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Project Estimates</h1>
        <p className="text-muted-foreground mb-6">
          Calculate project estimates based on user stories, screens, APIs, and technical requirements
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="space-y-6 sticky top-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Components</CardTitle>
                <CardDescription>
                  Add items to include in your estimate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4 w-full">
                    <TabsTrigger value="userStories" className="flex-1">User Stories</TabsTrigger>
                    <TabsTrigger value="screens" className="flex-1">Screens</TabsTrigger>
                    <TabsTrigger value="apis" className="flex-1">APIs</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="userStories" className="mt-0">
                    <UserStoryForm onAdd={handleAddUserStory} />
                  </TabsContent>
                  
                  <TabsContent value="screens" className="mt-0">
                    <ScreenForm onAdd={handleAddScreen} />
                  </TabsContent>
                  
                  <TabsContent value="apis" className="mt-0">
                    <ApiForm onAdd={handleAddApi} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <PlatformConfigForm />
            
            <Button 
              onClick={handleSaveEstimate} 
              className="w-full flex items-center justify-center" 
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" /> Save Estimate
            </Button>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Estimation Summary</CardTitle>
                <CardDescription>
                  Detailed breakdown of the project estimate
                </CardDescription>
              </div>
              <Calculator className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <EstimationTable 
                onDeleteStory={handleDeleteUserStory}
                onDeleteScreen={handleDeleteScreen}
                onDeleteApi={handleDeleteApi}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Estimates;
