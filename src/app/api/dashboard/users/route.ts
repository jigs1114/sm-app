// app/api/dashboard/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getAllMonitoredUsers } from '@/lib/monitoring';

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

    let users = getAllMonitoredUsers();

    // deduplicate by deviceName so frontend never sees two rows with same name
    interface Aggregated extends MonitoredUser {
      mergedCount: number;
    }
    const dedupMap: Record<string, Aggregated> = {};

    users.forEach((u) => {
      const key = u.deviceName;
      if (!dedupMap[key]) {
        dedupMap[key] = { ...u, mergedCount: 1 } as Aggregated;
      } else {
        const existing = dedupMap[key];
        existing.mergedCount += 1;
        // merge counts and arrays
        existing.connections = existing.connections.concat(u.connections);
        existing.meterReadings = existing.meterReadings.concat(u.meterReadings);
        existing.lastSeen = existing.lastSeen > u.lastSeen ? existing.lastSeen : u.lastSeen;
        existing.status = existing.status === 'online' || u.status === 'online' ? 'online' : 'offline';
        // keep original id and username
      }
    });

    const dedupedUsers = Object.values(dedupMap as Record<string, MonitoredUser & {mergedCount: number}>);

    const now = new Date();
    const OFFLINE_THRESHOLD_MS = 120 * 1000; // 2 minutes without updates -> offline

    return NextResponse.json({
      success: true,
      data: dedupedUsers.map(user => {
        // adjust status based on lastSeen age
        let status = user.status;
        if (now.getTime() - new Date(user.lastSeen).getTime() > OFFLINE_THRESHOLD_MS) {
          status = 'offline';
        }

        const connectionIps = user.connections.flatMap(c => [c.sourceIp, c.destIp]);
        const meterReadingIps = user.meterReadings.map(r => r.ip).filter(ip => ip && ip !== 'unknown');
        const allIps = [...connectionIps, ...meterReadingIps];
        const latestMeterReading = user.meterReadings.length > 0
          ? user.meterReadings[user.meterReadings.length - 1]
          : null;
        
        return {
          id: user.id,
          username: user.username,
          deviceName: user.deviceName,
          status,
          connectionCount: user.connections.length,
          meterReadingCount: user.meterReadings.length,
          lastSeen: user.lastSeen,
          registeredAt: user.registeredAt,
          protocols: [...new Set(user.connections.map(c => c.protocol))],
          uniqueIps: [...new Set(allIps)],
          latestMeterReading: latestMeterReading ? {
            timestamp: latestMeterReading.timestamp,
            voltage_v: latestMeterReading.voltage_v,
            current_a: latestMeterReading.current_a,
            active_power_kw: latestMeterReading.active_power_kw,
            power_factor: latestMeterReading.power_factor,
            cumulative_kwh: latestMeterReading.cumulative_kwh
          } : null,
          mergedCount: (user as any).mergedCount || 1
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
