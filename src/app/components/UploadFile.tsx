import React, { useState, useEffect } from "react";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; 
interface UploadFileProps {
  folderCheckListId: number;
  onSuccess: () => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ folderCheckListId, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const courseInSOSId = localStorage.getItem('CourseInSOSId') || "";
 


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
    console.log('File selected:', selectedFile); // Log to check
  };

  const handleDisplayNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(event.target.value);
  };

  const handleUpload = async () => {
    if (!file || !displayName || courseInSOSId === null) {
      alert("Please provide a display name, select a file, and ensure the CourseInSOSId is available.");
      return;
    }
  
    const formData = new FormData();
    formData.append("FolderCheckListId", folderCheckListId.toString());
    formData.append("CourseInSOSId", courseInSOSId.toString());
    formData.append("DisplayName", displayName);
    formData.append("File", file);
    
    console.log("FormData object:", formData);  
  
    try {
      const response = await fetch("https://localhost:44338/api/folder/UploadFolderContent", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload the file.");
      }
  
      const result = await response.json();
      console.log("File uploaded successfully:", result);

      // Show success toast notification
      toast.success("File uploaded successfully!");

      // Call onSuccess callback
      onSuccess();
    } catch (error) {
      console.error("Error uploading file:", error);

      // Show error toast notification
      toast.error("Error uploading file!");
    } finally {
      setIsUploading(false);
    }
  };

  
  return (
    <div className="p-4 border rounded-md shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Upload File</h3>
      <div className="mb-4">
        <label htmlFor="file" className="block text-sm font-medium">Choose File:</label>
        <input
          id="file"
          type="file"
          className="mt-1 block w-full"
          onChange={handleFileChange}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="displayName" className="block text-sm font-medium">Display Name:</label>
        <input
          id="displayName"
          type="text"
          className="mt-1 block w-full"
          value={displayName}
          onChange={handleDisplayNameChange}
        />
      </div>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        onClick={handleUpload}
        disabled={isUploading || courseInSOSId === null} // Disable until courseInSOSId is available
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>
      
      
    </div>
  );
};

export default UploadFile;
