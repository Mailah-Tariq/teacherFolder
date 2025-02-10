import { ReactNode } from "react";

interface FolderCardProps {
  title: string;
  teacherName: string;
  status: ReactNode; // Change string to ReactNode
  courseCode: string;
  sectionTitle: string;
  ProgramShortName: string;
  handleClick: () => void;
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
      <p className="text-sm font-medium">{status}</p> {/* Render status directly */}
    </div>
  );
}
