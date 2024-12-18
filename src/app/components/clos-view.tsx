"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; 
import { Card, CardContent } from "../components/ui/card";

// Define the type for the CLO objects
interface CLO {
  Description: string;
}

export function CLOsView() {
  const [clos, setClos] = useState<CLO[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const courseId = localStorage.getItem('CourseInSOSId') || "";

// Fetch data from API
const fetchCLOs = async () => {
  try {
    console.log( `${localStorage.getItem('baseURL')}teacher/GetCourseCLO?CourseInSOSId=${courseId}`);
    const response = await fetch(
      `${localStorage.getItem('baseURL')}teacher/GetCourseCLO?CourseInSOSId=${courseId}`
    );
    console.log("API Response:", response);

    if (!response.ok) {
      throw new Error("Failed to fetch CLOs");
    }

    const data: CLO[] = await response.json();
    console.log("Fetched CLOs:", data);

    if (data.length === 0) {
      setError("No CLOs found for the specified course.");
    } else {
      setClos(data);
    }
  } catch (error) {
    setError((error as Error).message);
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  console.log("called.");
    if (!courseId) return; 

    console.log("called here.");
    
    fetchCLOs();
  }, [courseId]);

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold">CLOs</h2>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="grid grid-cols-1">
            <div className="p-4 border-b bg-gray-50">
              <span className="font-medium">Description</span>
            </div>

            {isLoading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : (
              clos.map((clo, index) => (
                <div
                  key={index}
                  className={`p-4 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } border-b last:border-b-0`}
                >
                  {clo.Description}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}