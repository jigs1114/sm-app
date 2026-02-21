// app/api/monitor/connections/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addNetworkConnection, updateDeviceStatus } from '@/lib/monitoring';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Support both 'token' (old) and 'userId' (new) field names for backward compatibility
    const userId = body.userId || body.token;
    const { sourceIp, sourcePort, destIp, destPort, protocol } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    if (!sourceIp || !destIp || !protocol) {
      return NextResponse.json(
        { error: 'Missing connection data' },
        { status: 400 }
      );
    }

    // Validate protocol - Only TCP and UDP supported
    const validProtocols = ['TCP', 'UDP'];
    if (!validProtocols.includes(protocol.toUpperCase())) {
      return NextResponse.json(
        { error: 'Only TCP and UDP protocols are supported' },
        { status: 400 }
      );
    }

    // Update device status to online
    updateDeviceStatus(userId, 'online');

    // Add network connection
    const connection = addNetworkConnection(
      userId,
      sourceIp,
      sourcePort || 0,
      destIp,
      destPort || 0,
      protocol.toUpperCase() as 'TCP' | 'UDP'
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
