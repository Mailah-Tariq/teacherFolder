'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CheckList {
  Id: number;
  Name: string;
}

export default function Section() {
  const [checkList, setCheckList] = useState<CheckList[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null); // For handling error messages
  const API_URL = `${localStorage.getItem('baseURL')}teacher/GetFolderCheckList`;
  const storedCourse = JSON.parse(localStorage.getItem('course') || '{}');
  const title = `${storedCourse.CourseTitle}`;
  const router = useRouter();

  useEffect(() => {
    const fetchCheckList = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch checklist.');
        const data: CheckList[] = await response.json();
        setCheckList(data);
  
        // Save the IDs of specific checklists
        const sampleChecklist = data.find((item) =>
          item.Name.toLowerCase().includes('sample')
        );
        const assignmentChecklist = data.find((item) =>
          item.Name.toLowerCase().includes('assignment')
        );
  
        if (sampleChecklist) {
          localStorage.setItem('sampleId', sampleChecklist.Id.toString());
          localStorage.setItem('sampleName', sampleChecklist.Name);
        }
        if (assignmentChecklist) {
          localStorage.setItem('assignmentId', assignmentChecklist.Id.toString());
          localStorage.setItem('assignmentName', assignmentChecklist.Name);
        }
  
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };
  
    fetchCheckList();
  }, []);
  console.log(checkList)


  const handleItemClick = (id: number) => {
    const checklistId = localStorage.getItem('sampleId');
    localStorage.setItem("FolderChecklistId",checklistId ?? "");
    if (id.toString() === checklistId) {
      router.push(`/details/samples?id=${id}`); // Navigate to the details page if ID matches the Sample ID
    } else  if (id.toString() === localStorage.getItem('assignmentId')) {
      router.push(`/assignement-detail/${id}`); 
    } else
    {
      setMessage('This checklist is not available for detailed view.'); 
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Subfolder of Course {title}</h2>

      {message && <p className="text-red-500 mb-4">{message}</p>}

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full table-auto border-collapse mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b text-left">ID</th>
              <th className="px-4 py-2 border-b text-left">Name</th>
            </tr>
          </thead>
          <tbody>
            {checkList.map((cl) => (
              <tr
                key={cl.Id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleItemClick(cl.Id)}
              >
                <td className="px-4 py-2 border-b">{cl.Id}</td>
                <td className="px-4 py-2 border-b">{cl.Name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
