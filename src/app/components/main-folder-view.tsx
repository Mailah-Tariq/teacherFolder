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
}

interface LectureFile {
  DisplayName: string;
  FilePath: string;
}

export function MainFolderView() {
  const [folderContents, setFolderContents] = useState<FolderContent[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [lectureFiles, setLectureFiles] = useState<LectureFile[]>([]);
  const [uploadedFolders, setUploadedFolders] = useState<number[]>([]); // Track uploaded folders

  const storedCourseInfo = JSON.parse(localStorage.getItem("courseInfo") || "{}");
  const title = `${storedCourseInfo.CourseTitle}`;
  const title1 = `${storedCourseInfo.CourseInSOSId}`;
  const courseInfoId = storedCourseInfo?.courseInfoId ?? null; // Use courseInfoId instead of courseId

  console.log(courseInfoId); // Debugging

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
        setFolderContents(data);
        console.log("API data", data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchFolderContents();
  }, []);
console.log("store course",storedCourseInfo)
  // Fetch lecture files for a specific folder
  const fetchLectureFiles = async (checkListId: number) => {
    if (!courseInfoId) {
      console.error("Course Info ID is missing!");
      return;
    }
  
    try {
      const response = await fetch(
        `https://localhost:44338/api/teacher/GetLectureFiles?courseInfoId=${title1}&checkListId=${checkListId}`
      );
      if (!response.ok) {
        const errorMessage = await response.text(); // Log the error response
        console.error("Error fetching lecture files:", errorMessage);
        throw new Error("Failed to fetch lecture files");
      }
  
      const files: LectureFile[] = await response.json();
      setLectureFiles(files);
  
      // If at least one file has a FilePath, store the folder ID
      if (files.some((file) => file.FilePath)) {
        setUploadedFolders((prev) => [...prev, checkListId]); // Mark folder as uploaded
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  // Handle view details button click
  const handleViewDetails = (checkListId: number) => {
    fetchLectureFiles(checkListId); // Fetch and update state
  };

  // Handle upload button click
  const handleUpload = (folderCheckListId: number) => {
    if (!folderCheckListId) {
      console.error("Folder CheckList ID is missing.");
      return;
    }
    setSelectedFolderId(folderCheckListId);
    setIsUploadOpen(true);
  };

  // Handle upload success
  const handleUploadSuccess = () => {
    setIsUploadOpen(false);
    if (selectedFolderId !== null) {
      fetchLectureFiles(selectedFolderId); // Refresh file list after upload
      setUploadedFolders((prev) => [...prev, selectedFolderId]); // Add folder ID to uploaded list
    }
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
                    {/* Show "View Details" only if a file has been uploaded */}
                    {uploadedFolders.includes(item.Id) && (
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 h-8 w-8 p-0"
                        onClick={() => handleViewDetails(item.Id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}

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
              folderCheckListId={selectedFolderId}
              onSuccess={handleUploadSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}
