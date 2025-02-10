'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';

interface CheckList {
  Id: number;
  Name: string;
}

interface Feedback {
  Id: number;
  Message: string;
  CreatedAt: string;
}

export default function Section() {
  const [checkList, setCheckList] = useState<CheckList[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null); // For handling error messages
  const [messageCount, setMessageCount] = useState<number>(0); // To store message count
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(true); // For message count loading
  const [feedbackMessages, setFeedbackMessages] = useState<Feedback[]>([]); // To store feedback messages
  const API_URL = `${localStorage.getItem('baseURL')}teacher/GetFolderCheckList`;
  const baseURL = localStorage.getItem('baseURL');
  const teacherId = localStorage.getItem('allocationId'); // Retrieve teacher ID from localStorage
  const storedCourse = JSON.parse(localStorage.getItem('course') || '{}');
  const title = `${storedCourse.CourseTitle}`;
  const router = useRouter();

  // Fetch checklist data
  useEffect(() => {
    const fetchCheckList = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch checklist.');
        const data: CheckList[] = await response.json();
        setCheckList(data);

        // // Save the IDs of specific checklists
        // const sampleChecklist = data.find((item) =>
        //   item.Name.toLowerCase().includes('sample')
        // );
        // const assignmentChecklist = data.find((item) =>
        //   item.Name.toLowerCase().includes('assignment')
        // );
        // const quizChecklist = data.find((item) =>
        //   item.Name.toLowerCase().includes('quiz')
        // );
        // const examChecklist = data.find((item) =>
        //   item.Name.toLowerCase().includes('exam')
        // );
        // const solutionChecklist = data.find((item) =>
        //   item.Name.toLowerCase().includes('solution')
        // );
        // if (sampleChecklist) {
        //   localStorage.setItem('checklistId', sampleChecklist.Id.toString());
        //   localStorage.setItem('checklistName', sampleChecklist.Name);
        // }
        // if (assignmentChecklist) {
        //   localStorage.setItem('checklistId', assignmentChecklist.Id.toString());
        //   localStorage.setItem('checklistName', assignmentChecklist.Name);
        // }
        // if (quizChecklist) {
        //   localStorage.setItem('checklistId', quizChecklist.Id.toString());
        //   localStorage.setItem('checklistName', quizChecklist.Name);
        // }
        // if (examChecklist) {
        //   localStorage.setItem('checklistId', examChecklist.Id.toString());
        //   localStorage.setItem('checklistName', examChecklist.Name);
        // }
        // if (solutionChecklist) {
        //   localStorage.setItem('checklistId', solutionChecklist.Id.toString());
        //   localStorage.setItem('checklistName', solutionChecklist.Name);
        // }
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchCheckList();
  }, []);
  console.log("Stored Course:", storedCourse);

  // Fetch message count for the teacher
  useEffect(() => {
    if (teacherId && baseURL) {
      const fetchMessageCount = async () => {
        setIsLoadingMessages(true);
        try {
          const response = await fetch(`${baseURL}/hod/GetMessageCount?allocationId=${teacherId}`);
          const data = await response.json();
          if (response.ok) {
            setMessageCount(data.Count);
          } else {
            console.error('Error fetching message count:', data);
          }
        } catch (error) {
          console.error('An error occurred while fetching message count:', error);
        } finally {
          setIsLoadingMessages(false);
        }
      };

      fetchMessageCount();
    }
  }, [teacherId, baseURL]);

  // Handle click on bell icon to fetch and display feedback
  const handleBellClick = async () => {
    if (teacherId && baseURL) {
      try {
        const response = await fetch(`${baseURL}/hod/GetFeedback?allocationId=${teacherId}`);
        const data = await response.json();
        if (response.ok) {
          setFeedbackMessages(data); // Set feedback messages
        } else {
          setMessage("No feedback found for this teacher.");
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setMessage("An error occurred while fetching feedback.");
      }
    }
  };

  const handleItemClick = (id: number,checklistName:string) => {
    localStorage.setItem('checklistId',  id.toString());
    if (checklistName === "Samples") {
      router.push(`/details/samples?id=${id}`); // Navigate to the details page if ID matches the Sample ID
    } else if (checklistName === "Assignment") {
      router.push(`/assignement-detail/${id}`);
    } else if (checklistName === "Quizes") {
      router.push(`/quiz-detail/${id}`);
    } else if (checklistName === "Exam") {
      router.push(`/exam-detail/${id}`);
    } else if (checklistName === "Solutions") {
      router.push(`/solution-detail/${id}`);
    } else {
      setMessage('This checklist is not available for detailed view.');
    }
  };

  return (
    <div className="p-6">
      {/* Bell Icon with Message Count */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold mb-6">Subfolder of Course {title}</h2>
        <button className="p-2 hover:bg-gray-100 rounded-full relative" onClick={handleBellClick}>
          <Bell className="w-6 h-6" />
          {isLoadingMessages ? (
            <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">...</span>
          ) : messageCount > 0 ? (
            <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">{messageCount}</span>
          ) : null}
        </button>
      </div>

      {message && <p className="text-red-500 mb-4">{message}</p>}

     {/* Display Feedback Messages */}
{feedbackMessages.length > 0 && (
  <div className="mt-4 p-4 border rounded bg-gray-100">
    <h3 className="text-lg font-semibold">Feedback Messages</h3>
    <ul>
      {feedbackMessages.map((feedback) => (
        <li key={feedback.Id} className="mb-2">
          <p className="text-md font-semibold">{feedback.Message}</p>
          <span className="text-sm text-gray-500">{new Date(feedback.CreatedAt).toLocaleString()}</span>
        </li>
      ))}
    </ul>
  </div>
)}

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
                onClick={() => handleItemClick(cl.Id,cl.Name)}
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
