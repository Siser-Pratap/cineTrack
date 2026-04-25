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
      console.log("Using YouTube API Key...");
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q + ' official trailer')}&type=video&key=${apiKey}&maxResults=1`,
        { cache: 'no-store' }
      );
      const data = await res.json();
      
      console.log("YouTube API Response status:", res.status);
      if (data.error) {
         console.error("YouTube API Error:", data.error);
      }
      
      if (data.items && data.items.length > 0) {
        return NextResponse.json({ videoId: data.items[0].id.videoId });
      } else if (data.error) {
        // Return the error so we can see it in the Network tab
        return NextResponse.json({ error: "YouTube API Error", details: data.error }, { status: 500 });
      }
    } else {
      console.log("No YouTube API Key found, falling back to yt-search");
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
