"use client"

import { useEffect, useState } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { Modal } from "./modal";
import UploadFile from "./UploadFile";

interface CheckList {
  Id: number;
  Name: string;
}

interface FileDetail {
  DisplayName: string;
  FilePath: string;
}

export default function Section() {
  const [checkList, setCheckList] = useState<CheckList[]>([]);
  const [error, setError] = useState<string | null>(null);
  const courseInSoSId = 0; // Replace with actual courseInSoSId if needed
  const API_URL = `${localStorage.getItem("baseURL")}teacher/GetFolderCheckList`;

  const [loading, setLoading] = useState<boolean>(true);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedCheckListId, setSelectedCheckListId] = useState<number | null>(null);
  const [fileDetails, setFileDetails] = useState<FileDetail[]>([]); // State to store file details
  const storedCourse = JSON.parse(localStorage.getItem('course') || '{}');
  const title = `${storedCourse.CourseTitle}`;

  // Fetch file details when a checklist item is selected
  const fetchFileDetails = async (courseId: number, checkListId: number) => {
    const API_FILES_URL = `${localStorage.getItem("baseURL")}teacher/GetLectureFiles?courseId=${courseId}&checkListId=${checkListId}`;

    try {
      const response = await fetch(API_FILES_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch file details.");
      }
      const data: FileDetail[] = await response.json();
      setFileDetails(data); // Store the retrieved files
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          // Handle error
        }
        const data: CheckList[] = await response.json();
        setCheckList(data);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleViewDetails = (checkListId: number) => {
    setSelectedCheckListId(checkListId);
    setShowDetailsModal(true); // Show details modal
    if (storedCourse && storedCourse.CourseId) {
      // Fetch file details when the "View Details" button is clicked
      fetchFileDetails(storedCourse.CourseId, checkListId);
    }
  };

  const handleUploadFile = (checkListId: number) => {
    setSelectedCheckListId(checkListId);
    setShowUploadModal(true); // Show upload file modal
  };

  const handleCloseModals = () => {
    setShowUploadModal(false);
    setShowDetailsModal(false);
    setSelectedCheckListId(null);
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <main className="p-6">
          <h2 className="text-2xl font-semibold mb-6"> Course : {title}</h2>

          {error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border-b text-left">ID</th>
                    <th className="px-4 py-2 border-b text-left">Name</th>
                    <th className="px-4 py-2 border-b text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {checkList.map((cl) => (
                    <tr key={cl.Id}>
                      <td className="px-4 py-2 border-b">{cl.Id}</td>
                      <td className="px-4 py-2 border-b">{cl.Name}</td>
                      <td className="px-4 py-2 border-b">
                        <div className="flex gap-2">
                          <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            onClick={() => handleUploadFile(cl.Id)} // Show upload modal
                          >
                            Upload File
                          </button>
                          <button
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                            onClick={() => handleViewDetails(cl.Id)} // Show view details modal
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* View Details Modal */}
      {showDetailsModal && selectedCheckListId !== null && (
        <Modal
          showModal={showDetailsModal}
          onClose={handleCloseModals}
          courseId={storedCourse.CourseId} // Use the actual courseId from storedCourse
          checkListId={selectedCheckListId}
          courseInSOSId={courseInSoSId}
        >
          <div>
            <h3 className="text-xl font-semibold">Uploaded Files</h3>
            <ul>
              {fileDetails.length > 0 ? (
                fileDetails.map((file, index) => (
                  <li key={index} className="my-2">
                    <a
                      href={file.FilePath}
                      className="text-blue-500"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {file.DisplayName}
                    </a>
                  </li>
                ))
              ) : (
                <p>No files found for this checklist.</p>
              )}
            </ul>
          </div>
        </Modal>
      )}

      {/* Upload File Modal */}
      {showUploadModal && selectedCheckListId !== null && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <UploadFile
              folderCheckListId={selectedCheckListId}
              onSuccess={handleCloseModals} // Close modal after successful upload
            />
          </div>
        </div>
      )}
    </div>
  );
}
