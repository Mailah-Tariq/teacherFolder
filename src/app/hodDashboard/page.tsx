"use client";

import { useEffect, useState } from "react";
import { Header } from "../component1/header";
import { Sidebar } from "../component1/sidebar";
import { CourseCard } from "../component1/course-card";
import { FolderAllocation } from "../component1/folder-allocation"; // Assuming FolderAllocation component is in this path

type Course = {
  title: string;
  href: string;
  [key: string]: any; // Accommodates additional properties from API response
};

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null); 
  const API_URL = `${localStorage.getItem("baseURL")}hod/GetCoursesList`;

  useEffect(() => {
    // Fetch courses from API
    const fetchCourses = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Store the full API response in local storage
        localStorage.setItem("courses", JSON.stringify(data));
        console.log("API response stored in localStorage:", data); // Log the API response

        // Format and set the courses in state
        const formattedCourses: Course[] = data.map((course: { Title: string }) => ({
          title: course.Title,
          href: "#",
          ...course, // Include the full course object
        }));
        setCourses(formattedCourses);
      } catch (err: any) {
        console.error("Error fetching courses:", err);
        setError(err.message || "Failed to fetch courses");
      }
    };

    fetchCourses();
  }, [API_URL]);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64" />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <h2 className="text-2xl font-semibold mb-6">HOD Dashboard</h2>

          {/* Show Folder Allocation screen if a course is selected */}
          {selectedCourse ? (
            <FolderAllocation course={selectedCourse} />
          ) : (
            <>
              {/* Handle loading and errors */}
              {error ? (
                <p className="text-red-500">Error: {error}</p>
              ) : courses.length === 0 ? (
                <p>Loading...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {courses.map((course) => (
                    <div key={course.title} onClick={() => handleCourseClick(course)}>
                      <CourseCard {...course} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
