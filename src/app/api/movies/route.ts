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
    
    // Prevent duplicates by title
    const existing = await prisma.movie.findFirst({
      where: { 
        title: {
          equals: body.title,
          mode: 'insensitive' // MongoDB Prisma driver feature for case-insensitive match
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Movie already exists in your list.' }, { status: 409 });
    }

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
