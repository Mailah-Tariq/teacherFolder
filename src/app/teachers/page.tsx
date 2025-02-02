"use client";

import { useEffect, useState } from "react";
import { Header } from "../component1/header"; // Import the Header
import { Sidebar } from "../component1/sidebar"; // Import the Sidebar

// Define a Course interface
interface Course {
  Id: number;
  CourseCode: string;
  Title: string;
  // Any other properties that the course object contains
}

// Define a Teacher interface
interface Teacher {
  Id: number;
  Name: string;
  ProgramTitle: string;
  ProgramId: number; // Add program ID here
  // Any other properties that the teacher object contains
}

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]); // Set teachers to an array of Teacher
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Get the selected course from localStorage and type it as Course
    const selectedCourse = JSON.parse(localStorage.getItem("selectedCourse") || "{}") as Course;

    // If no course is selected, show an error or return early
    if (!selectedCourse || !selectedCourse.Id) {
      setError("No course selected.");
      return;
    }

    // Fetch teachers for the selected course using the API
    const fetchTeachers = async () => {
      try {
        const response = await fetch(`${localStorage.getItem("baseURL")}hod/TeachersForCourse?courseId=${selectedCourse.Id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Teacher[] = await response.json(); // Explicitly type the response as Teacher[]
        setTeachers(data); // Set the teachers in state
      } catch (err: any) {
        setError("Failed to fetch teachers: " + err.message);
      }
    };

    fetchTeachers();
  }, []);

  // Function to handle the button click and call the API
  const assignMainFolder = async (teacherId: number, programId: number, courseId: number) => {
    try {
      const response = await fetch(`${localStorage.getItem("baseURL")}hod/AssignMasterFolderToTeacher?userId=${teacherId}&programId=${programId}&courseId=${courseId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to assign main folder: ${response.status}`);
      }
  
      const data = await response.json();
      setSuccessMessage("Main folder assigned successfully!");
      console.log(data); // Log the response if needed
    } catch (error: any) {
      setError("Failed to assign main folder: " + error.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64" /> {/* Include Sidebar */}
      <div className="flex-1">
        <Header /> {/* Include Header */}
        <main className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Teachers for Selected Course</h2>

          {/* Display success or error messages */}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Display error if no course or teachers are found */}
          {teachers.length === 0 ? (
            <p>No teachers found for this course.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {teachers.map((teacher) => (
                <div key={teacher.Id} className="p-4 border rounded-lg">
                  <h3>{teacher.Name}</h3>
                  <p>{teacher.ProgramTitle}</p>
              {/* Assign Main Folder Button */}
              <button
  onClick={() => {
    // Get the teacher and course data from localStorage
    const selectedTeacher = JSON.parse(localStorage.getItem("selectedTeacher") || "{}");

    // Ensure that the selectedTeacher has the necessary properties
    const { Id: teacherId, ProgramId: programId, CourseId: courseId } = selectedTeacher;

    // Call assignMainFolder with the correct IDs
    assignMainFolder(teacherId, programId, courseId);
  }}
  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
>
  Assign Main Folder
</button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
