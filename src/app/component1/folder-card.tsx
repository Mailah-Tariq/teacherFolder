"use client";

interface FolderCardProps {
  title: string;
  teacherName: string;
  status: string;
  courseCode: string;
  sectionTitle: string;
  ProgramShortName:string;
  handleClick: () => void; // Function to handle click
}

export default function FolderCard({
  title,
  teacherName,
  status,
  courseCode,
  sectionTitle,
  ProgramShortName,
  handleClick,
}: FolderCardProps) {
  return (
    <div
      className="p-4 border rounded-lg shadow cursor-pointer hover:shadow-md"
      onClick={handleClick}
    >
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-gray-500">Teacher: {teacherName}</p>
      <p className="text-sm text-gray-500">Code: {courseCode}</p>
      <p className="text-sm text-gray-500">Section: {sectionTitle}</p>
      <p className="text-sm text-gray-500">Program: {ProgramShortName}</p>
      <p className={`text-sm font-medium ${status === "Completed" ? "text-green-600" : "text-red-600"}`}>
        Status: {status}
      </p>
    </div>
  );
}
