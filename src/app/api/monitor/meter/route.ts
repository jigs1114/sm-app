// app/api/monitor/meter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addMeterReading } from '@/lib/monitoring';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Support both 'token' (old) and 'userId' (new) field names for backward compatibility
    const userId = body.userId || body.token;
    const {
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

    if (!userId) {
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
    const reading = addMeterReading(userId, {
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