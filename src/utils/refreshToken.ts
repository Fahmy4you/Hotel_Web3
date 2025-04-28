import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCSESS_TOKEN as string;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH as string;

export const generateAccessToken = (user: { id: number; email: string, role: string }) => {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

export const generateRefreshToken = (user: { id: number; email: string, role: string }) => {
    return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}
