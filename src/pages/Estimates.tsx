
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
  updateUserStory,
  updateScreen,
  updateApi,
  setContingency,
  setRiskFactor,
  UserStory,
  Screen,
  Api
} from "@/store/estimatesSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Calculator, Edit, FileDown } from "lucide-react";
import { toast } from "sonner";

import UserStoryForm from "@/components/estimates/UserStoryForm";
import ScreenForm from "@/components/estimates/ScreenForm";
import ApiForm from "@/components/estimates/ApiForm";
import EstimationTable from "@/components/estimates/EstimationTable";
import PlatformConfigForm from "@/components/estimates/PlatformConfigForm";

const Estimates = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<string>("userStories");
  const [editingItem, setEditingItem] = useState<{ type: 'story' | 'screen' | 'api', item: any } | null>(null);
  
  const userStories = useAppSelector(state => state.estimates.userStories);
  const screens = useAppSelector(state => state.estimates.screens);
  const apis = useAppSelector(state => state.estimates.apis);
  const contingency = useAppSelector(state => state.estimates.contingency);
  const riskFactor = useAppSelector(state => state.estimates.riskFactor);
  
  const handleAddUserStory = (story: UserStory) => {
    if (editingItem && editingItem.type === 'story') {
      dispatch(updateUserStory({ ...story, id: editingItem.item.id }));
      setEditingItem(null);
      toast.success("User story updated");
      return;
    }
    
    dispatch(addUserStory(story));
    toast.success("User story added");
  };
  
  const handleEditUserStory = (story: UserStory) => {
    setEditingItem({ type: 'story', item: story });
    setActiveTab("userStories");
  };
  
  const handleDeleteUserStory = (id: string) => {
    dispatch(deleteUserStory(id));
    toast.success("User story removed");
    if (editingItem?.type === 'story' && editingItem.item.id === id) {
      setEditingItem(null);
    }
  };
  
  const handleAddScreen = (screen: Screen) => {
    if (editingItem && editingItem.type === 'screen') {
      dispatch(updateScreen({ ...screen, id: editingItem.item.id }));
      setEditingItem(null);
      toast.success("Screen updated");
      return;
    }
    
    dispatch(addScreen(screen));
    toast.success("Screen added");
  };
  
  const handleEditScreen = (screen: Screen) => {
    setEditingItem({ type: 'screen', item: screen });
    setActiveTab("screens");
  };
  
  const handleDeleteScreen = (id: string) => {
    dispatch(deleteScreen(id));
    toast.success("Screen removed");
    if (editingItem?.type === 'screen' && editingItem.item.id === id) {
      setEditingItem(null);
    }
  };
  
  const handleAddApi = (api: Api) => {
    if (editingItem && editingItem.type === 'api') {
      dispatch(updateApi({ ...api, id: editingItem.item.id }));
      setEditingItem(null);
      toast.success("API updated");
      return;
    }
    
    dispatch(addApi(api));
    toast.success("API added");
  };
  
  const handleEditApi = (api: Api) => {
    setEditingItem({ type: 'api', item: api });
    setActiveTab("apis");
  };
  
  const handleDeleteApi = (id: string) => {
    dispatch(deleteApi(id));
    toast.success("API removed");
    if (editingItem?.type === 'api' && editingItem.item.id === id) {
      setEditingItem(null);
    }
  };
  
  const handleSaveEstimate = () => {
    // In a real app, this would save to a database
    toast.success("Estimate saved successfully!");
  };
  
  const handleExportEstimate = () => {
    // In a real app, this would export the estimate to a PDF or Excel file
    toast.success("Estimate exported successfully!");
  };
  
  const handleCancelEdit = () => {
    setEditingItem(null);
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
                <CardTitle>
                  {editingItem ? `Edit ${
                    editingItem.type === 'story' ? 'User Story' : 
                    editingItem.type === 'screen' ? 'Screen' : 'API'
                  }` : "Add Components"}
                </CardTitle>
                <CardDescription>
                  {editingItem 
                    ? `Update the ${editingItem.type === 'story' ? 'user story' : editingItem.type} details` 
                    : "Add items to include in your estimate"}
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
                    <UserStoryForm 
                      onAdd={handleAddUserStory} 
                      initialData={editingItem?.type === 'story' ? editingItem.item : undefined}
                      onCancel={editingItem ? handleCancelEdit : undefined}
                    />
                  </TabsContent>
                  
                  <TabsContent value="screens" className="mt-0">
                    <ScreenForm 
                      onAdd={handleAddScreen} 
                      initialData={editingItem?.type === 'screen' ? editingItem.item : undefined}
                      onCancel={editingItem ? handleCancelEdit : undefined}
                    />
                  </TabsContent>
                  
                  <TabsContent value="apis" className="mt-0">
                    <ApiForm 
                      onAdd={handleAddApi} 
                      initialData={editingItem?.type === 'api' ? editingItem.item : undefined}
                      onCancel={editingItem ? handleCancelEdit : undefined}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <PlatformConfigForm />
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleSaveEstimate} 
                className="flex items-center justify-center" 
                size="lg"
              >
                <Save className="h-4 w-4 mr-2" /> Save Estimate
              </Button>
              
              <Button 
                onClick={handleExportEstimate} 
                variant="outline"
                className="flex items-center justify-center" 
                size="lg"
              >
                <FileDown className="h-4 w-4 mr-2" /> Export Estimate
              </Button>
            </div>
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
                onEditStory={handleEditUserStory}
                onEditScreen={handleEditScreen}
                onEditApi={handleEditApi}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Estimates;
