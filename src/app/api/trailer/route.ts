import { NextResponse } from 'next/server';
import ytSearch from 'yt-search';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  
  if (!q) return NextResponse.json({ videoId: null });

  try {
    const r = await ytSearch(q + ' official trailer');
    const videos = r.videos;
    
    if (videos && videos.length > 0) {
      return NextResponse.json({ videoId: videos[0].videoId });
    }
    
    return NextResponse.json({ videoId: null });
  } catch (error) {
    console.error("YouTube Search Error:", error);
    return NextResponse.json({ videoId: null }, { status: 500 });
  }
}
