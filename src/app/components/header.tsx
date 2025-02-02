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

      </div>
    </header>
  );
}
