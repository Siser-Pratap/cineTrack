import { NextResponse } from 'next/server';
const JustWatch = require('justwatch-api-client').default;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  
  if (!q) return NextResponse.json({ streams: [] });

  try {
    const jw = new JustWatch();
    // Search for the title
    const results = await jw.search(q);
    
    if (results && results.length > 0) {
      const bestMatch = results[0];
      // Get detailed data including streams
      const data = await jw.getDataByPath(bestMatch.fullPath);
      
      if (data && data.Streams && data.Streams.length > 0) {
        // Filter out duplicate providers to show unique badges
        const uniqueProviders = new Map();
        
        data.Streams.forEach((stream: any) => {
          if (!uniqueProviders.has(stream.Provider)) {
            uniqueProviders.set(stream.Provider, {
              name: stream.Name,
              icon: stream.Icon,
              link: stream.Link,
              type: stream.Type, // FLATRATE (subscription), BUY, RENT
            });
          } else {
            // Prefer FLATRATE over rent/buy if multiple options exist for the same provider
            if (stream.Type === 'FLATRATE' && uniqueProviders.get(stream.Provider).type !== 'FLATRATE') {
              uniqueProviders.set(stream.Provider, {
                name: stream.Name,
                icon: stream.Icon,
                link: stream.Link,
                type: stream.Type,
              });
            }
          }
        });
        
        return NextResponse.json({ 
          streams: Array.from(uniqueProviders.values()) 
        });
      }
    }
    
    return NextResponse.json({ streams: [] });
  } catch (error) {
    console.error("JustWatch Search Error:", error);
    return NextResponse.json({ streams: [] }, { status: 500 });
  }
}
