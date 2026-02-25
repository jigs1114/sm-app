// app/components/UserTable.tsx
'use client';

import { useState } from 'react';

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
  mergedCount?: number; // optional field added by backend
}

interface UserTableProps {
  users: MonitoredUser[];
  onSelectUser: (user: MonitoredUser) => void;
}

export default function UserTable({ users, onSelectUser }: UserTableProps) {
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'connections' | 'readings'>('name');

  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === 'name') {
      return a.username.localeCompare(b.username);
    } else if (sortBy === 'status') {
      return a.status === 'online' ? -1 : 1;
    } else if (sortBy === 'connections') {
      return b.connectionCount - a.connectionCount;
    } else if (sortBy === 'readings') {
      return b.meterReadingCount - a.meterReadingCount;
    }
    return 0;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Device Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Username
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
              onClick={() => setSortBy('status')}>
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
              onClick={() => setSortBy('connections')}>
              Connections
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
              onClick={() => setSortBy('readings')}>
              Readings
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Detected IPs
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Latest Reading
            </th>
            
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Last Seen
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedUsers.map((user) => (
            // deviceName is now considered unique across the list (backend dedupes)
            <tr key={user.deviceName} className="hover:bg-gray-50 transition duration-150 cursor-pointer">
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                {user.deviceName}
                {user.mergedCount && user.mergedCount > 1 && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                    ×{user.mergedCount}
                  </span>
                )}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                {user.username}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  user.status === 'online'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  <span className={`inline-flex rounded-full h-2 w-2 mr-2 ${
                    user.status === 'online' ? 'bg-green-600' : 'bg-red-600'
                  }`}></span>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                {user.connectionCount}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-orange-600">
                {user.meterReadingCount}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                <div className="max-w-32 truncate" title={user.uniqueIps.length > 0 ? user.uniqueIps.join(', ') : 'No IPs detected'}>
                  {user.uniqueIps.length > 0 ? user.uniqueIps.join(', ') : '—'}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                {user.latestMeterReading ? (
                  <div className="text-xs">
                    <div>V:{user.latestMeterReading.voltage_v}V I:{user.latestMeterReading.current_a}A</div>
                    <div>P:{user.latestMeterReading.active_power_kw}kW PF:{user.latestMeterReading.power_factor}</div>
                  </div>
                ) : (
                  <span className="text-gray-400">No readings</span>
                )}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatDate(user.lastSeen)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm">
                <button
                  onClick={() => onSelectUser(user)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
