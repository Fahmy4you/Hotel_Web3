// utils/validateUserId.ts
import { NextResponse } from 'next/server';

export const validatorID = (idParam: string): number | NextResponse => {
    const userId = Number(idParam);
    if (isNaN(userId)) {
        return NextResponse.json({ message: 'Invalid user_id parameter' }, { status: 400 });
    }
    return userId;
};
