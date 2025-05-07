
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { FileText, Trash2, Clock, Calendar } from "lucide-react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { RfpData, loadRfp, deleteRfp, clearCurrentRfp } from "@/store/rfpSlice";
import { format } from "date-fns";
import { toast } from "sonner";

const RfpList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const savedRfps = useAppSelector(state => state.rfp.savedRfps);
  const [rfpToDelete, setRfpToDelete] = useState<string | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const handleLoadRfp = (rfpId: string) => {
    dispatch(loadRfp(rfpId));
    toast.success("RFP loaded successfully");
    navigate("/?tab=rfp");
  };

  const handleDeleteRfp = (rfpId: string) => {
    setRfpToDelete(rfpId);
    setIsDeleteAlertOpen(true);
  };

  const confirmDeleteRfp = () => {
    if (rfpToDelete) {
      dispatch(deleteRfp(rfpToDelete));
      setRfpToDelete(null);
      toast.success("RFP deleted successfully");
    }
    setIsDeleteAlertOpen(false);
  };

  const handleCreateNew = () => {
    dispatch(clearCurrentRfp());
    toast.success("Started a new RFP");
    navigate("/?tab=rfp");
  };

  if (savedRfps.length === 0) {
    return (
      <Card className="col-span-3 p-6 flex flex-col items-center justify-center h-64">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No Saved RFPs</h3>
        <p className="text-muted-foreground text-center mb-4">
          You haven't created any RFPs yet. Start by creating your first RFP.
        </p>
        <Button onClick={handleCreateNew}>Create New RFP</Button>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Saved RFPs</h2>
        <Button onClick={handleCreateNew}>Create New RFP</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedRfps.map((rfp) => (
          <Card key={rfp.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{rfp.projectName}</CardTitle>
              <CardDescription className="line-clamp-2">
                {rfp.projectDescription || "No description provided"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <span>Created: {format(new Date(rfp.createdAt), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Updated: {format(new Date(rfp.updatedAt), 'MMM d, yyyy')}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2 border-t">
              <Button variant="outline" onClick={() => handleLoadRfp(rfp.id)}>
                Open
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDeleteRfp(rfp.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the RFP and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRfp} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RfpList;
