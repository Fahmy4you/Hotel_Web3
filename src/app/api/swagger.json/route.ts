import { NextResponse } from 'next/server';
import  swaggerSpec  from '../../../../swagger';

export async function GET() {
  try {
    return NextResponse.json(swaggerSpec);
  } catch (error) {
    console.error("Error generating spec:", error);
    return NextResponse.json({ error: "Failed to generate spec" }, { status: 500 });
  }
}