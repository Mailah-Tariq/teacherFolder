'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface TabData {
  Name: string;
  FilePath: string | null;
}

export default function Details() {
  const [activeTab, setActiveTab] = useState<'Assignment' | 'Quiz' | 'Exam'>('Assignment');
  const [tabData, setTabData] = useState<TabData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const checklistId = searchParams.get('id');
  const router = useRouter();
  const storedCourse = JSON.parse(localStorage.getItem('course') || '{}');
  const title = `${storedCourse.CourseTitle}`;

  const TAB_API_URLS = {
    Assignment: `${localStorage.getItem('baseURL')}teacher/GetAssignments`,
    Quiz: `${localStorage.getItem('baseURL')}teacher/GetQuizzes`,
    Exam: `${localStorage.getItem('baseURL')}teacher/GetExams`,
  };

  useEffect(() => {
    const fetchTabData = async (tab: 'Assignment' | 'Quiz' | 'Exam') => {
      setLoading(true);
      try {
        const response = await fetch(`${TAB_API_URLS[tab]}?checklistId=${checklistId}`);
        if (!response.ok) throw new Error(`Failed to fetch ${tab.toLowerCase()} data.`);
        const data = await response.json();
        setTabData(data);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchTabData(activeTab); // Fetch data for the default tab
  }, [activeTab]);

  const handleTabClick = (tab: 'Assignment' | 'Quiz' | 'Exam') => {
    setActiveTab(tab);
  };

  return (
    <div className="p-6">
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
        <p>Loading {activeTab.toLowerCase()} data...</p>
      ) : tabData && tabData.length > 0 ? (
        <ul>
          {tabData.map((item, index) => (
            <li key={index} className="mb-2">
              {item.Name}{' '}
              {item.FilePath && (
                <a
                  href={item.FilePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  [View File]
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No {activeTab.toLowerCase()} data available.</p>
      )}
    </div>
  );
}
