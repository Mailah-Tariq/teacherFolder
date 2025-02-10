"use client";

import { useEffect, useState } from "react";
import { Header } from "../component1/header";
import { Sidebar } from "../component1/dsidebar";

interface User {
  Id: number;
  Name: string;
}

interface Role {
  Id: number;
  Title: string;
}

interface UserRole {
  Id: number;
  Name: string;
  Username: string;
  Title: string;
}

export default function AssignRole() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const baseURL = localStorage.getItem("baseURL");
  const USERS_API = `${baseURL}/hod/AllUser`;
  const ROLES_API = `${baseURL}/hod/AllRoles`;
  const ASSIGN_ROLE_API = `${baseURL}/hod/AssignRole`;
  const USER_ROLES_API = `${baseURL}/hod/UserWithRoles`;
  const REMOVE_ROLE_API = `${baseURL}/hod/RemoveRole`;

  if (!baseURL) {
    setError("Base URL not found. Please configure it correctly.");
  }

  // Fetch Users
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(USERS_API);
      if (response.ok) {
        const data: User[] = await response.json();
        setUsers(data);
      } else {
        setError("Failed to fetch users.");
      }
    } catch {
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Roles
  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(ROLES_API);
      if (response.ok) {
        const data: Role[] = await response.json();
        setRoles(data);
      } else {
        setError("Failed to fetch roles.");
      }
    } catch {
      setError("Failed to fetch roles. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Users with Roles
  const fetchUserRoles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(USER_ROLES_API);
      if (response.ok) {
        const data: UserRole[] = await response.json();
        setUserRoles(data);
      } else {
        setError("Failed to fetch user roles.");
      }
    } catch {
      setError("Failed to fetch user roles. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Assign Role
  const assignRole = async () => {
    if (!selectedUser || !selectedRole) {
      setError("Please select a user and a role.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${ASSIGN_ROLE_API}?userId=${selectedUser}&roleId=${selectedRole}`, {
        method: "GET",
      });

      if (response.ok) {
        fetchUserRoles(); // Refresh user roles table
        setError(""); // Clear error
      } else {
        setError("Failed to assign role.");
      }
    } catch {
      setError("Failed to assign role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Remove Role
  const removeRole = async (roleId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${REMOVE_ROLE_API}?id=${roleId}`, {
        method: "GET",
      });

      if (response.ok) {
        fetchUserRoles(); // Refresh user roles table
        setError(""); // Clear error message
      } else {
        setError("Failed to remove role.");
      }
    } catch {
      setError("Failed to remove role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchUserRoles();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64" />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Assign Role</h2>

          {/* Error Message */}
          {error && <p className="text-red-500">{error}</p>}

          {/* User Selection Dropdown */}
          <div className="mb-6">
            <label htmlFor="user" className="block text-sm font-medium text-gray-700">
              Select User:
            </label>
            <select
              id="user"
              value={selectedUser || ""}
              onChange={(e) => setSelectedUser(Number(e.target.value))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">-- Select a User --</option>
              {users.map((user) => (
                <option key={user.Id} value={user.Id}>
                  {user.Name}
                </option>
              ))}
            </select>
          </div>

          {/* Role Selection Dropdown */}
          <div className="mb-6">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Select Role:
            </label>
            <select
              id="role"
              value={selectedRole || ""}
              onChange={(e) => setSelectedRole(Number(e.target.value))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">-- Select a Role --</option>
              {roles.map((role) => (
                <option key={role.Id} value={role.Id}>
                  {role.Title}
                </option>
              ))}
            </select>
          </div>

          {/* Assign Role Button */}
          <button
            onClick={assignRole}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Assigning..." : "Assign Role"}
          </button>

          {/* User Roles Table */}
          <h3 className="text-xl font-semibold mt-6 mb-4">User Roles</h3>
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Username</th>
                <th className="border border-gray-300 px-4 py-2">Role</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userRoles.map((userRole) => (
                <tr key={userRole.Id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{userRole.Name}</td>
                  <td className="border border-gray-300 px-4 py-2">{userRole.Username}</td>
                  <td className="border border-gray-300 px-4 py-2">{userRole.Title}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => removeRole(userRole.Id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}
