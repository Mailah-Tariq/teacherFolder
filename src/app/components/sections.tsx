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

export default function Section() {
  const [checkList, setCheckList] = useState<CheckList[]>([]);
  const [error, setError] = useState<string | null>(null);
  const courseInSoSId = 0; // Replace with actual courseInSoSId if needed
  const API_URL = `${localStorage.getItem("baseURL")}teacher/GetFolderCheckList`;

  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCheckListId, setSelectedCheckListId] = useState<number | null>(null);
  const storedCourse = JSON.parse(localStorage.getItem('course') || '{}');
  const title=`${storedCourse.CourseTitle}`
  

  useEffect(() => {
    console.log(storedCourse)
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
    localStorage.getItem('CourseInSOSId')
    setShowModal(true);
  };

  const handleUploadFile = (checkListId: number) => {
    setSelectedCheckListId(checkListId);
    // Trigger file upload logic here if needed
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
                          {/* Button for Uploading File */}
                          <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            onClick={() => handleUploadFile(cl.Id)} // Trigger Upload File logic
                          >
                            Upload File
                          </button>
                          {/* Button for Viewing Details */}
                          <button
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                            onClick={() => handleViewDetails(cl.Id)} // Trigger View Details logic
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
      {/* Modal Component for Viewing Details */}
      {selectedCheckListId !== null && showModal && (
        <Modal
          showModal={showModal}
          onClose={handleCloseModal}
          courseId={0} // Replace with actual courseId if needed
          checkListId={selectedCheckListId}
          courseInSOSId={courseInSoSId}
        />
      )}
      {/* Upload File Modal */}
      {showModal && selectedCheckListId !== null && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <UploadFile
              folderCheckListId={selectedCheckListId}
              onSuccess={handleCloseModal} // Close modal after succes
             // Close modal on cancel
            />
          </div>
        </div>
      )}
    </div>
  );
}
