// app/components/Dashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserTable from './UserTable';
import UserDetailsModal from './UserDetailsModal';

interface MonitoredUser {
  id: string;
  username: string;
  deviceName: string;
  status: 'online' | 'offline';
  connectionCount: number;
  meterReadingCount: number;
  lastSeen: string;
  registeredAt: string;
  protocols: string[];
  uniqueIps: string[];
  latestMeterReading: {
    timestamp: string;
    voltage_v: number;
    current_a: number;
    active_power_kw: number;
    power_factor: number;
    cumulative_kwh: number;
  } | null;
}

export default function Dashboard() {
  const [users, setUsers] = useState<MonitoredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<MonitoredUser | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/dashboard/users', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to fetch users');
        if (res.status === 401) {
          router.push('/login');
        }
        return;
      }

      setUsers(data.data);
      setError('');
    } catch (err) {
      setError('An error occurred while fetching users');
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const copyToClipboard = () => {
    const text = localStorage.getItem('token') || '';
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Error copying text: ', err);
        alert('Failed to copy text');
      });
  };

  const downloadScript = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const headers: Record<string, string> = {}
      if (token) headers['Authorization'] = `Bearer ${token}`

      const res = await fetch('/api/agent/download', { method: 'GET', headers })
      if (!res.ok) throw new Error('Failed to download agent')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'agent.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Agent download failed', err)
      alert('Failed to download agent. Check console for details.')
    }
  }

  const downloadMeter = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const headers: Record<string, string> = {}
      if (token) headers['Authorization'] = `Bearer ${token}`

      const res = await fetch('/api/monitor/meter/download', { method: 'GET', headers })
      if (!res.ok) throw new Error('Failed to download meter')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'meter.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Meter download failed', err)
      alert('Failed to download meter. Check console for details.')
    }
  }


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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Devices</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{users.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Online Devices</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {users.filter(u => u.status === 'online').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Offline Devices</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {users.filter(u => u.status === 'offline').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Connections</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {users.reduce((sum, u) => sum + u.connectionCount, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Meter Readings</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {users.reduce((sum, u) => sum + u.meterReadingCount, 0)}
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
            Getting Started with Smart Meter Monitoring
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Run the meter.py script on your smart meter device</li>
            <li>Update the script with your web app URL and JWT token</li>
            <li>The meter will register automatically and start sending readings</li>
            <li>Meter readings will appear in the table and dashboard</li>
            <li>Click on a device row to view detailed meter logs</li>
          </ol>
          {/* <div className='text-sm text-blue-700 mt-2'>
            Update WEB_APP_URL and TOKEN in the script before running.
          </div> */}
          <div className="mt-4 flex gap-2">
            {/* <button
              onClick={downloadScript}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 text-sm"
            >
              Download Agent Script
            </button> */}
            {/* <button
              onClick={downloadMeter}
              className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-lg transition duration-200 text-sm"
            >
              Download Script
            </button> */}
          </div>
          <div className='text-sm font-bold text-blue-600 mt-4'>Copy Token: <span onClick={copyToClipboard} className="cursor-pointer ml-2">{copied ? 'Copied!' : 'Click to Copy'}</span></div>
          <div className='text-sm font-bold text-blue-600 mt-2'>Run Script Command: python meter/meter.py</div>
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
