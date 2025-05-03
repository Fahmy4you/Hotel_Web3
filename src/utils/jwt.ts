import { SignJWT, jwtVerify } from 'jose';

const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH!);
export async function generateRefreshToken(payload: {}) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(refreshSecret);
}

export async function verifyRefreshToken(token: string): Promise<{id: number; wallet_address: string; role: number}> {
  const {payload} = await jwtVerify(token, refreshSecret);
  return payload as { id: number; wallet_address: string; role: number}
}