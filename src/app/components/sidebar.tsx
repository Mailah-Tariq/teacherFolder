


"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, BookOpen, Users } from "lucide-react";

export function Sidebar() {
  const [userName, setUserName] = useState("Loading...");

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const storedUserName = localStorage.getItem('username');
      console.log('Stored Username:', storedUserName);
      
      setUserName(storedUserName || 'No User Found');
    }
  }, []);

  
  

  return (
    <div className="w-64 bg-emerald-600 min-h-screen text-white p-4">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 bg-white rounded-full overflow-hidden mb-2">
          <Image
            src="/assets/logo.png"
            alt="Profile"
            width={80}
            height={80}
            className="object-cover"
          />
        </div>
        <h2 className="text-lg font-semibold">{userName}</h2>
      </div>

      <nav className="space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-emerald-700"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/contentdetails"
          className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-emerald-700"
        >
          <BookOpen className="w-5 h-5" />
          <span>Covered Courses</span>
        </Link>
        <Link
          href="/sessions"
          className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-emerald-700"
        >
          <Users className="w-5 h-5" />
          <span>Sessions</span>
        </Link>
      </nav>
    </div>
  );
}