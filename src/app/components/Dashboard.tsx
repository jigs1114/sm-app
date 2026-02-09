// app/components/Dashboard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserTable from "./UserTable";
import UserDetailsModal from "./UserDetailsModal";

interface MonitoredUser {
  id: string;
  username: string;
  deviceName: string;
  status: "online" | "offline";
  connectionCount: number;
  lastSeen: string;
  registeredAt: string;
  protocols: string[];
  uniqueIps: string[];
  ipv4Addresses: string[];
  ipv6Addresses: string[];
}

export default function Dashboard() {
  const [users, setUsers] = useState<MonitoredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [selectedUser, setSelectedUser] = useState<MonitoredUser | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [downloadingAgent, setDownloadingAgent] = useState(false);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/dashboard/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to fetch users");
        if (res.status === 401) {
          router.push("/login");
        }
        return;
      }

      setUsers(data.data);
      setError("");
    } catch (err) {
      setError("An error occurred while fetching users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    // Set up auto-refresh every 5 seconds
    const interval = setInterval(fetchUsers, 5000);
    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const downloadAgentFolder = async () => {
    try {
      setDownloadingAgent(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to download the agent");
        return;
      }

      const response = await fetch("/api/agent/download", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download agent");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "monitor-agent.tar.gz";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download agent folder. Please try again.");
    } finally {
      setDownloadingAgent(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Smart Meter Monitor Dashboard
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Real-time network monitoring and device management
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Devices</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {users.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">
              Online Devices
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {users.filter((u) => u.status === "online").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">
              Offline Devices
            </h3>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {users.filter((u) => u.status === "offline").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">
              Total Connections
            </h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {users.reduce((sum, u) => sum + u.connectionCount, 0)}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Monitored Devices
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={fetchUsers}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                  Refresh Now
                </button>
                <span className="text-sm text-gray-500 py-2">
                  Auto-refreshing every 5 seconds
                </span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">Loading devices...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">No devices registered yet.</p>
              <p className="text-gray-400 text-sm mt-2">
                Run the monitoring script on a device to register it.
              </p>
            </div>
          ) : (
            <UserTable users={users} onSelectUser={setSelectedUser} />
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4">
            Getting Started
          </h3>
          <div className="text-sm text-blue-800 mb-4">
            To start monitoring your devices, follow these steps:
          </div>
          <button
            onClick={downloadAgentFolder}
            disabled={downloadingAgent}
            className="mt-2 mb-5 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold py-1 px-3 rounded-lg transition duration-200"
          >
            {downloadingAgent ? "Downloading..." : "Download Agent Folder"}
          </button>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
            <li>Run the monitoring script on your device (see below)
              <div className="bg-gray-100 rounded-lg p-4 mt-2">
                python monitor-agent.py --token "YOUR_TOKEN" --device "My
                Device"
              </div>
              <button
                onClick={() => {
                  const token = localStorage.getItem("token") || "YOUR_TOKEN";
                  navigator.clipboard.writeText(
                    `python monitor-agent.py --token "${token}" --device "My Device"`,
                  );
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                }}
                className="mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-lg transition duration-200"
              >
                {isCopied ? "Copied!" : "Copy Command"}
              </button>
            </li>
            <li>The device will appear in the table once it connects</li>
            <li>Click on a device row to view detailed network activity</li>
            <li>Monitor TCP/UDP connections in real-time</li>
          </ol>
        </div>
      </main>

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
