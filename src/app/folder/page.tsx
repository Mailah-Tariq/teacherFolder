"use client";

import { useEffect, useState } from "react";
import { Header } from "../component1/header";
import { Sidebar } from "../component1/sidebar";
import FolderCard from "../component1/folder-card";

interface Course {
  CourseId: number;
  CourseTitle: string;
  TeacherName: string;
  Status: boolean; 
  CourseCode: string;
  SectionTitle: string;
  id:number;
  ProgramShortName:string;
}

export default function Folder() {
  const [filter, setFilter] = useState("All");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [details, setDetails] = useState(""); // State for folder status details

  const API_URL = `${localStorage.getItem("baseURL")}hod/GetTeachersByCourse`;
  const STATUS_API_URL = `${localStorage.getItem("baseURL")}hod/FolderStatus`;
  const handleCardClick = (allocId: number) => {
    localStorage.setItem("allocId", allocId.toString()); // Save allocId in localStorage
    window.location.href = "/folder-detail"; // Navigate to the details page
  };
  const fetchCourses = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}?flag=${filter}`);
      if (response.ok) {
        const data: Course[] = await response.json();
        setCourses(data);
      } else {
        const errorData = await response.json();
        setError(errorData.Message || "An error occurred");
        setCourses([]);
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFolderStatus = async (allocationId: number) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${STATUS_API_URL}?allocationId=${allocationId}`);
      if (response.ok) {
        const data = await response.json();
        setDetails(data.Messsage); // Set details from the response
      } else {
        const errorData = await response.json();
        setError(errorData.Message || "An error occurred");
        setDetails("");
      }
    } catch (err) {
      setError("Failed to fetch folder status. Please try again later.");
      setDetails("");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [filter]);

  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64" />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Folder Checking</h2>
          <div className="mb-6">
            <label htmlFor="filter" className="block text-sm font-medium text-gray-700">
              Filter by Status:
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="All">All</option>
              <option value="Completed">Completed</option>
              <option value="Incomplete">Incomplete</option>
            </select>
          </div>
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
 <FolderCard
 key={course.CourseId}
 title={course.CourseTitle}
 teacherName={course.TeacherName}
 status={course.Status ? "Completed" : "Incomplete"}
 courseCode={course.CourseCode}
 sectionTitle={course.SectionTitle}
 ProgramShortName={course.ProgramShortName}
 handleClick={() => handleCardClick(course.id)} // Pass `allocId` to the function
/>
))}
          </div>
          {details && (
            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-bold mb-2">Folder Status Details</h3>
              <p>{details}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
