'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface AssignmentDetail {
  S1Id: number;
  S1Name: string;
  Values: {
    S2Id: number;
    S2Name: string;
    FilePath: string | null;
  }[];
}

export default function AssignmentDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [assignmentDetails, setAssignmentDetails] = useState<AssignmentDetail[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const API_URL = `${localStorage.getItem('baseURL')}teacher/GetAssignments`;

  useEffect(() => {
    if (!id) return;

    const fetchAssignmentDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}?id=${id}`);
        if (!response.ok) throw new Error('Failed to fetch assignment details.');
        const data: AssignmentDetail[] = await response.json();
        setAssignmentDetails(data);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchAssignmentDetails();
  }, [id]);

  if (!id) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Assignment Details</h2>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {assignmentDetails?.map((detail) => (
            <div key={detail.S1Id} className="mb-4">
              <h3 className="text-lg font-bold">{detail.S1Name}</h3>
              <ul className="list-disc pl-6">
                {detail.Values.map((value) => (
                  <li key={value.S2Id}>
                    {value.S2Name}
                    {value.FilePath && (
                      <a
                        href={value.FilePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 ml-2"
                      >
                        View File
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
