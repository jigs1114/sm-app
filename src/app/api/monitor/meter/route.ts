// app/api/monitor/meter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { addMeterReading } from '@/lib/monitoring';

export async function POST(request: NextRequest) {
  try {
    const {
      token,
      voltage_v,
      current_a,
      active_power_kw,
      reactive_power_kvar,
      apparent_power_kva,
      power_factor,
      frequency_hz,
      cumulative_kwh,
      ip
    } = await request.json();

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
    const reading = addMeterReading(decoded.id, {
      voltage_v: Number(voltage_v),
      current_a: Number(current_a),
      active_power_kw: Number(active_power_kw),
      reactive_power_kvar: Number(reactive_power_kvar),
      apparent_power_kva: Number(apparent_power_kva),
      power_factor: Number(power_factor),
      frequency_hz: Number(frequency_hz),
      cumulative_kwh: Number(cumulative_kwh),
      ip: ip || 'unknown'
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