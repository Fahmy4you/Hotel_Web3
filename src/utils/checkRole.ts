import { NextResponse } from 'next/server';

export const checkRole = (payload: { role: number }, rolePermited: number) => {
    if (!payload || typeof payload.role !== 'number') {
        return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    if (payload.role !== rolePermited) {
        return NextResponse.json({ message: 'Access denied. Admins only.' }, { status: 403 });
    }

    return undefined;
}