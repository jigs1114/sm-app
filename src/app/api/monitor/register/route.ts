// app/api/monitor/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { registerMonitoredDevice } from '@/lib/monitoring';

export async function POST(request: NextRequest) {
  try {
    const { token, deviceName } = await request.json();

    if (!token || !deviceName) {
      return NextResponse.json(
        { error: 'Token and device name required' },
        { status: 400 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const monitoredUser = registerMonitoredDevice(
      decoded.id,
      decoded.username,
      deviceName
    );

    return NextResponse.json({
      success: true,
      data: monitoredUser
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
