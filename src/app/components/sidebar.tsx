"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LayoutDashboard, BookOpen, Users } from "lucide-react";

export function Sidebar() {
  const router = useRouter();
  const [userName, setUserName] = useState("Loading...");
  const [roles, setRoles] = useState<string[]>([]);
  const [activeRole, setActiveRole] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserName = localStorage.getItem("username");
      const storedRoles = JSON.parse(localStorage.getItem("roles") || "[]");
      const storedActiveRole = localStorage.getItem("activeRole") || storedRoles[0] || "guest";

      setUserName(storedUserName || "No User Found");
      setRoles(storedRoles);
      setActiveRole(storedActiveRole);
    }
  }, []);

  // Handle Role Switching
  const handleRoleSwitch = (role: string) => {
    localStorage.setItem("activeRole", role);
    setActiveRole(role);
    router.push(getDashboardRoute(role));
  };

  // Get dashboard route based on role
  const getDashboardRoute = (role: string) => {
    switch (role.toLowerCase()) {
      case "hod":
        return "/hodDashboard";
      case "teacher":
        return "/dashboard";
      case "director":
        return "/directorDashboard";
      default:
        return "/dashboard";
    }
  };

  return (
    <div className="w-64 bg-emerald-600 min-h-screen text-white p-4">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 bg-white rounded-full overflow-hidden mb-2">
          <Image src="/assets/logo.png" alt="Profile" width={80} height={80} className="object-cover" />
        </div>
        <h2 className="text-lg font-semibold">{userName}</h2>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-2">
        <Link href="/dashboard" className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-emerald-700">
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Link href="/contentdetails" className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-emerald-700">
          <BookOpen className="w-5 h-5" />
          <span>Covered Courses</span>
        </Link>
        <Link href="/sessions" className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-emerald-700">
          <Users className="w-5 h-5" />
          <span>Sessions</span>
        </Link>
      </nav>

      {/* Role Switching Dropdown */}
      {roles.length > 1 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold">Switch Role:</h3>
          <select
            value={activeRole}
            onChange={(e) => handleRoleSwitch(e.target.value)}
            className="w-full mt-2 p-2 rounded bg-white text-black"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
