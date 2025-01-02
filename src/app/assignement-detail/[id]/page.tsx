'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface AssignmentKey {
  S1Id: number;
  S1Name: string;
}

export default function AssignmentScreen() {
  const router = useRouter();
  const [assignmentKeys, setAssignmentKeys] = useState<AssignmentKey[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const storedCourse = JSON.parse(localStorage.getItem('course') || '{}');
  const title = `${storedCourse.CourseTitle}`;


 

  const handleUploadClick = (S1Id: number, S1Name: string) => {
    console.log(`Upload clicked for ${S1Name} (ID: ${S1Id})`);
    // Add upload logic here
  };

  const handleDetailsClick = (S1Id: number, S1Name: string) => {
    console.log(`Details clicked for ${S1Name} (ID: ${S1Id})`);
    // Add details logic here
  };

  return (
    <div className="p-6">
      <button onClick={() => router.back()} className="mb-4 text-blue-500 underline">
        Go Back
      </button>
      <h2 className="text-2xl font-semibold mb-6">Assignment Keys for Course {title}</h2>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : loading ? (
        <p>Loading...</p>
      ) : assignmentKeys && assignmentKeys.length > 0 ? (
        <table className="min-w-full table-auto border-collapse mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b text-left">Assignment Name</th>
              <th className="px-4 py-2 border-b text-left">File Path</th>
              <th className="px-4 py-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignmentKeys.map((key) => (
              <tr key={key.S1Id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b">{key.S1Name}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                    onClick={() => handleUploadClick(key.S1Id, key.S1Name)}
                  >
                    Upload
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => handleDetailsClick(key.S1Id, key.S1Name)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No assignment keys available.</p>
      )}
    </div>
  );
}
