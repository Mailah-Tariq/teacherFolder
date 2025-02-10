"use client";

import { useEffect, useState } from "react";
import { Header } from "../component1/header";
import { Sidebar } from "../component1/sidebar";

export default function FolderDetails() {
  const [details, setDetails] = useState<string>(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState(""); // State for feedback input
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const teacherId = localStorage.getItem("teacherId"); 
  const allocId = localStorage.getItem("allocId");
  const BASE_URL = "https://localhost:44338/api";
  const STATUS_API_URL = `${BASE_URL}/folder/folderstatus`;
  const FEEDBACK_API_URL = `${BASE_URL}/hod/SubmitFeedback`; // API endpoint for feedback submission

  useEffect(() => {
    const allocId = localStorage.getItem("allocId");
    if (!allocId) {
      setError("No allocation ID found.");
      return;
    }
    fetchFolderStatus(parseInt(allocId));
  }, []);

  const fetchFolderStatus = async (allocId: number) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${STATUS_API_URL}?allocationId=${allocId}`);
      if (response.ok) {
        const data = await response.json();
        setDetails(data.Messsage);
      } else {
        const errorData = await response.json();
        setError(errorData.Message || "An error occurred while fetching the folder status.");
        setDetails("");
      }
    } catch (err) {
      setError("Failed to fetch folder status. Please check your network or try again later.");
      setDetails("");
    } finally {
      setIsLoading(false);
    }
  };

  // Feedback submission handler
  const submitFeedback = async () => {
    setError("");
    setSuccessMessage("");

    const teacherId = localStorage.getItem("teacherId"); 
    const allocId = localStorage.getItem("allocId");

    if (!feedback.trim()) {
      setError("Feedback cannot be empty.");
      return;
    }
    if (!teacherId || !allocId) {
      setError("Missing necessary data (teacher ID or allocation ID).");
      return;
    }

    const feedbackData = {
      TeacherId: parseInt(teacherId),
      AllocationId: parseInt(allocId),
      Message: feedback,
    };

    try {
      const response = await fetch(FEEDBACK_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        setSuccessMessage("Feedback submitted successfully.");
        setFeedback(""); // Clear input field
      } else {
        const errorData = await response.json();
        setError(errorData.Message || "Failed to submit feedback.");
      }
    } catch (err) {
      setError("An error occurred while submitting feedback.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64" />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Folder Details</h2>
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          
          {details && (
            <div className="mb-6">
              <pre className="bg-gray-100 p-4 rounded">{details}</pre>
            </div>
          )}

          {/* Feedback Input Section */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Submit Feedback</h3>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows={4}
              placeholder="Write your feedback here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
            <button
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={submitFeedback}
            >
              Submit Feedback
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
