'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/header';
import { Sidebar } from '../../components/sidebar';

interface TabData {
  S2Id: number;
  S2Name: string;
  FilePath: string | null;
}

export default function SolutionPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Assignment' | 'Quiz' | 'Exam'>('Assignment');
  const [tabData, setTabData] = useState<TabData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modalData, setModalData] = useState<{ S2Id: number; S2Name: string } | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const storedCourse = JSON.parse(localStorage.getItem('course') || '{}');
  const title = `Solution for Course ${storedCourse.CourseTitle}`;
  const baseURL = localStorage.getItem('baseURL');
  const allocationId = localStorage.getItem('allocationId');
  const courseInSOSId = localStorage.getItem('CourseInSOSId');
  const folderChecklistId = localStorage.getItem('FolderChecklistId');

  const TAB_API_URLS = {
    Assignment: `${baseURL}teacher/GetSolutions?type=assi&allocationId=${allocationId}`,
    Quiz: `${baseURL}teacher/GetSolutions?type=quiz&allocationId=${allocationId}`,
    Exam: `${baseURL}teacher/GetSolutions?type=exam&allocationId=${allocationId}`,
  };

  useEffect(() => {
    const fetchTabData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(TAB_API_URLS[activeTab], { cache: 'no-cache' });
        if (!response.ok) throw new Error(`Failed to fetch ${activeTab.toLowerCase()} data.`);
        const data: TabData[] = await response.json();

        console.log("API Response Data: ", data);

        const formattedData = data.map(item => ({
          ...item,
          FilePath: item.FilePath || 'No File' 
        }));

        setTabData(Array.isArray(formattedData) ? formattedData : []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchTabData();
  }, [activeTab]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Only PDF and Word documents are allowed.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be under 10MB.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadClick = (S2Id: number, S2Name: string) => {
    setModalData({ S2Id, S2Name });
    setSelectedFile(null);
    setSuccessMessage(null);
  };

  const handleModalUpload = async () => {
    if (!selectedFile || !modalData) {
      alert('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append('CourseInSOSId', courseInSOSId ?? '');
    formData.append('allocationId', allocationId ?? '');
    formData.append('FolderCheckListId', folderChecklistId ?? '');
    formData.append('DisplayName', selectedFile.name);
    formData.append('FolderSubCheckListId', modalData.S2Id.toString());
    formData.append('File', selectedFile);

    try {
      const response = await fetch(`${baseURL}/Folder/UploadFolderContent`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file.');
      }

      setSuccessMessage(`File uploaded successfully for ${modalData.S2Name}.`);

      setTabData((prev) => {
        if (prev) {
          return [...prev];
        }
        return null;
      });

      setTimeout(() => {
        setModalData(null);
        setSelectedFile(null);
      }, 1000); 
    } catch (error) {
      alert('An error occurred while uploading the file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <button onClick={() => router.back()} className="mb-4 text-blue-500 underline">Go Back</button>
          <h2 className="text-2xl font-semibold mb-6">{title}</h2>

          <div className="flex space-x-4 mb-6">
            {['Assignment', 'Quiz', 'Exam'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab(tab as 'Assignment' | 'Quiz' | 'Exam')}
              >
                {tab}
              </button>
            ))}
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {loading ? <p>Loading data...</p> : (
            tabData?.map((item) => (
              <div key={item.S2Id} className="mb-4 border p-4 rounded shadow bg-white">
                <h3 className="text-xl font-bold mb-4">{item.S2Name}</h3>
                {item.FilePath && item.FilePath !== 'No File' ? (
                  <button className="px-4 py-2 bg-blue-500 text-white rounded">Detail</button>
                ) : (
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    onClick={() => handleUploadClick(item.S2Id, item.S2Name)}
                  >
                    Upload
                  </button>
                )}
              </div>
            ))
          )}

          {modalData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Upload File for {modalData.S2Name}</h2>
                <input type="file" onChange={handleFileChange} className="mb-4 w-full" />
                {uploading ? <p>Uploading...</p> : successMessage && <p className="text-green-500">{successMessage}</p>}
                <div className="flex justify-end">
                  <button
                    onClick={handleModalUpload}
                    className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                  <button onClick={() => setModalData(null)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
