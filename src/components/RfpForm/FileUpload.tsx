import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, X, Scan, ScanText } from "lucide-react";
import { toast } from "sonner";
import { RequirementItem, AssumptionItem, DependencyItem, setPendingFilesForExtraction } from "@/store/rfpSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
}

interface ExtractedInfo {
  projectDescription?: string;
  requirements?: RequirementItem[];
  techStack?: string[];
  assumptions?: AssumptionItem[];
  dependencies?: DependencyItem[];
  externalSystems?: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo | null>(null);

  const dispatch = useAppDispatch();
  const pendingFiles = useAppSelector(state => state.rfp.pendingFilesForExtraction);

  useEffect(() => {
    if (pendingFiles && pendingFiles.length > 0 && files.length === 0) {
      // Only process if there are pending files and current files list is empty
      // to avoid re-processing on component re-renders after initial load.
      addFiles(pendingFiles); // This will also call onFilesChange
      extractInformation(pendingFiles); // Pass files to extract function
      dispatch(setPendingFilesForExtraction(null)); // Clear pending files from store
    }
  }, [pendingFiles, dispatch, files.length]); // Added files.length to dependency array

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      addFiles(newFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    // Prevent adding duplicates if filesFromBot are processed and then user adds more
    const uniqueNewFiles = newFiles.filter(nf => !files.some(f => f.name === nf.name && f.size === nf.size));
    if (uniqueNewFiles.length === 0 && newFiles.length > 0) {
        // If all newFiles were duplicates of already existing files
        if (newFiles.length === 1) toast.info(`File "${newFiles[0].name}" is already listed.`);
        else toast.info(`${newFiles.length} files are already listed.`);
        return;
    }
    
    const updatedFiles = [...files, ...uniqueNewFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles); // Notify parent about all current files
    
    if (uniqueNewFiles.length > 0) {
      toast.success(`${uniqueNewFiles.length} file(s) uploaded successfully`);
      setExtractedInfo(null); // Reset extracted info when new distinct files are added
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    const removedFile = updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles); // Notify parent
    toast.info(`File "${removedFile[0].name}" removed.`);
    
    if (updatedFiles.length === 0) {
      setExtractedInfo(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const newFilesToDrop = Array.from(e.dataTransfer.files);
      addFiles(newFilesToDrop);
    }
  };

  const extractInformation = (filesToExtract?: File[]) => {
    const currentFiles = filesToExtract || files; // Use provided files or current state
    if (currentFiles.length === 0) {
      toast.error("Please upload files first");
      return;
    }

    setIsExtracting(true);
    setExtractedInfo(null); // Clear previous extractions

    setTimeout(() => {
      const mockExtractedInfo: ExtractedInfo = {
        projectDescription: `AI-extracted project description from ${currentFiles.map(f=>f.name).join(', ')}: A comprehensive RFP management system.`,
        requirements: [
          { id: "req-1", description: "System must extract information from uploaded documents", priority: "High" },
          { id: "req-2", description: "Extracted information should be editable", priority: "Medium" },
        ],
        techStack: ["React", "Node.js", "Simulated API"],
        assumptions: [
          { id: "assump-1", description: "Documents are in a readable format" },
        ],
        dependencies: [
          { id: "dep-1", description: "Mock Document Parsing Service" },
        ],
        externalSystems: ["Simulated External System"],
      };

      setExtractedInfo(mockExtractedInfo);
      setIsExtracting(false);
      toast.success(`Information extracted successfully from ${currentFiles.length} file(s)`);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Upload existing RFPs, requirements documents, or any files that contain relevant information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? "border-primary bg-primary/5" : "border-muted"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Drag and drop files here</h3>
            <p className="text-muted-foreground mb-4">
              or click to browse files from your computer
            </p>
            <Input
              type="file"
              multiple
              className="hidden"
              id="file-upload"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.md" // Example: common document types
            />
            <Button asChild>
              <label htmlFor="file-upload">Select Files</label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files ({files.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li
                  key={`${file.name}-${file.lastModified}-${index}`} // More robust key
                  className="flex items-center justify-between p-2 rounded bg-muted"
                >
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span className="font-medium truncate max-w-xs sm:max-w-md md:max-w-lg" title={file.name}>{file.name}</span>
                    <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
            
            <div className="mt-4">
              <Button 
                onClick={() => extractInformation()} // Call without args to use current `files` state
                className="w-full flex items-center justify-center"
                disabled={isExtracting || files.length === 0}
              >
                <ScanText className="h-5 w-5 mr-2" />
                {isExtracting ? "Extracting Information..." : "Extract Information from Documents"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {extractedInfo && (
        <Card className="border-primary">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center">
              <Scan className="h-5 w-5 mr-2" />
              Extracted Information
            </CardTitle>
            <CardDescription>
              The AI has automatically extracted the following information from your documents.
              You can review and use this information in your RFP.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 mt-4">
            {extractedInfo.projectDescription && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Project Description</h3>
                <div className="p-3 rounded bg-muted">{extractedInfo.projectDescription}</div>
              </div>
            )}

            {extractedInfo.requirements && extractedInfo.requirements.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Requirements</h3>
                <ul className="space-y-2">
                  {extractedInfo.requirements.map((req, index) => (
                    <li key={index} className="p-3 rounded bg-muted">
                      <div className="flex justify-between">
                        <span>{req.description}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          req.priority === "High" ? "bg-red-100 text-red-800" : 
                          req.priority === "Medium" ? "bg-yellow-100 text-yellow-800" : 
                          "bg-green-100 text-green-800"
                        }`}>
                          {req.priority}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {extractedInfo.techStack && extractedInfo.techStack.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Technology Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {extractedInfo.techStack.map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {extractedInfo.assumptions && extractedInfo.assumptions.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Assumptions</h3>
                <ul className="space-y-2">
                  {extractedInfo.assumptions.map((assumption, index) => (
                    <li key={index} className="p-3 rounded bg-muted">
                      {assumption.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {extractedInfo.dependencies && extractedInfo.dependencies.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Dependencies</h3>
                <ul className="space-y-2">
                  {extractedInfo.dependencies.map((dependency, index) => (
                    <li key={index} className="p-3 rounded bg-muted">
                      {dependency.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {extractedInfo.externalSystems && extractedInfo.externalSystems.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">External Systems</h3>
                <div className="flex flex-wrap gap-2">
                  {extractedInfo.externalSystems.map((system, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                      {system}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline">Edit Extracted Information</Button>
              <Button>Use in RFP</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUpload;
