// app/api/monitor/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { markDeviceStatus } from '@/lib/monitoring';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = body.userId || body.token;
    const { deviceName, status } = body;

    if (!status || (status !== 'online' && status !== 'offline')) {
      return NextResponse.json({ error: 'Valid status required' }, { status: 400 });
    }

    const ok = markDeviceStatus(userId, deviceName, status);
    if (!ok) {
      return NextResponse.json({ error: 'User or device not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}