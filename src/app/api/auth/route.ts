import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { pin } = await req.json();
    const correctPin = process.env.APP_PIN || '123456';
    
    if (pin === correctPin) {
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: 'auth-token',
        value: 'authenticated',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });
      return response;
    }
    
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}