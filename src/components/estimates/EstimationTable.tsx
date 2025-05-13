import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserStory, Screen, Api, FormFactor, Browser, ComplexityLevels } from "@/store/estimatesSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { deleteUserStory, deleteScreen, deleteApi } from "@/store/estimatesSlice";

interface EstimationTableProps {
  onEditStory?: (story: UserStory) => void;
  onEditScreen?: (screen: Screen) => void;
  onEditApi?: (api: Api) => void;
}

const EstimationTable: React.FC<EstimationTableProps> = ({ 
  onEditStory,
  onEditScreen,
  onEditApi 
}) => {
  const dispatch = useAppDispatch();
  const userStories = useAppSelector((state) => state.estimates.userStories);
  const screens = useAppSelector((state) => state.estimates.screens);
  const apis = useAppSelector((state) => state.estimates.apis);
  const formFactors = useAppSelector((state) => state.estimates.formFactors).filter(ff => ff.isSelected);
  const browsers = useAppSelector((state) => state.estimates.browsers).filter(b => b.isSelected);
  const contingency = useAppSelector((state) => state.estimates.contingency);
  const riskFactor = useAppSelector((state) => state.estimates.riskFactor);

  const handleDeleteStory = (id: string) => {
    dispatch(deleteUserStory(id));
  };

  const handleDeleteScreen = (id: string) => {
    dispatch(deleteScreen(id));
  };

  const handleDeleteApi = (id: string) => {
    dispatch(deleteApi(id));
  };

  // Calculate base effort
  const userStoriesEffort = userStories.reduce((sum, story) => sum + story.effortDays, 0);
  const screensEffort = screens.reduce((sum, screen) => sum + screen.effortDays, 0);
  const apisEffort = apis.reduce((sum, api) => sum + api.effortDays, 0);
  
  // Calculate form factor and browser multipliers
  const ffMultiplier = formFactors.length > 0 
    ? formFactors.reduce((sum, ff) => sum + ff.effort, 0) / formFactors.length
    : 1;
  
  const browserMultiplier = browsers.length > 0 
    ? browsers.reduce((sum, b) => sum + b.effort, 0) / browsers.length
    : 1;
  
  // Calculate total base effort
  const baseEffort = userStoriesEffort + screensEffort + apisEffort;
  
  // Apply multipliers
  const adjustedEffort = baseEffort * ffMultiplier * browserMultiplier;
  
  // Apply contingency and risk factor
  const contingencyDays = adjustedEffort * (contingency / 100);
  const riskDays = adjustedEffort * (riskFactor / 100);
  
  // Calculate final estimate
  const totalEstimate = adjustedEffort + contingencyDays + riskDays;
  
  // Format to 1 decimal place
  const formatDays = (days: number) => days.toFixed(1);

  const getComplexityBadge = (complexity: "Low" | "Medium" | "High") => {
    switch (complexity) {
      case "Low":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Low</Badge>;
      case "Medium":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Medium</Badge>;
      case "High":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">High</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {userStories.length > 0 && (
        <Table>
          <TableCaption>User Stories Estimation</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Title</TableHead>
              <TableHead>UI</TableHead>
              <TableHead>Middleware</TableHead>
              <TableHead>Business Logic</TableHead>
              <TableHead>Integration</TableHead>
              <TableHead className="w-[100px]">Effort (days)</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userStories.map((story) => (
              <TableRow key={story.id}>
                <TableCell className="font-medium">{story.title}</TableCell>
                <TableCell>{getComplexityBadge(story.complexity.ui)}</TableCell>
                <TableCell>{getComplexityBadge(story.complexity.middleware)}</TableCell>
                <TableCell>{getComplexityBadge(story.complexity.businessLogic)}</TableCell>
                <TableCell>{getComplexityBadge(story.complexity.integration)}</TableCell>
                <TableCell>{formatDays(story.effortDays)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {onEditStory && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEditStory(story)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteStory(story.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/50">
              <TableCell colSpan={5} className="font-medium">User Stories Subtotal</TableCell>
              <TableCell className="font-medium">{formatDays(userStoriesEffort)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
      
      {screens.length > 0 && (
        <Table>
          <TableCaption>Screens Estimation</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Screen</TableHead>
              <TableHead>Complexity</TableHead>
              <TableHead className="w-[150px]">Effort (days)</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {screens.map((screen) => (
              <TableRow key={screen.id}>
                <TableCell className="font-medium">{screen.name}</TableCell>
                <TableCell>{getComplexityBadge(screen.complexity)}</TableCell>
                <TableCell>{screen.effortDays}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {onEditScreen && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEditScreen(screen)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteScreen(screen.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete screen</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/50">
              <TableCell colSpan={2} className="font-medium">Screens Subtotal</TableCell>
              <TableCell className="font-medium">{formatDays(screensEffort)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
      
      {apis.length > 0 && (
        <Table>
          <TableCaption>APIs Estimation</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">API</TableHead>
              <TableHead>Complexity</TableHead>
              <TableHead className="w-[150px]">Effort (days)</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apis.map((api) => (
              <TableRow key={api.id}>
                <TableCell className="font-medium">{api.name}</TableCell>
                <TableCell>{getComplexityBadge(api.complexity)}</TableCell>
                <TableCell>{api.effortDays}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {onEditApi && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEditApi(api)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteApi(api.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete API</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/50">
              <TableCell colSpan={2} className="font-medium">APIs Subtotal</TableCell>
              <TableCell className="font-medium">{formatDays(apisEffort)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
      
      <Table>
        <TableCaption>Final Estimation</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[350px]">Item</TableHead>
            <TableHead className="w-[150px]">Value</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Base Effort</TableCell>
            <TableCell>{formatDays(baseEffort)} days</TableCell>
            <TableCell className="text-muted-foreground">
              Sum of all user stories, screens, and APIs
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Form Factors</TableCell>
            <TableCell>x{ffMultiplier.toFixed(2)}</TableCell>
            <TableCell className="text-muted-foreground">
              {formFactors.map(ff => ff.name).join(', ')}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Browsers</TableCell>
            <TableCell>x{browserMultiplier.toFixed(2)}</TableCell>
            <TableCell className="text-muted-foreground">
              {browsers.map(b => b.name).join(', ')}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Adjusted Effort</TableCell>
            <TableCell>{formatDays(adjustedEffort)} days</TableCell>
            <TableCell className="text-muted-foreground">
              Base effort with form factor and browser multipliers
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Contingency ({contingency}%)</TableCell>
            <TableCell>+{formatDays(contingencyDays)} days</TableCell>
            <TableCell className="text-muted-foreground">
              Buffer for uncertainties
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Risk Factor ({riskFactor}%)</TableCell>
            <TableCell>+{formatDays(riskDays)} days</TableCell>
            <TableCell className="text-muted-foreground">
              Buffer for project risks
            </TableCell>
          </TableRow>
          <TableRow className="font-bold">
            <TableCell>Total Estimate</TableCell>
            <TableCell>{formatDays(totalEstimate)} days</TableCell>
            <TableCell className="text-muted-foreground">
              Final project duration estimate
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default EstimationTable;
