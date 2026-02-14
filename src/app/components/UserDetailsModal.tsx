// app/components/UserDetailsModal.tsx
'use client';

import { useEffect, useState } from 'react';

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

interface NetworkConnection {
  id: string;
  sourceIp: string;
  sourcePort: number;
  destIp: string;
  destPort: number;
  protocol: string;
  bytesIn: number;
  bytesOut: number;
  packetsIn: number;
  packetsOut: number;
  state: string;
  timestamp: string;
  lastUpdated: string;
}

interface MeterReading {
  id: string;
  timestamp: string;
  voltage_v: number;
  current_a: number;
  active_power_kw: number;
  reactive_power_kvar: number;
  apparent_power_kva: number;
  power_factor: number;
  frequency_hz: number;
  cumulative_kwh: number;
  ip: string;
}

interface UserDetailsModalProps {
  user: MonitoredUser;
  onClose: () => void;
}

export default function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  const [connections, setConnections] = useState<NetworkConnection[]>([]);
  const [meterReadings, setMeterReadings] = useState<MeterReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState<any>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`/api/dashboard/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to fetch user details');
        return;
      }

      setConnections(data.data.connections || []);
      setMeterReadings(data.data.meterReadings || []);
      setSummary(data.data.summary);
      setError('');
    } catch (err) {
      setError('Failed to load user details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();

    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchUserDetails, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-96 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.deviceName}</h2>
              <p className="text-gray-600 text-sm mt-1">
                User: {user.username} | Status:
                <span className={`ml-2 font-semibold ${user.status === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                  {user.status.toUpperCase()}
                </span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading details...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          ) : (
            <>
            {/* Meter Readings Table */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Meter Readings</h3>
                {meterReadings.length === 0 ? (
                  <p className="text-gray-500 text-sm">No meter readings available</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 border-b">
                        <tr>
                          <th className="text-left px-3 py-2 font-semibold text-gray-700">Timestamp</th>
                          <th className="text-left px-3 py-2 font-semibold text-gray-700">Voltage (V)</th>
                          <th className="text-left px-3 py-2 font-semibold text-gray-700">Current (A)</th>
                          <th className="text-left px-3 py-2 font-semibold text-gray-700">Power (kW)</th>
                          <th className="text-left px-3 py-2 font-semibold text-gray-700">Power Factor</th>
                          <th className="text-left px-3 py-2 font-semibold text-gray-700">Energy (kWh)</th>
                          <th className="text-left px-3 py-2 font-semibold text-gray-700">IP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {meterReadings.slice(0, 10).map((reading) => (
                          <tr key={reading.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-xs text-gray-700">
                              {formatDate(reading.timestamp)}
                            </td>
                            <td className="px-3 py-2 text-xs font-mono text-gray-700">
                              {reading.voltage_v}
                            </td>
                            <td className="px-3 py-2 text-xs font-mono text-gray-700">
                              {reading.current_a}
                            </td>
                            <td className="px-3 py-2 text-xs font-mono text-gray-700">
                              {reading.active_power_kw}
                            </td>
                            <td className="px-3 py-2 text-xs font-mono text-gray-700">
                              {reading.power_factor}
                            </td>
                            <td className="px-3 py-2 text-xs font-mono text-gray-700">
                              {reading.cumulative_kwh}
                            </td>
                            <td className="px-3 py-2 text-xs font-mono text-gray-700">
                              {reading.ip}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {meterReadings.length > 10 && (
                      <p className="text-gray-500 text-xs mt-2">
                        Showing 10 of {meterReadings.length} meter readings
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Auto-refresh (3s)</span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={fetchUserDetails}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm"
            >
              Refresh
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
