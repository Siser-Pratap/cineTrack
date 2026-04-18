import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = await params;
    const body = await req.json();
    const movie = await prisma.movie.update({
      where: { id: resolvedParams.id },
      data: body
    });
    return NextResponse.json(movie);
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: 'Failed to update movie' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = await params;
    await prisma.movie.delete({
      where: { id: resolvedParams.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: 'Failed to delete movie' }, { status: 500 });
  }
}
