import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { FileText, Trash2, Clock, Calendar, User, Edit } from "lucide-react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { RfpData, loadRfp, deleteRfp, clearCurrentRfp } from "@/store/rfpSlice";
import { format } from "date-fns";
import { toast } from "sonner";
import { useNavigation } from "@/hooks/useNavigation";
import { ROUTES } from "@/routes";

// Define badge variants based on status
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "InProgress":
      return "warning";
    case "Completed":
      return "success";
    case "OnHold":
      return "neutral";
    case "Draft":
      return "info";
    default:
      return "info";
  }
};

const RfpList = () => {
  const dispatch = useAppDispatch();
  const { navigateTo } = useNavigation();
  const savedRfps = useAppSelector(state => state.rfp.savedRfps);
  const [rfpToDelete, setRfpToDelete] = useState<string | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const handleLoadRfp = (rfpId: string) => {
    dispatch(loadRfp(rfpId));
    toast.success("RFP loaded successfully");
    navigateTo(ROUTES.HOME, undefined, { replace: false, state: { tab: "rfp" } });
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
    navigateTo(ROUTES.HOME, undefined, { replace: false, state: { tab: "rfp" } });
  };

  const handleEditRfp = (rfpId: string) => {
    dispatch(loadRfp(rfpId));
    toast.success("RFP loaded for editing");
    navigateTo(ROUTES.HOME, undefined, { replace: false, state: { tab: "rfp" } });
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
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>RFP Overview</CardTitle>
          <CardDescription>
            Manage and track all your Request For Proposals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Thor ID</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedRfps.map((rfp) => (
                <TableRow key={rfp.id}>
                  <TableCell className="font-medium">{rfp.projectName}</TableCell>
                  <TableCell>{rfp.thorId || "-"}</TableCell>
                  <TableCell>{format(new Date(rfp.createdAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{format(new Date(rfp.updatedAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(rfp.status || 'InProgress')}>
                      {rfp.status || "InProgress"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {rfp.remarks || "-"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEditRfp(rfp.id)} title="Edit">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteRfp(rfp.id)} title="Delete">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
