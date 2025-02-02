// LoginPage.tsx
'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const queryParams = new URLSearchParams({ username, password });

    try {
      localStorage.setItem('baseURL', 'https://localhost:44338/api/');

      const response = await fetch(`${localStorage.getItem('baseURL')}teacher/Login?${queryParams}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      console.log('Full Response Data:', data);

      if (response.ok) {
        const userName = data.Name || data.name || data.username || 'Unknown User';
        const userRoles = Array.isArray(data.Role) ? data.Role : [data.Role || 'guest'];
        const defaultRole = userRoles.length > 0 ? userRoles[0] : 'guest';

        localStorage.setItem('userId', data.Id.toString());
        localStorage.setItem('username', JSON.stringify(userName));
        localStorage.setItem('roles', JSON.stringify(userRoles));
        localStorage.setItem('activeRole', defaultRole);

        router.push(getDashboardRoute(defaultRole));
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError('An error occurred while logging in.');
    }
  };

  const getDashboardRoute = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return '/admin-dashboard';
      case 'teacher': return '/dashboard';
      case 'director': return '/directorDashboard';
      default: return '/dashboard';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-[1200px] grid md:grid-cols-2 gap-8 p-4 items-center">
        <div className="hidden md:flex justify-center">
          <Image src="/assets/logo.png" alt="Login illustration" width={500} height={500} className="object-contain" priority />
        </div>

        <div className="flex justify-center">
          <Card className="w-full max-w-[400px] p-6 shadow-lg">
            <CardContent className="space-y-6">
              <div className="flex justify-center mb-8">
                <Image src="/assets/logo.png" alt="Institute logo" width={96} height={96} className="object-contain" priority />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="h-12 px-4 border-gray-200" />
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="h-12 px-4 border-gray-200" />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium">Login</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}