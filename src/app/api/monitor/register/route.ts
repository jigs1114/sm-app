// app/api/monitor/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { registerMonitoredDevice } from '@/lib/monitoring';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Support both 'token' (old) and 'userId' (new) field names for backward compatibility
    const userId = body.userId || body.token;
    const deviceName = body.deviceName;

    console.log('[REGISTER] Received request:', { userId, deviceName });

    if (!userId) {
      console.log('[REGISTER] Missing userId/token');
      return NextResponse.json(
        { error: 'Token and device name required' },
        { status: 400 }
      );
    }

    if (!deviceName) {
      console.log('[REGISTER] Missing deviceName');
      return NextResponse.json(
        { error: 'Device name is required' },
        { status: 400 }
      );
    }

    const { user: monitoredUser, isNew } = registerMonitoredDevice(
      userId,
      'Device User',
      deviceName
    );

    if (isNew) {
      console.log('[REGISTER] Created new device entry for', deviceName);
    } else {
      console.log('[REGISTER] Found existing device entry for', deviceName);
    }

    return NextResponse.json({
      success: true,
      data: monitoredUser,
      reused: !isNew
    });
  } catch (error) {
    console.log('[REGISTER] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
