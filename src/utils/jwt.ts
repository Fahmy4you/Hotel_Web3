import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_ACCESS_TOKEN!);
const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH!);

export async function generateAccessToken(payload: {}) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS526' })
    .setExpirationTime('15m')
    .sign(secret);
}

export async function generateRefreshToken(payload: {}) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(refreshSecret);
}

export async function verifyAccessToken(token: string) {
  return await jwtVerify(token, secret);
}

export async function verifyRefreshToken(token: string) {
  return await jwtVerify(token, refreshSecret);
}
