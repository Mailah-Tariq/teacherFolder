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
  id: number;
  ProgramShortName: string;
  TeacherId: number;
}

export default function Folder() {
  const [filter, setFilter] = useState("All");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [details, setDetails] = useState("");

  const baseURL = localStorage.getItem("baseURL");
  const API_URL = `${baseURL}hod/GetTeachersByCourse`;
  const STATUS_API_URL = `${baseURL}hod/FolderStatus`;

  if (!baseURL) {
    setError("Base URL not found. Please configure it correctly.");
  }

  // Fetch courses with the selected filter
  const fetchCourses = async (_filter:string) => {
    setIsLoading(true);
    setError("");

    console.log("Fetching courses with filter:", _filter); // Debugging log

    try {
      
      const response = await fetch(`${API_URL}?flag=${_filter}`);
      if (response.ok) {
        const data: Course[] = await response.json();
        console.log("Fetched courses:", data); // Log fetched data

        setCourses(data); // Update state with filtered data
        //localStorage.setItem("coursesData", JSON.stringify(data)); // Store data
      } else {
        const errorData = await response.json();
        setError(errorData.Message || "An error occurred while fetching courses.");
        setCourses([]); // Reset state on error
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
      setCourses([]); // Reset state on failure
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch folder status
  const fetchFolderStatus = async (allocationId: number) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${STATUS_API_URL}?allocationId=${allocationId}`);
      if (response.ok) {
        const data = await response.json();
        setDetails(data.Message);
      } else {
        const errorData = await response.json();
        setError(errorData.Message || "An error occurred while fetching folder status.");
        setDetails("");
      }
    } catch (err) {
      setError("Failed to fetch folder status. Please try again later.");
      setDetails("");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle card click: Store allocId and navigate
  const handleCardClick = (allocId: number, teacherId: number) => {
    localStorage.setItem("allocId", allocId.toString());
    localStorage.setItem("teacherId", teacherId.toString()); // Store teacherId
    fetchFolderStatus(allocId);
    window.location.href = "/folder-detail";
  };

  // Fetch courses when `filter` changes
  useEffect(() => {
    console.log("Filter changed to:", filter); // Debugging log
    fetchCourses("All");
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64" />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Folder Checking</h2>

          {/* Filter Dropdown */}
          <div className="mb-6">
            <label htmlFor="filter" className="block text-sm font-medium text-gray-700">
              Filter by Status:
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => { setFilter(e.target.value);fetchCourses(e.target.value); }}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="All">All</option>
              <option value="Completed">Completed</option>
              <option value="Incomplete">Incomplete</option>
            </select>
          </div>

          {/* Loading and Error Messages */}
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Course List */}
          <div key={filter} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.length === 0 && !isLoading && <p>No courses found.</p>} {/* Show message if empty */}
            {courses.map((course) => (
              <FolderCard
                key={course.id}
                title={course.CourseTitle}
                teacherName={course.TeacherName}
                status={
                  <span className={`px-2 py-1 rounded text-white ${course.Status ? "bg-green-500" : "bg-red-500"}`}>
                    {course.Status ? "Completed" : "Incomplete"}
                  </span>
                }
                courseCode={course.CourseCode}
                sectionTitle={course.SectionTitle}
                ProgramShortName={course.ProgramShortName}
                handleClick={() => handleCardClick(course.id, course.TeacherId)}
              />
            ))}
          </div>

          {/* Folder Status Details */}
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
