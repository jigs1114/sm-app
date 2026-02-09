// lib/monitoring.ts

// Utility functions for IP detection
function isIPv4(ip: string): boolean {
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipv4Pattern.test(ip)) return false;
  const parts = ip.split('.');
  return parts.every(part => {
    const num = parseInt(part);
    return num >= 0 && num <= 255;
  });
}

function isIPv6(ip: string): boolean {
  return ip.includes(':') && !ip.startsWith('127') && !ip.startsWith('0');
}

export interface NetworkConnection {
  id: string;
  userId: string;
  sourceIp: string;
  sourcePort: number;
  destIp: string;
  destPort: number;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'OTHER';
  bytesIn: number;
  bytesOut: number;
  packetsIn: number;
  packetsOut: number;
  state: string;
  timestamp: Date;
  lastUpdated: Date;
}

export interface MonitoredUser {
  id: string;
  username: string;
  deviceName: string;
  status: 'online' | 'offline';
  connections: NetworkConnection[];
  lastSeen: Date;
  registeredAt: Date;
}

// In-memory storage (replace with database in production)
let monitoredUsers: Map<string, MonitoredUser> = new Map();
let networkConnections: Map<string, NetworkConnection> = new Map();

export function registerMonitoredDevice(
  userId: string,
  username: string,
  deviceName: string
): MonitoredUser {
  const monitoredUser: MonitoredUser = {
    id: userId,
    username,
    deviceName,
    status: 'online',
    connections: [],
    lastSeen: new Date(),
    registeredAt: new Date()
  };

  monitoredUsers.set(userId, monitoredUser);
  return monitoredUser;
}

export function updateDeviceStatus(userId: string, status: 'online' | 'offline'): void {
  const user = monitoredUsers.get(userId);
  if (user) {
    user.status = status;
    user.lastSeen = new Date();
  }
}

export function addNetworkConnection(
  userId: string,
  sourceIp: string,
  sourcePort: number,
  destIp: string,
  destPort: number,
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'OTHER'
): NetworkConnection {
  const connection: NetworkConnection = {
    id: `${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    sourceIp,
    sourcePort,
    destIp,
    destPort,
    protocol,
    bytesIn: 0,
    bytesOut: 0,
    packetsIn: 0,
    packetsOut: 0,
    state: 'ESTABLISHED',
    timestamp: new Date(),
    lastUpdated: new Date()
  };

  networkConnections.set(connection.id, connection);

  const user = monitoredUsers.get(userId);
  if (user) {
    user.connections.push(connection);
    // Keep only last 100 connections per user
    if (user.connections.length > 100) {
      user.connections = user.connections.slice(-100);
    }
  }

  return connection;
}

export function updateNetworkConnection(
  connectionId: string,
  bytesIn: number,
  bytesOut: number,
  packetsIn: number,
  packetsOut: number
): void {
  const connection = networkConnections.get(connectionId);
  if (connection) {
    connection.bytesIn += bytesIn;
    connection.bytesOut += bytesOut;
    connection.packetsIn += packetsIn;
    connection.packetsOut += packetsOut;
    connection.lastUpdated = new Date();
  }
}

export function getAllMonitoredUsers(): MonitoredUser[] {
  return Array.from(monitoredUsers.values());
}

export function getMonitoredUser(userId: string): MonitoredUser | null {
  return monitoredUsers.get(userId) || null;
}

export function getUserConnections(userId: string): NetworkConnection[] {
  const user = monitoredUsers.get(userId);
  return user ? user.connections : [];
}
