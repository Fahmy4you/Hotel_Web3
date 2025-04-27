import { NextResponse } from 'next/server';
import { getSwaggerSpec } from '../../../../swagger';

export async function GET() {
  try {
    const spec = getSwaggerSpec();
    return NextResponse.json(spec);
  } catch (error) {
    console.error("Error generating spec:", error);
    return NextResponse.json({ error: "Failed to generate spec" }, { status: 500 });
  }
}