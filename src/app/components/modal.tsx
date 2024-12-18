import React, { useEffect, useState } from "react";

interface ModalProps {
  showModal: boolean;
  onClose: () => void;
  courseId: number;
  checkListId: number;
  courseInSOSId:number;
}

interface File {
  DisplayName: string;
  FilePath: string;
}

export const Modal: React.FC<ModalProps> = ({ showModal, onClose, courseId, checkListId,courseInSOSId}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (showModal) {
      // Fetch the lecture files when the modal is shown
      const fetchFiles = async () => {
        try {
          const response = await fetch(`${localStorage.getItem('baseURL')}teacher/GetLectureFiles?courseId=${localStorage.getItem('CourseInSOSId')}&checkListId=${checkListId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch files");
          }
          const data: File[] = await response.json();
          setFiles(data);
          setLoading(false);
        } catch (err) {
          setError((err as Error).message);
          setLoading(false);
        }
      };
      fetchFiles();
    }
  }, [showModal, courseId, checkListId]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">Lecture Files</h2>
        {files.length === 0 && !loading && !error ? (
  <p>No files available.</p>
) : (
  <ul>
    {files.map((file, index) => (
      <li key={index} className="mb-2">
        <a href={file.FilePath} target="_blank" rel="noopener noreferrer" className="text-blue-600">
          {file.DisplayName}
        </a>
      </li>
    ))}
  </ul>
)}
        <button
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};
