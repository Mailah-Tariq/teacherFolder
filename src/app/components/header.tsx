"use client";

import { Bell, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b p-4 flex justify-between items-center relative">
      {/* Logo and Institute Name */}
      <div className="flex items-center space-x-2">
        <Image
          src="/assets/logo.png"
          alt="Institute Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <h1 className="text-xl font-semibold">
          Barani Institute of Information Technology
        </h1>
      </div>

      {/* Bell and Dropdown Icon */}
      <div className="flex items-center space-x-4 relative">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Bell className="w-6 h-6" />
        </button>
        <button
          className="p-2 hover:bg-gray-100 rounded-full"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <MoreVertical className="w-6 h-6" />
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute top-12 right-0 bg-white border shadow-lg rounded-md w-48 z-10">
            <ul className="text-sm">
              <li className="p-2 hover:bg-gray-100 cursor-pointer">
                <Link href="/hodDashboard">
                  Dr. Munir Ahmad
                </Link>
              </li>
              <li className="p-2 hover:bg-gray-100 cursor-pointer">
                <Link href="/dashboard">
                  Teacher Dashboard
                </Link>
              </li>
              
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
