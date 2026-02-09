// app/api/monitor/connections/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { addNetworkConnection, updateDeviceStatus } from '@/lib/monitoring';

export async function POST(request: NextRequest) {
  try {
    const { token, sourceIp, sourcePort, destIp, destPort, protocol } = await request.json();

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

    if (!sourceIp || !destIp || !protocol) {
      return NextResponse.json(
        { error: 'Missing connection data' },
        { status: 400 }
      );
    }

    // Validate protocol
    const validProtocols = ['TCP', 'UDP', 'ICMP', 'OTHER'];
    if (!validProtocols.includes(protocol.toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid protocol' },
        { status: 400 }
      );
    }

    // Update device status to online
    updateDeviceStatus(decoded.id, 'online');

    // Add network connection
    const connection = addNetworkConnection(
      decoded.id,
      sourceIp,
      sourcePort || 0,
      destIp,
      destPort || 0,
      protocol.toUpperCase() as 'TCP' | 'UDP' | 'ICMP' | 'OTHER'
    );

    return NextResponse.json({
      success: true,
      data: connection
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
