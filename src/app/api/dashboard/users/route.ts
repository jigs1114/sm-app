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

    const users = getAllMonitoredUsers();

    return NextResponse.json({
      success: true,
      data: users.map(user => {
        const allIps = user.connections.flatMap(c => [c.sourceIp, c.destIp]);
        const latestMeterReading = user.meterReadings.length > 0
          ? user.meterReadings[user.meterReadings.length - 1]
          : null;
        
        return {
          id: user.id,
          username: user.username,
          deviceName: user.deviceName,
          status: user.status,
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
          } : null
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
