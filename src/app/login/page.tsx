 

'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

      localStorage.setItem('baseURL','https://localhost:44338/api/');

      const response = await fetch(`${localStorage.getItem('baseURL')}teacher/Login?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json(); // Move this before the if statement
      console.log('Full Response Data:', data); // Log the entire response
  
      if (response.ok) {
        // Try different potential property names for the name
        const userName = data.Name || data.name || data.username || 'Unknown User';
        
        localStorage.setItem('userId', data.Id);
        localStorage.setItem('username', userName);
        router.push('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError('An error occurred while logging in.');
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-[1200px] grid md:grid-cols-2 gap-8 p-4 items-center">
        {/* Left side illustration */}
        <div className="hidden md:flex justify-center">
          <div className="relative w-full max-w-[500px] aspect-square">
            <Image
              src="/assets/logo.png"
              alt="Login illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Right side login form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-[400px] p-6 shadow-lg">
            <CardContent className="space-y-6">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <div className="relative w-24 h-24">
                  <Image
                    src="/assets/logo.png"
                    alt="Institute logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="BIIT350"
                    className="h-12 px-4 border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 px-4 border-gray-200"
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
                <Button
                  type="submit"
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                >
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

