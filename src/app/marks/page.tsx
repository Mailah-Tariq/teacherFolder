"use client";

import { useEffect, useState } from "react";
import { Header } from "../components/header";
import { Sidebar } from "../components/sidebar";
import { useSearchParams } from "next/navigation";

interface SubmissionDetail {
  detailId: number;
  questionNo: number;
  totalScore: number;
  obtainedScore: number;
}

interface StudentData {
  studentId: number;
  marks: SubmissionDetail[];
}

export default function Marks() {
  const searchParams = useSearchParams();
  const [marksData, setMarksData] = useState<StudentData[]>([]);
  const teacherId = localStorage.getItem('allocationId');
  const subCheckListId = searchParams.get("subCheckListId");

  if (!subCheckListId) {
    console.error("subCheckListId is missing in URL parameters.");
    return <p>Error: subCheckListId is required.</p>;
  }

  useEffect(() => {
    const fetchMarksData = async () => {
      try {
        const response = await fetch(
          `${localStorage.getItem('baseURL')}/folder/GetQuesionWiseDetails?allocationId=${teacherId}&subCheckListId=${subCheckListId}`
        );
    
        if (!response.ok) throw new Error("Failed to fetch marks data");
    
        const data = await response.json();
        const formattedData: StudentData[] = data.map((student: any) => ({
          studentId: student.StudentId,
          marks: student.Detail.map((detail: any) => ({
            detailId: detail.DetailId,
            questionNo: detail.QuestionNo,
            totalScore: detail.TotalScore,
            obtainedScore: detail.ObtainedScore,
          })),
        }));

        setMarksData(formattedData);
      } catch (error) {
        console.error("Error fetching marks data:", error);
      }
    };

    fetchMarksData();
  }, []);

  const handleInputChange = (studentId: number, questionIndex: number, value: string) => {
    setMarksData((prevData) =>
      prevData.map((student) =>
        student.studentId === studentId
          ? {
              ...student,
              marks: student.marks.map((mark, index) =>
                index === questionIndex
                  ? { ...mark, obtainedScore: value === "" ? 0 : Number(value) }
                  : mark
              ),
            }
          : student
      )
    );
  };

  const handleSave = async () => {
    try {
      const payload = marksData.map((student) => ({
        StudentId: student.studentId,
        Detail: student.marks.map((mark) => ({
          DetailId: mark.detailId,
          ObtainedScore: mark.obtainedScore,
        })),
      }));

      console.log("Saving Data:", JSON.stringify(payload, null, 2));

      const response = await fetch(
        `${localStorage.getItem('baseURL')}/folder/PostQuesionWiseDetails`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to save marks");

      alert("Marks saved successfully!");
    } catch (error) {
      console.error("Error saving marks:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Marks (Assignment)</h2>
          {marksData.map((student) => (
            <div key={student.studentId} className="mb-6 border p-4 rounded shadow bg-white">
              <h3 className="text-xl font-bold mb-4">Student ID: {student.studentId}</h3>
              <table className="table-auto w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2">Q#</th>
                    <th className="border p-2">Total Marks</th>
                    <th className="border p-2">Obtained Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {student.marks.map((mark, index) => (
                    <tr key={index}>
                      <td className="border p-2 text-center">{mark.questionNo}</td>
                      <td className="border p-2 text-center">{mark.totalScore}</td>
                      <td className="border p-2 text-center">
                        <input
                          type="number"
                          className="w-full border px-2 py-1"
                          value={mark.obtainedScore}
                          onChange={(e) => handleInputChange(student.studentId, index, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          <button className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={handleSave}>
            Save
          </button>
        </main>
      </div>
    </div>
  );
}
