'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
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
  const { id } = use(params); 
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Assignment' | 'Quiz' | 'Exam'>('Assignment');
  const [tabData, setTabData] = useState<TabData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const storedCourse = JSON.parse(localStorage.getItem('course') || '{}');
  const title = `${storedCourse.CourseTitle}`;

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
        const response = await fetch(`${TAB_API_URLS[activeTab]}`);
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
  }, [activeTab, id]);

  const handleTabClick = (tab: 'Assignment' | 'Quiz' | 'Exam') => {
    setActiveTab(tab); 
  };

  const handleUploadClick = (S2Id: number, S2Name: string) => {
    console.log(`Upload clicked for ${S2Name} (ID: ${S2Id})`);
  
  };

  const handleDetailsClick = (S2Id: number, S2Name: string) => {
    console.log(`Details clicked for ${S2Name} (ID: ${S2Id})`);
   
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
          <h2 className="text-2xl font-semibold mb-6">Sample for Course {title}</h2>

          <div className="flex space-x-4 mb-6">
            <button
              className={`px-4 py-2 ${
                activeTab === 'Assignment' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => handleTabClick('Assignment')}
            >
              Assignment
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === 'Quiz' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => handleTabClick('Quiz')}
            >
              Quiz
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === 'Exam' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => handleTabClick('Exam')}
            >
              Exam
            </button>
          </div>

          {error ? (
            <p className="text-red-500">{error}</p>
          ) : loading ? (
            <p>Loading assignment data...</p>
          ) : tabData && tabData.length > 0 ? (
            <div>
              {tabData.map((item, index) => (
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
                              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                              onClick={() => handleUploadClick(value.S2Id, value.S2Name)}
                            >
                              Upload
                            </button>
                            <button
                              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                              onClick={() => handleDetailsClick(value.S2Id, value.S2Name)}
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ) : (
            <p>No assignment data available.</p>
          )}
        </main>
      </div>
    </div>
  );
}
