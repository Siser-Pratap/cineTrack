import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const page = searchParams.get('page') || '1';
  
  if (!q) return NextResponse.json({ results: [], totalResults: 0 });

  try {
    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey || apiKey === 'YOUR_OMDB_API_KEY_HERE') {
      return NextResponse.json({ error: 'OMDB API Key is missing.' }, { status: 500 });
    }

    const res = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(q)}&type=movie&page=${page}`);
    const data = await res.json();
    
    if (data.Response === "True") {
      // To get genres and full descriptions, we need to fetch the detailed view for each movie ID
      // since the default OMDB 'search' list endpoint omits Plot and Genre
      const detailedMovies = await Promise.all(data.Search.map(async (m: any) => {
        try {
          const detailRes = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${m.imdbID}&plot=short`);
          const detailData = await detailRes.json();
          
          if (detailData.Response === "True") {
            return {
              id: detailData.imdbID,
              title: detailData.Title,
              releaseYear: parseInt(detailData.Year) || null,
              posterUrl: detailData.Poster !== "N/A" ? detailData.Poster : null,
              imdbLink: `https://www.imdb.com/title/${detailData.imdbID}/`,
              description: detailData.Plot !== "N/A" ? detailData.Plot : "Click Add to Watchlist to save this movie.", 
              genre: detailData.Genre !== "N/A" ? detailData.Genre : "Various", 
              language: detailData.Language !== "N/A" ? detailData.Language : "Various",
              runtime: detailData.Runtime
            };
          }
        } catch (e) {
          console.error("Failed to fetch details for", m.imdbID);
        }
        
        // Fallback if detail fetch fails
        return {
          id: m.imdbID,
          title: m.Title,
          releaseYear: parseInt(m.Year) || null,
          posterUrl: m.Poster !== "N/A" ? m.Poster : null,
          imdbLink: `https://www.imdb.com/title/${m.imdbID}/`,
          description: "Click Add to Watchlist to save this movie.", 
          genre: "Various", 
          language: "Various"
        };
      }));
      
      return NextResponse.json({ results: detailedMovies, totalResults: parseInt(data.totalResults) || 0 });
    }
    return NextResponse.json({ results: [], totalResults: 0 });
  } catch (error) {
    console.error("OMDB Search Error:", error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}