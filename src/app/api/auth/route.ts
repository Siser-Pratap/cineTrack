import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { pin } = await req.json();
    
    let user = await prisma.user.findUnique({ where: { username: 'admin' } });
    if (!user) {
      const hashedDefaultPassword = await bcrypt.hash('171020', 10);
      user = await prisma.user.create({
        data: {
          username: 'admin',
          password: hashedDefaultPassword
        }
      });
    }

    const isPasswordValid = await bcrypt.compare(pin, user.password);
    
    if (isPasswordValid) {
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: 'auth-token',
        value: 'authenticated',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 // 1 hour
      });
      return response;
    }
    
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}