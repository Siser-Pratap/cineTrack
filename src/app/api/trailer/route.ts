import { NextResponse } from 'next/server';
import ytSearch from 'yt-search';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  
  if (!q) return NextResponse.json({ videoId: null });

  try {
    // 1. If an official YouTube API key is provided, use it (Reliable in production)
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (apiKey) {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q + ' official trailer')}&type=video&key=${apiKey}&maxResults=1`
      );
      const data = await res.json();
      
      if (data.items && data.items.length > 0) {
        return NextResponse.json({ videoId: data.items[0].id.videoId });
      }
    }

    // 2. Fallback to yt-search (Works locally, but often gets blocked in production)
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
