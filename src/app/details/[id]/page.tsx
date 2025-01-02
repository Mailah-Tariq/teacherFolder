'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/header';
import { Sidebar } from '../../components/sidebar';

interface TabData {
  Key: {
    S1Id: number;
    S1Name: string;
    FilePathKey: string;
  };
  Values: {
    S2Id: number;
    S2Name: string;
    FilePath: string | null;
  }[];
}

export default function DetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Assignment' | 'Quiz' | 'Exam'>('Assignment');
  const [tabData, setTabData] = useState<TabData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modalData, setModalData] = useState<{ S2Id: number; S2Name: string } | null>(null);
  const storedCourse = JSON.parse(localStorage.getItem('course') || '{}');
  const title = `Sample for Course ${storedCourse.CourseTitle}`;

  const TAB_API_URLS = {
    Assignment: `${localStorage.getItem('baseURL')}teacher/GetSamples?type=assi&allocationId=${localStorage.getItem('allocationId')}`,
    Quiz: `${localStorage.getItem('baseURL')}teacher/GetSamples?type=quiz&allocationId=${localStorage.getItem('allocationId')}`,
    Exam: `${localStorage.getItem('baseURL')}teacher/GetSamples?type=exam&allocationId=${localStorage.getItem('allocationId')}`,
  };

  useEffect(() => {
    const fetchTabData = async () => {
      setLoading(true);
      setTabData(null);
      setError(null);
      try {
        const response = await fetch(TAB_API_URLS[activeTab]);
        if (!response.ok) throw new Error(`Failed to fetch ${activeTab.toLowerCase()} data.`);
        const data: TabData[] = await response.json();
        setTabData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTabData();
  }, [activeTab]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadClick = (S2Id: number, S2Name: string) => {
    setModalData({ S2Id, S2Name });
  };

  const handleModalUpload = async () => {
    if (!selectedFile || !modalData) {
      alert('Please select a file to upload.');
      return;
    }

    const UPLOAD_API_URL = `${localStorage.getItem('baseURL')}/Folder/UploadFolderContent`;

    const formData = new FormData();
    formData.append('CourseInSOSId', localStorage.getItem('CourseInSOSId') ?? "");
    formData.append('allocationId', localStorage.getItem('allocationId') ?? "");
    formData.append('FolderCheckListId', localStorage.getItem('FolderChecklistId') ?? "");
    formData.append('DisplayName', selectedFile.name);
    formData.append('FolderSubCheckListId', modalData.S2Id.toString());
    formData.append('File', selectedFile);

    try {
      const response = await fetch(UPLOAD_API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        alert('Failed to upload file.');
        return;
      }

      alert(`File uploaded successfully for ${modalData.S2Name}.`);
      setModalData(null);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred while uploading the file.');
    }
  };

  const handleCloseModal = () => {
    setModalData(null);
    setSelectedFile(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <button onClick={() => router.back()} className="mb-4 text-blue-500 underline">
            Go Back
          </button>
          <h2 className="text-2xl font-semibold mb-6">{title}</h2>

          <div className="flex space-x-4 mb-6">
            {['Assignment', 'Quiz', 'Exam'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 ${
                  activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
                onClick={() => setActiveTab(tab as 'Assignment' | 'Quiz' | 'Exam')}
              >
                {tab}
              </button>
            ))}
          </div>

          {error ? (
            <p className="text-red-500">{error}</p>
          ) : loading ? (
            <p>Loading data...</p>
          ) : tabData && tabData.length > 0 ? (
            tabData.map((item, index) => (
              <div key={index} className="mb-4 border p-4 rounded shadow bg-white">
                <h3 className="text-xl font-bold mb-4">{item.Key.S1Name}</h3>
                <table className="w-full border-collapse border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Sub Name</th>
                      <th className="border px-4 py-2 text-left">File</th>
                      <th className="border px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.Values.map((value) => (
                      <tr key={value.S2Id}>
                        <td className="border px-4 py-2">{value.S2Name}</td>
                        <td className="border px-4 py-2">
                          {value.FilePath ? (
                            <a
                              href={value.FilePath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              View File
                            </a>
                          ) : (
                            'No File'
                          )}
                        </td>
                        <td className="border px-4 py-2">
                          <button
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            onClick={() => handleUploadClick(value.S2Id, value.S2Name)}
                          >
                            Upload
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <p>No data available.</p>
          )}

          {modalData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">
                  Upload File for {modalData.S2Name}
                </h2>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="mb-4 w-full"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleModalUpload}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                  >
                    Upload
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
