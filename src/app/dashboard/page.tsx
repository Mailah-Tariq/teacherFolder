 "use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../components/header";
import { Sidebar } from "../components/sidebar";
import { CourseCard } from "../components/course-card";

// Static courses data (Fallback data)
const staticCourses = [
  {
    CourseCode: "DLD-2",
    CourseTitle: "Digital Logic Design",
    SemesterNo: 2,
    ProgramShortName: "BCS",
    CourseInSOSId : 2
  },
  {
    CourseCode: "CN-3",
    CourseTitle: "Computer Networks",
    SemesterNo: 3,
    ProgramShortName: "BSE",
    CourseInSOSId : 2
  },
  {
    CourseCode: "DSA-1",
    CourseTitle: "Data Structures & Algorithms",
    SemesterNo: 2,
    ProgramShortName: "BAI",
    CourseInSOSId : 2
  },
];
interface FolderContent {
  Id: number;
  Name: string;
  Flag: number;
  CanUpload: boolean;  // Flag to check if the teacher has access to upload
}


export default function DashboardPage() {
  const [courses, setCourses] = useState(staticCourses); // Default to static courses
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [folderContents, setFolderContents] = useState<FolderContent[]>([]);
  const storedCourse = JSON.parse(localStorage.getItem('course') || '{}');
  // Fetch the data from API
  useEffect(() => {
    async function fetchFolderContents() {
      try {
        const response = await fetch(
          `https://localhost:44338/api/teacher/GetFolderMainCheckList?courseInSOSId=${storedCourse.CourseInSOSId}&ProgramShortName=${storedCourse.ProgramShortName}`
        ); // Pass required parameters
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setFolderContents(data); // Save the response in state
      } catch (error) {
        console.error(error);
      }
    }

    fetchFolderContents();
  }, [storedCourse]); // Fetch data again if storedCourse changes

  useEffect(() => {
    // Fetch courses from the API
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${localStorage.getItem("baseURL")}teacher/GetTeacherCourses?id=${localStorage.getItem(
            "userId"
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();
        if (data.length === 0) {
          console.log("error in fetching");
        } else {
          setCourses(data);
        }
      } catch (err) {
        console.log("error in fetching");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseClick = (course: {
    CourseInSOSId: number;
    CourseCode: string;
    CourseTitle: string;
  }) => {
    // Store course data in localStorage
    localStorage.setItem("CourseInSOSId", `${course.CourseInSOSId}`);
    localStorage.setItem("CourseCode", `${course.CourseCode}`);
    localStorage.setItem("course", JSON.stringify(course));

    // Navigate to the course detail page with courseId and title as query params
    router.push(
      `/dashboard/${course.CourseCode}?courseId=${course.CourseInSOSId}&title=${encodeURIComponent(
        course.CourseTitle
      )}`
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Teacher Dashboard</h2>
            <p className="text-gray-600">Fall 2024</p>
          </div>

          {loading ? (
            <p>Loading courses...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => {
                // Check if the teacher has a main folder and CanUpload is true
                const canUploadFolder = folderContents.some(
                  (folder) => folder.CanUpload && folder.Name === course.CourseTitle
                );

                return (
                  <div key={index} onClick={() => handleCourseClick(course)} className="cursor-pointer">
                    <CourseCard
                      code={course.CourseCode}
                      title={course.CourseTitle}
                      semester={course.SemesterNo}
                      program={course.ProgramShortName}
                    />

                    {/* Conditionally render the Upload button based on CanUpload flag */}
                    {canUploadFolder && (
                      <button
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => {
                          // Trigger the upload logic or modal here
                          console.log("Upload button clicked for course:", course.CourseCode);
                        }}
                      >
                        Upload
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
