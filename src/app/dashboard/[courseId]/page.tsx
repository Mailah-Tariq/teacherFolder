"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "../../components/header";
import { Sidebar } from "../../components/sidebar";
import { CourseSection } from "../../components/course-section";
import { Folder, Settings, ListTodo ,BookOpen } from "lucide-react";

// Define the type for a section
interface Section {
  SectionTitle: string;
  CourseInSOSId: number;
  CourseId: number;
  CourseCode: string;
  AllocationId:Number;
}

export default function CourseDetailPage({
  params,
}: {
  params: { courseId: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseTitle = searchParams.get("title") || "Course Details";
  const courseInSoS = parseInt(searchParams.get('courseId') || "0");

  const [sections, setSections] = useState<Section[]>([]); // Use the Section[] type

  // Fetch sections data from the API
  useEffect(() => {
    const fetchSections = async () => {
      try {
        console.log(`courseInSOSId=${courseInSoS}`);
        const response = await fetch(
          `${localStorage.getItem('baseURL')}teacher/GetTeacherCourseSections?teacherId=${localStorage.getItem('userId')}&courseInSOSId=${courseInSoS}`
          
        );
        if (response.ok) {
          const data: Section[] = await response.json(); // Ensure the API response matches the Section[] type
          setSections(data);
        } else {
          console.error("Failed to fetch sections");
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    fetchSections();
  }, []);

  const handleClick = (sectionTitle: string) => {
    localStorage.setItem('courseInSOSId', courseInSoS.toString());
    router.push(`/dashboard/${courseInSoS}/${sectionTitle}`);
  };

  const handleSectionClick = (section: Section) => {
    localStorage.setItem('courseInSOSId', courseInSoS.toString());
    localStorage.setItem('allocationId', section.AllocationId.toString());
    
    
    router.push(`/dashboard/${courseInSoS}/section`);
  };


  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          {/* Course Title */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{courseTitle}</h2>
            </div>
          </div>

          {/* Course Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Predefined Sections */}
            <div onClick={() => handleClick("main-folder")}>
              <CourseSection
                icon={<Folder className="w-6 h-6 text-yellow-500" />}
                title="Main Folder"
                view="main-folder"
                courseInSoSId={courseInSoS}
              />
            </div>
            <div onClick={() => handleClick("clos")}>
              <CourseSection
                icon={<Settings className="w-6 h-6 text-purple-500" />}
                title="CLOs"
                view="clos"
                courseInSoSId={courseInSoS}
              />
            </div>
            <div onClick={() => handleClick("topics")}>
              <CourseSection
                icon={<ListTodo className="w-6 h-6 text-emerald-500" />}
                title="Course Topics"
                view="topics"
                courseInSoSId={courseInSoS}
              />
            </div>
                {/* New Cover Topics Section */}
            <div onClick={() => handleClick("section-and-topics")}>
              <CourseSection
                icon={<BookOpen className="w-6 h-6 text-indigo-500" />}
                title="Cover Topics"
                view="section-and-topics"
                courseInSoSId={courseInSoS}
              />
            </div>
            
  {/* Dynamic Sections */}
        {sections.map((section, index) => (
              
           <div onClick={() => handleSectionClick(section)}>
              <CourseSection
                icon={<ListTodo className="w-6 h-6 text-emerald-500" />}
                title={`Section ${section.SectionTitle}`}
                view="section"          
                courseInSoSId={courseInSoS}
              />
            </div>
        ))}        
          </div>
        </main>
       
      </div>
    </div>
  );
}