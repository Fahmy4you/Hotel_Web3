import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_ACCSESS_TOKEN || '';

export const verifyToken = (token: string): { id: number; role: number } | NextResponse => {
    try {
        const payload = jwt.verify(token, JWT_SECRET) as { id: number; role: number };
        return payload;
    } catch (error) {
        return NextResponse.json({ message: 'Token expired or invalid' }, { status: 401 });
    }
};
