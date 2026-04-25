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
      model: 'gemini-2.5-flash',
    });

    let context = '';
    if (userMovies && userMovies.length > 0) {
      const watched = userMovies.filter((m: any) => m.status === 'Watched').map((m: any) => m.title).join(', ');
      const toWatch = userMovies.filter((m: any) => m.status === 'ToWatch').map((m: any) => m.title).join(', ');
      context = `\n\nHere is the user's watch history for context to improve recommendations. 
      Watched: ${watched || 'None'}. 
      To Watch: ${toWatch || 'None'}. 
      Try to suggest titles they might like based on this, but do NOT suggest titles they already have in these lists.`;
    }

    const systemPrompt = `You are CineTrack's intelligent media recommendation engine. The user will ask for recommendations, ask questions about movies, TV series, shows, or web series, or you will receive their watch history.
    Respond ONLY with a valid JSON object. Do not include any markdown formatting outside the JSON object.
    The JSON object MUST have these exact keys:
    - "reply" (string, a conversational, friendly, and helpful response answering the user's query or explaining the recommendations)
    - "movies" (array of objects, the media recommendations (movies, series, shows). If no titles are relevant to the query, return an empty array [])
    
    Each media object in the "movies" array MUST have these exact keys:
    - "title" (string)
    - "description" (string, a short engaging summary)
    - "genre" (string, comma-separated genres)
    - "language" (string)
    - "releaseYear" (number)
    - "type" (string, either "movie", "series", "episode", or "show")
    
    Make sure the response is a strictly valid JSON object.`;

    const finalPrompt = `${systemPrompt}\n\nUser request: ${prompt || "Recommend some great titles for me."}${context}`;

    const result = await model.generateContent(finalPrompt);
    let text = result.response.text();

    // Clean up potential markdown formatting from gemini
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const responseJson = JSON.parse(text);
    const reply = responseJson.reply || "";
    const movies = responseJson.movies || [];

    // Enhance movies with OMDB data (Posters & IMDB Links)
    const omdbApiKey = process.env.OMDB_API_KEY;
    if (omdbApiKey && omdbApiKey !== 'YOUR_OMDB_API_KEY_HERE') {
      const enhancedMovies = await Promise.all(movies.map(async (movie: any) => {
        try {
          const typeParam = movie.type && movie.type !== 'show' ? `&type=${movie.type}` : '';
          const res = await fetch(`http://www.omdbapi.com/?apikey=${omdbApiKey}&t=${encodeURIComponent(movie.title)}&y=${movie.releaseYear || ''}${typeParam}`);
          const data = await res.json();
          if (data.Response === "True") {
            return {
              ...movie,
              posterUrl: data.Poster !== "N/A" ? data.Poster : null,
              imdbLink: `https://www.imdb.com/title/${data.imdbID}/`,
              type: data.Type || movie.type || 'movie'
            };
          }
        } catch (e) {
          console.error("OMDB fetch failed for", movie.title);
        }
        return movie;
      }));
      return NextResponse.json({ reply, results: enhancedMovies });
    }

    return NextResponse.json({ reply, results: movies });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: 'Failed to generate recommendations. Ensure your API key is valid.' }, { status: 500 });
  }
}