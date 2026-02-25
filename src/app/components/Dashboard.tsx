// app/components/Dashboard.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
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
  mergedCount?: number;
}

export default function Dashboard() {
  const [users, setUsers] = useState<MonitoredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<MonitoredUser | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
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
    // extract userId from token for header display
    const token = localStorage.getItem('token') || '';
    try {
      const payload = token.split('.')[1];
      if (payload) {
        const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
        setUserId(decoded.id || token);
        setUserName(decoded.name || 'User')
      }
    } catch { }

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
    setMenuOpen(false);
    router.push('/login');
  };

  const copyToClipboard = () => {
    try {
      const token = localStorage.getItem('token') || '';
      // Extract userId from token payload
      const payload = token.split('.')[1];
      if (!payload) {
        alert('Unable to extract User ID from token');
        return;
      }
      const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
      const userId = decoded.id || token;

      navigator.clipboard.writeText(userId)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.error('Error copying text: ', err);
          alert('Failed to copy User ID');
        });
    } catch (err) {
      console.error('Error extracting User ID: ', err);
      alert('Failed to extract User ID from token');
    }
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


  // close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              {/* energy icon (bolt) */}
              <div><svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg> </div><span className="ml-2">Smart Monitor</span>
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Real-time network monitoring and device management
            </p>
          </div>
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white focus:outline-none"
            >
              {/* user icon: simple initials or person SVG */}
              <span className="font-bold">
                {userName ? userName.charAt(0).toUpperCase() : '👨🏻'}
              </span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10">
                <div
                  className="px-4 py-2 text-md font-bold text-gray-700 break-all cursor-pointer hover:bg-gray-50"

                >
                  {userName || 'unknown'} <span className="ml-1 text-gray-400" onClick={copyToClipboard}
                    title="Click to copy user ID">{copied ? '✅' : '📋'} </span>
                </div>

                <div className="border-t border-gray-100"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
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
        {/* <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-2"> */}

        {/* <div className='text-sm font-bold text-blue-600'>Copy User ID: <span onClick={copyToClipboard} className="cursor-pointer ml-2">{copied ? 'Copied!' : 'Click to Copy'}</span></div> */}
        {/* <div className='text-sm font-bold text-blue-600 mt-2'>Run Script Command: python meter/meter.py</div> */}
        {/* </div> */}
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
