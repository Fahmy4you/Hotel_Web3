import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, generateAccessToken } from '@/utils/jwt';

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: 'Refresh token not found' }, { status: 401 });
  }

  try {
    const { payload } = await verifyRefreshToken(refreshToken);

    const newAccessToken = await generateAccessToken({
      id: payload.id,
      wallet_address: payload.wallet_address,
      role: payload.role,
    });

    return NextResponse.json({ accessToken: newAccessToken });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid or expired refresh token' }, { status: 401 });
  }
}
