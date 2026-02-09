// app/api/dashboard/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getAllMonitoredUsers } from '@/lib/monitoring';

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

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Token required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const users = getAllMonitoredUsers();

    return NextResponse.json({
      success: true,
      data: users.map(user => {
        const allIps = user.connections.flatMap(c => [c.sourceIp, c.destIp]);
        const ipv4Addresses = [...new Set(allIps.filter(ip => isIPv4(ip)))];
        const ipv6Addresses = [...new Set(allIps.filter(ip => isIPv6(ip)))];
        
        return {
          id: user.id,
          username: user.username,
          deviceName: user.deviceName,
          status: user.status,
          connectionCount: user.connections.length,
          lastSeen: user.lastSeen,
          registeredAt: user.registeredAt,
          protocols: [...new Set(user.connections.map(c => c.protocol))],
          uniqueIps: [...new Set(allIps)],
          ipv4Addresses,
          ipv6Addresses
        }
      })
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
