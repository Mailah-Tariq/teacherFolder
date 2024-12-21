"use client";

import { useState, useEffect } from "react";
import { Eye, Upload } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import UploadFile from "./UploadFile"; // Import the UploadFile component

interface FolderContent {
  Id: number;
  Name: string;
  Flag: number;
  FolderContent: any[]; // You can ignore this field for now since you don't need to display it
}

interface LectureFile {
  DisplayName: string;
  FilePath: string;
}

export function MainFolderView() {
  const [folderContents, setFolderContents] = useState<FolderContent[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false); // State to manage modal visibility
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null); // Store selected FolderCheckListId
  const [lectureFiles, setLectureFiles] = useState<LectureFile[]>([]); // Store the fetched lecture files
  const [isDetailsOpen, setIsDetailsOpen] = useState(false); // Manage the details modal visibility
  const storedCourse = JSON.parse(localStorage.getItem('course') || '{}');
  const title = `${storedCourse.CourseTitle}`;
  const courseId = storedCourse?.courseId ?? null; // Default to null if not found
  console.log(courseId); // Verify the value of courseId

  // Fetch folder contents
  useEffect(() => {
    async function fetchFolderContents() {
      try {
        const response = await fetch(
          "https://localhost:44338/api/teacher/GetFolderMainCheckList"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setFolderContents(data); // Save the response in state
      } catch (error) {
        console.error(error);
      }
    }
    fetchFolderContents();
  }, []); // Empty dependency array to run the effect once when the component mounts

  // Handle view details button click
  const handleViewDetails = async (checkListId: number) => {
    if (!courseId) {
      console.error("Course ID is missing!");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:44338/api/teacher/GetLectureFiles?courseId=${storedCourse.courseId}&checkListId=${checkListId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch lecture files");
      }
      const files = await response.json();
      setLectureFiles(files); // Store the fetched lecture files in state
      setIsDetailsOpen(true); // Open the details modal
    } catch (error) {
      console.error(error);
    }
  };

  // Handle upload button click
  const handleUpload = (folderCheckListId: number) => {
    if (!folderCheckListId) {
      console.error("Folder CheckList ID is missing.");
      return;
    }
    setSelectedFolderId(folderCheckListId); // Set the selected folder ID for upload
    setIsUploadOpen(true); // Open the upload modal
  };

  // Handle upload success (refresh or close modal)
  const handleUploadSuccess = () => {
    setIsUploadOpen(false); // Close the modal after a successful upload
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold">Main Folder of {title}</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-[200px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {folderContents.map((item) => (
              <TableRow key={item.Id}>
                <TableCell>{item.Id}</TableCell>
                <TableCell>{item.Name}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {/* View Details Button */}
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 h-8 w-8 p-0"
                      onClick={() => handleViewDetails(item.Id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {/* Upload Button */}
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 h-8 w-8 p-0"
                      onClick={() => handleUpload(item.Id)}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Upload Modal */}
      {isUploadOpen && selectedFolderId !== null && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <UploadFile
              folderCheckListId={selectedFolderId} // Pass the folderCheckListId to UploadFile
              onSuccess={handleUploadSuccess} // Handle success callback
            />
          </div>
        </div>
      )}
    </div>
  );
}
