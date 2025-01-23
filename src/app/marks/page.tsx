"use client"

import { useState } from 'react';
import { Header } from '../components/header';
import { Sidebar } from '../components/sidebar';

interface MarksData {
  studentName: string;
  studentId: string;
  marks: {
    questionNo: number;
    totalMarks: number;
    obtainedMarks: number;
  }[];
}

export default function Marks() {
  const [marksData, setMarksData] = useState<MarksData[]>([
    {
      studentName: 'UMAMA',
      studentId: '2023-ARID-4063',
      marks: [
        { questionNo: 1, totalMarks: 30, obtainedMarks: 10 },
        { questionNo: 2, totalMarks: 20, obtainedMarks: 4 },
      ],
    },
    {
      studentName: 'ZAINOOR',
      studentId: '2023-ARID-4066',
      marks: [
        { questionNo: 1, totalMarks: 30, obtainedMarks: 0 },
        { questionNo: 2, totalMarks: 20, obtainedMarks: 0 },
      ],
    },
  ]);

  const handleSave = () => {
    alert('Marks saved successfully!');
    // Add your save logic here
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Marks (Assignment)</h2>
          {marksData.map((student) => (
            <div
              key={student.studentId}
              className="mb-6 border p-4 rounded shadow bg-white"
            >
              <h3 className="text-xl font-bold mb-4">
                {student.studentName} ({student.studentId})
              </h3>
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
                      <td className="border p-2 text-center">{mark.totalMarks}</td>
                      <td className="border p-2 text-center">
                        <input
                          type="number"
                          className="w-full border px-2 py-1"
                          value={mark.obtainedMarks}
                          onChange={(e) => {
                            const updatedMarks = marksData.map((s) => {
                              if (s.studentId === student.studentId) {
                                return {
                                  ...s,
                                  marks: s.marks.map((m, i) =>
                                    i === index
                                      ? {
                                          ...m,
                                          obtainedMarks: Number(e.target.value),
                                        }
                                      : m
                                  ),
                                };
                              }
                              return s;
                            });
                            setMarksData(updatedMarks);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          <button
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleSave}
          >
            Save
          </button>
        </main>
      </div>
    </div>
  );
}
