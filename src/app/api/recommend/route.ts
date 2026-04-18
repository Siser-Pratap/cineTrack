import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      return NextResponse.json({ error: 'Please set your GEMINI_API_KEY in the .env file.' }, { status: 400 });
    }

    const body = await req.json();
    const { prompt, userMovies } = body;

    // Use the latest Gemini 3.1 Pro Preview model as requested
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-pro-preview',
    });

    let context = '';
    if (userMovies && userMovies.length > 0) {
      const watched = userMovies.filter((m: any) => m.status === 'Watched').map((m: any) => m.title).join(', ');
      const toWatch = userMovies.filter((m: any) => m.status === 'ToWatch').map((m: any) => m.title).join(', ');
      context = `\n\nHere is the user's movie history for context to improve recommendations. 
      Watched: ${watched || 'None'}. 
      To Watch: ${toWatch || 'None'}. 
      Try to suggest movies they might like based on this, but do NOT suggest movies they already have in these lists.`;
    }

    const systemPrompt = `You are CineTrack's intelligent movie recommendation engine. The user will ask for recommendations or you will receive their watch history.
    Respond ONLY with a JSON array of movie objects. Do not include any markdown formatting outside the JSON array.
    Each object MUST have these exact keys:
    - "title" (string)
    - "description" (string, a short engaging summary)
    - "genre" (string, comma-separated genres)
    - "language" (string)
    - "releaseYear" (number)
    
    If the user asks for trending movies, provide 5 current popular movies. Make sure the response is a valid JSON array.`;

    const finalPrompt = `${systemPrompt}\n\nUser request: ${prompt || "Recommend some great movies for me."}${context}`;

    const result = await model.generateContent(finalPrompt);
    let text = result.response.text();

    // Clean up potential markdown formatting from gemini
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const movies = JSON.parse(text);

    // Enhance movies with OMDB data (Posters & IMDB Links)
    const omdbApiKey = process.env.OMDB_API_KEY;
    if (omdbApiKey && omdbApiKey !== 'YOUR_OMDB_API_KEY_HERE') {
      const enhancedMovies = await Promise.all(movies.map(async (movie: any) => {
        try {
          const res = await fetch(`http://www.omdbapi.com/?apikey=${omdbApiKey}&t=${encodeURIComponent(movie.title)}&y=${movie.releaseYear || ''}`);
          const data = await res.json();
          if (data.Response === "True") {
            return {
              ...movie,
              posterUrl: data.Poster !== "N/A" ? data.Poster : null,
              imdbLink: `https://www.imdb.com/title/${data.imdbID}/`
            };
          }
        } catch (e) {
          console.error("OMDB fetch failed for", movie.title);
        }
        return movie;
      }));
      return NextResponse.json(enhancedMovies);
    }

    return NextResponse.json(movies);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: 'Failed to generate recommendations. Ensure your API key is valid.' }, { status: 500 });
  }
}