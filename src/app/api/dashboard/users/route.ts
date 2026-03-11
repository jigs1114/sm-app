// app/api/dashboard/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getAllMonitoredUsers, MonitoredUser, deleteUserByDeviceName } from '@/lib/monitoring';

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

    // deduplicate by deviceName **and username**.  previously the
    // dashboard collapsed multiple entries with the same name, which meant
    // two different accounts using identical device names would only show a
    // single row.  we still want to merge duplicates that belong to the
    // *same* user (e.g. script re-registered with a new token), but not
    // across users.
    interface Aggregated extends MonitoredUser {
      mergedCount: number;
    }
    const dedupMap: Record<string, Aggregated> = {};

    users.forEach((u) => {
      const key = `${u.username}:${u.deviceName}`;
      if (!dedupMap[key]) {
        dedupMap[key] = { ...u, mergedCount: 1 } as Aggregated;
      } else {
        const existing = dedupMap[key];
        existing.mergedCount += 1;
        
        // Merge connections, ensuring no duplicates
        const existingConnectionIds = new Set(existing.connections.map(c => c.id));
        const newConnections = u.connections.filter(c => !existingConnectionIds.has(c.id));
        existing.connections = existing.connections.concat(newConnections);
        
        // Merge meter readings, sort by timestamp and keep most recent
        const allReadings = existing.meterReadings.concat(u.meterReadings);
        allReadings.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        existing.meterReadings = allReadings.slice(0, 100); // Keep last 100 readings
        
        // Update with most recent data
        if (new Date(u.lastSeen) > new Date(existing.lastSeen)) {
          existing.lastSeen = u.lastSeen;
          existing.registeredAt = u.registeredAt; // Keep original registration if it's earlier
        }
        
        // Status is online if any instance is online
        existing.status = existing.status === 'online' || u.status === 'online' ? 'online' : 'offline';
        
        // Keep the most recent device ID (helps with tracking)
        if (new Date(u.registeredAt) >= new Date(existing.registeredAt)) {
          existing.id = u.id;
        }
      }
    });

    const dedupedUsers = Object.values(
      dedupMap as Record<string, MonitoredUser & {mergedCount: number}>
    );

    const now = new Date();
    const OFFLINE_THRESHOLD_MS = 45 * 1000; // 45 seconds without updates -> offline (reduced from 30s to account for 35s transmission interval)

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

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const deviceName = searchParams.get('deviceName');

    if (!deviceName) {
      return NextResponse.json(
        { error: 'Device name is required' },
        { status: 400 }
      );
    }

    const deleted = deleteUserByDeviceName(deviceName);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Device not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Device deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
