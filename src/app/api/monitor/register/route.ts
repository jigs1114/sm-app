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

    const monitoredUser = registerMonitoredDevice(
      userId,
      'Device User',
      deviceName
    );

    console.log('[REGISTER] Device registered successfully:', userId);

    return NextResponse.json({
      success: true,
      data: monitoredUser
    });
  } catch (error) {
    console.log('[REGISTER] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
