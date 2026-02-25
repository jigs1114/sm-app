// app/api/monitor/meter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addMeterReading, hasMonitoredUser, findUserByDeviceName, registerMonitoredDevice } from '@/lib/monitoring';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Support both 'token' (old) and 'userId' (new) field names for backward compatibility
    const userId = body.userId || body.token;
    const {
      deviceName,
      voltage_v,
      current_a,
      active_power_kw,
      reactive_power_kvar,
      apparent_power_kva,
      power_factor,
      frequency_hz,
      cumulative_kwh,
      ip,
      protocol
    } = body;

    let realUserId = userId;

    // if the userId/token doesn't match an existing entry, try locating by
    // deviceName. this covers cases where the script re-registered and
    // started using a different token before the dashboard refreshed.
    if (!hasMonitoredUser(realUserId) && deviceName) {
      const existing = findUserByDeviceName(deviceName);
      if (existing) {
        realUserId = existing.id;
        console.log('[METER] Fallback to userId from deviceName', deviceName);
      }
    }

    if (!realUserId) {
      // attempt to auto-register using deviceName if available
      if (deviceName) {
        console.log('[METER] User ID missing, auto-registering device:', deviceName);
        const { user: newUser } = registerMonitoredDevice(
          // generate a temporary id if none provided
          userId || `auto-${Date.now()}-${Math.random().toString(36).substr(2,5)}`,
          'Auto device',
          deviceName
        );
        realUserId = newUser.id;
      }
    }

    if (!realUserId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Validate required meter data
    if (
      voltage_v === undefined ||
      current_a === undefined ||
      active_power_kw === undefined ||
      reactive_power_kvar === undefined ||
      apparent_power_kva === undefined ||
      power_factor === undefined ||
      frequency_hz === undefined ||
      cumulative_kwh === undefined
    ) {
      return NextResponse.json(
        { error: 'Missing meter reading data' },
        { status: 400 }
      );
    }

    // Add meter reading
    console.log('[METER] incoming reading', { userId: realUserId, deviceName });
    const reading = addMeterReading(realUserId, {
      voltage_v: Number(voltage_v),
      current_a: Number(current_a),
      active_power_kw: Number(active_power_kw),
      reactive_power_kvar: Number(reactive_power_kvar),
      apparent_power_kva: Number(apparent_power_kva),
      power_factor: Number(power_factor),
      frequency_hz: Number(frequency_hz),
      cumulative_kwh: Number(cumulative_kwh),
      ip: ip || 'unknown',
      protocol: (protocol === 'TCP' || protocol === 'UDP') ? protocol : 'TCP'
    });

    return NextResponse.json({
      success: true,
      data: reading
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}