// app/components/UserTable.tsx
'use client';

import { useState } from 'react';

interface MonitoredUser {
  id: string;
  username: string;
  deviceName: string;
  status: 'online' | 'offline';
  connectionCount: number;
  lastSeen: string;
  registeredAt: string;
  protocols: string[];
  uniqueIps: string[];
  ipv4Addresses: string[];
  ipv6Addresses: string[];
}

interface UserTableProps {
  users: MonitoredUser[];
  onSelectUser: (user: MonitoredUser) => void;
}

export default function UserTable({ users, onSelectUser }: UserTableProps) {
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'connections'>('name');

  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === 'name') {
      return a.username.localeCompare(b.username);
    } else if (sortBy === 'status') {
      return a.status === 'online' ? -1 : 1;
    } else if (sortBy === 'connections') {
      return b.connectionCount - a.connectionCount;
    }
    return 0;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Device Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Username
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
              onClick={() => setSortBy('status')}>
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
              onClick={() => setSortBy('connections')}>
              Connections
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Protocols
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              IPv4 Addresses
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              IPv6 Addresses
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Last Seen
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition duration-150 cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {user.deviceName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {user.username}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
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
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                {user.connectionCount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex gap-1 flex-wrap">
                  {user.protocols.length > 0 ? (
                    user.protocols.map((protocol) => (
                      <span
                        key={protocol}
                        className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded"
                      >
                        {protocol}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-xs">None</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-3 max-w-xs">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">IPv4:</p>
                    {user.ipv4Addresses.length > 0 ? (
                      <div className="flex gap-1 flex-wrap">
                        {user.ipv4Addresses.slice(0, 2).map((ip) => (
                          <span
                            key={ip}
                            className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded"
                          >
                            {ip}
                          </span>
                        ))}
                        {user.ipv4Addresses.length > 2 && (
                          <span className="text-blue-600 text-xs font-semibold py-1">+{user.ipv4Addresses.length - 2}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">None</span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-3 max-w-xs">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">IPv6:</p>
                    {user.ipv6Addresses.length > 0 ? (
                      <div className="flex gap-1 flex-wrap">
                        {user.ipv6Addresses.slice(0, 2).map((ip) => (
                          <span
                            key={ip}
                            className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded"
                          >
                            {ip.substring(0, 10)}...
                          </span>
                        ))}
                        {user.ipv6Addresses.length > 2 && (
                          <span className="text-purple-600 text-xs font-semibold py-1">+{user.ipv6Addresses.length - 2}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">None</span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatDate(user.lastSeen)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
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
