"use client";
import React, { useState, useEffect } from "react";
import { Header } from "@/app/components/header";
import { Sidebar } from "@/app/components/sidebar";
import { useRouter } from "next/navigation";

interface Question {
  QNo: number;
  Marks: number;
  CLOS: number[]; // CLO IDs as integers
}

export default function UploadSectionContent() {
  const router = useRouter();
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(1); // Default to 1 to avoid undefined
  const [questions, setQuestions] = useState<Question[]>([{ QNo: 1, Marks: 0, CLOS: [] }]);
  const [contentId, setContentId] = useState<number | null>(null);

  useEffect(() => {
    const storedContentId = localStorage.getItem("ContentId");
    console.log("Retrieved ContentId from localStorage:", storedContentId); // Debugging
    if (storedContentId) {
      setContentId(parseInt(storedContentId, 10));
    } else {
      console.warn("ContentId is not found in localStorage.");
    }
  }, []);

  const handleNumberOfQuestionsChange = (value: number) => {
    const newQuestions = [...questions];
    if (value > newQuestions.length) {
      for (let i = newQuestions.length; i < value; i++) {
        newQuestions.push({ QNo: i + 1, Marks: 0, CLOS: [] });
      }
    } else if (value < newQuestions.length) {
      newQuestions.splice(value);
    }
    setQuestions(newQuestions);
    setNumberOfQuestions(value); // Update the numberOfQuestions state
  };

  // Handle Marks change
  const handleMarksChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].Marks = parseInt(value, 10);
    setQuestions(updatedQuestions);
  };

  // Handle CLOs change
  const handleCLOsChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].CLOS = value
      .split(",") 
      .map((v) => parseInt(v.trim(), 10)) 
      .filter((v) => !isNaN(v)); 
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    if (!contentId) {
      alert("Content ID is missing. Please ensure it is set correctly.");
      return;
    }
  
    console.log("Questions to submit:", questions);
  
    // Prepare the data to send in the body
    const requestPayload = questions.map((question, index) => ({
      Id: index + 1, // Assuming Id is equivalent to the index + 1 (or any other way to retrieve it)
      Marks: question.Marks,
      CLOIds: question.CLOS, // Send the CLO IDs as an array of integers
    }));
  
    try {
      const response = await fetch(
        `${localStorage.getItem('baseURL')}/folder/UploadFolderContentDetail?contentId=${contentId}&numberOfQuestions=${numberOfQuestions}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload), // Send question details in body
        }
      );
  
      if (response.ok) {
        alert("Data submitted successfully!");
      } else {
        const error = await response.json();
        console.error("Error response from API:", error);
        alert("Failed to submit data.");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("An error occurred during submission.");
    }
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
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-green-600 text-center mb-4">
              Upload Assignment Detail
            </h2>

            <div className="mb-4">
              <label htmlFor="number-of-questions" className="block mb-2 text-gray-600">
                Number of Questions:
              </label>
              <input
                type="number"
                id="number-of-questions"
                value={numberOfQuestions}
                onChange={(e) => handleNumberOfQuestionsChange(Number(e.target.value))}
                className="w-full p-2 border rounded"
                min="1"
              />
            </div>

            {questions.map((question, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700">Question {index + 1}</h3>

                {/* Marks Input */}
                <div className="mb-2">
                  <label className="block text-gray-600">Marks:</label>
                  <input
                    type="number"
                    value={question.Marks}
                    onChange={(e) => handleMarksChange(index, e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                  />
                </div>

                {/* CLOs Input */}
                <div>
                  <label className="block text-gray-600">CLOS (comma-separated):</label>
                  <input
                    type="text"
                    value={question.CLOS.join(",")}
                    onChange={(e) => handleCLOsChange(index, e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
