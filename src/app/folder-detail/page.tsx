"use client";

import { useEffect, useState } from "react";
import { Header } from "../component1/header";
import { Sidebar } from "../component1/sidebar";

export default function FolderDetails() {
  const [details, setDetails] = useState<string>(""); // State to store details
  const [isLoading, setIsLoading] = useState(false); // State to handle loading
  const [error, setError] = useState(""); // State to handle errors

  // Define the API URL (using hardcoded base URL for now)
  const BASE_URL = "https://localhost:44338/api/folder"; // Replace with your actual base URL
  const STATUS_API_URL = `${BASE_URL}/folderstatus`;

  useEffect(() => {
    const allocId = localStorage.getItem("allocId");
    if (!allocId) {
      setError("No allocation ID found.");
      return;
    }
    fetchFolderStatus(parseInt(allocId));
  }, []);

  // Fetch folder status from the API
  const fetchFolderStatus = async (allocId: number) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${STATUS_API_URL}?allocationId=${allocId}`);
      if (response.ok) {
        const data = await response.json();
        setDetails(data.Messsage); // Update the details with the API response
      } else {
        const errorData = await response.json();
        setError(errorData.Message || "An error occurred while fetching the folder status.");
        setDetails("");
      }
    } catch (err) {
      setError("Failed to fetch folder status. Please check your network or try again later.");
      setDetails("");
    } finally {
      setIsLoading(false);
    }
  };

  // Split details by commas and group them into categories
  const categories = details.split("\n").map((category, index) => {
    return category.split(",").map((item, idx) => ({
      categoryName: category.split("/")[0],
      missingItem: item.trim(),
    }));
  });

  // Render category cards
  const renderCategoryCards = categories.map((categoryItems, index) => (
    <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <div className="bg-white shadow-lg rounded-lg p-4">
        <h4 className="text-xl font-bold mb-4"> {categoryItems[0].categoryName}</h4>
        <ul className="space-y-2">
          {categoryItems.map((item, idx) => (
            <li key={idx} className="text-gray-700">
              <strong>{item.missingItem}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  ));

  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64" />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Folder Details</h2>
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {details && (
            <div>
              {renderCategoryCards}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
