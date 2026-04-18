import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(movies || []);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const movie = await prisma.movie.create({
      data: {
        title: body.title,
        description: body.description,
        genre: body.genre,
        language: body.language,
        releaseYear: body.releaseYear,
        posterUrl: body.posterUrl,
        imdbLink: body.imdbLink,
        priority: body.priority || 'Medium',
        status: 'ToWatch'
      }
    });
    return NextResponse.json(movie);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create movie' }, { status: 500 });
  }
}
