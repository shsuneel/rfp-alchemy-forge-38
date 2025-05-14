
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Eye, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type Document = {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
};

const DocumentsTab = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "doc-1",
      name: "RFP Requirements.pdf",
      type: "PDF",
      size: "2.4 MB",
      uploadDate: "2025-05-10",
    },
    {
      id: "doc-2",
      name: "Client Brief.docx",
      type: "DOCX",
      size: "1.8 MB",
      uploadDate: "2025-05-08",
    },
    {
      id: "doc-3",
      name: "Technical Specifications.xlsx",
      type: "XLSX",
      size: "3.2 MB",
      uploadDate: "2025-05-07",
    },
  ]);

  const handleView = (document: Document) => {
    toast({
      title: "Viewing Document",
      description: `Opening ${document.name}`,
    });
  };

  const handleDownload = (document: Document) => {
    toast({
      title: "Downloading Document",
      description: `Downloading ${document.name}`,
    });
  };

  const handleDelete = (documentId: string) => {
    setDocuments(documents.filter((doc) => doc.id !== documentId));
    toast({
      title: "Document Deleted",
      description: "The document has been removed",
      variant: "destructive",
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>RFP Documents</CardTitle>
          <CardDescription>
            View and manage all documents related to this RFP
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium">{document.name}</TableCell>
                    <TableCell>{document.type}</TableCell>
                    <TableCell>{document.size}</TableCell>
                    <TableCell>{document.uploadDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleView(document)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownload(document)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(document.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center p-8">
              <p className="text-muted-foreground mb-4">No documents uploaded yet</p>
              <Button>Upload New Document</Button>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Upload New Document</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
            <p className="mb-2 text-sm text-muted-foreground">Drag and drop a file here, or click to browse</p>
            <Button variant="secondary">Browse Files</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsTab;
