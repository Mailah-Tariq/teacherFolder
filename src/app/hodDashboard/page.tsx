"use client";

import { useEffect, useState } from "react";
import { Header } from "../component1/header";
import { Sidebar } from "../component1/sidebar";
import { CourseCard } from "../component1/course-card";

type Course = {
  title: string;
  href: string;
};

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]); 
  const [error, setError] = useState<string | null>(null); 
  const API_URL = "https://localhost:44338/api/hod/GetCoursesList";

  useEffect(() => {
    // Fetch courses data from the API
    const fetchCourses = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Transform data into the required format
        const formattedCourses: Course[] = data.map((course: { Title: string }) => ({
          title: course.Title, // Use the 'Title' field from the API
          href: "#", // Placeholder href (can be updated as needed)
        }));
        setCourses(formattedCourses);
      } catch (err: any) {
        setError(err.message || "Failed to fetch courses");
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64" />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <h2 className="text-2xl font-semibold mb-6">HOD Dashboard</h2>

          {/* Handle loading and errors */}
          {error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : courses.length === 0 ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {courses.map((course) => (
                <CourseCard key={course.title} {...course} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
