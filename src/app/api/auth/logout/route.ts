import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const tokenForDelete = request.cookies.get('refreshToken')?.value;
    if (!tokenForDelete) return NextResponse.json({ message: "Token not provided" }, { status: 401 });
    request.cookies.delete('refreshToken');
    const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });
    response.cookies.set('refreshToken', '', {maxAge : 0, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/' });
    return response;
    // return NextResponse.redirect(new URL('/', request.url));
}