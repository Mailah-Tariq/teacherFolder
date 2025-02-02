"use client";

import { useEffect, useState } from "react";
import { Header } from "../component1/header";
import { Sidebar } from "../component1/dsidebar";
import { CourseCard } from "../component1/course-card";
import { FolderAllocation } from "../component1/folder-allocation";

type Course = {
  title: string;
  href: string;
  [key: string]: any; // Accommodates additional properties from API response
};

export default function Dashboard() {


  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64" />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Directer Dashboard</h2>

        
        </main>
      </div>
    </div>
  );
}
