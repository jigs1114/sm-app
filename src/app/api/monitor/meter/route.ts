// app/api/monitor/meter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addMeterReading, hasMonitoredUser, findUserByDeviceName, getUsersByDeviceName, registerMonitoredDevice, getMonitoredUser } from '@/lib/monitoring';

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
      // if the token/userId was not recognized, try locating by name.  only
      // fall back when there is a single match to avoid delivering readings
      // into the wrong account if two users happen to use the same device
      // name.
      const candidates = getUsersByDeviceName(deviceName);
      if (candidates.length === 1) {
        realUserId = candidates[0].id;
        console.log('[METER] Fallback to userId from deviceName', deviceName);
      } else if (candidates.length > 1) {
        // Try to find the user by matching the original userId pattern
        // or fall back to the most recently updated user
        const mostRecentUser = candidates.reduce((latest, current) => {
          return new Date(current.lastSeen) > new Date(latest.lastSeen) ? current : latest;
        });
        realUserId = mostRecentUser.id;
        console.log('[METER] Multiple users with deviceName, using most recent:', deviceName, realUserId);
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
    console.log('[METER] incoming reading', { userId: realUserId, deviceName, originalUserId: userId });

    // Add debug logging to track user entries
    const user = getMonitoredUser(realUserId);
    if (!user) {
      console.error('[METER] ERROR - User not found after ID resolution:', { realUserId, deviceName, originalUserId: userId });
      return NextResponse.json(
        { error: 'User not found after ID resolution' },
        { status: 404 }
      );
    }

    console.log('[METER] User found, current readings count:', user.meterReadings.length);

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

    console.log('[METER] Reading added, new count:', user.meterReadings.length);

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