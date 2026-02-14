// app/api/dashboard/user/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getMonitoredUser, getUserConnections, getUserMeterReadings } from '@/lib/monitoring';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
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

    const { userId } = await params;
    const user = getMonitoredUser(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const connections = getUserConnections(userId);
    const meterReadings = getUserMeterReadings(userId);

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        deviceName: user.deviceName,
        status: user.status,
        lastSeen: user.lastSeen,
        registeredAt: user.registeredAt,
        connections: connections.map(c => ({
          id: c.id,
          sourceIp: c.sourceIp,
          sourcePort: c.sourcePort,
          destIp: c.destIp,
          destPort: c.destPort,
          protocol: c.protocol,
          bytesIn: c.bytesIn,
          bytesOut: c.bytesOut,
          packetsIn: c.packetsIn,
          packetsOut: c.packetsOut,
          state: c.state,
          timestamp: c.timestamp,
          lastUpdated: c.lastUpdated
        })),
        meterReadings: meterReadings.map(r => ({
          id: r.id,
          timestamp: r.timestamp,
          voltage_v: r.voltage_v,
          current_a: r.current_a,
          active_power_kw: r.active_power_kw,
          reactive_power_kvar: r.reactive_power_kvar,
          apparent_power_kva: r.apparent_power_kva,
          power_factor: r.power_factor,
          frequency_hz: r.frequency_hz,
          cumulative_kwh: r.cumulative_kwh,
          ip: r.ip
        })),
        summary: {
          totalConnections: connections.length,
          protocols: [...new Set(connections.map(c => c.protocol))],
          uniqueSourceIps: [...new Set(connections.map(c => c.sourceIp))],
          uniqueDestIps: [...new Set(connections.map(c => c.destIp))],
          totalBytesIn: connections.reduce((sum, c) => sum + c.bytesIn, 0),
          totalBytesOut: connections.reduce((sum, c) => sum + c.bytesOut, 0),
          totalPacketsIn: connections.reduce((sum, c) => sum + c.packetsIn, 0),
          totalPacketsOut: connections.reduce((sum, c) => sum + c.packetsOut, 0)
        }
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
