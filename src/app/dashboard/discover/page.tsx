"use client";

import { useState } from "react";
import { Sparkles, TrendingUp, Compass, Search, Plus, CheckCircle, Loader2, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DiscoverPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async (customPrompt?: string, useHistory: boolean = false, append: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      let userMovies = [];
      if (useHistory) {
        // Fetch user history to pass to Gemini for personalized context
        const res = await fetch('/api/movies');
        if (res.ok) {
          const text = await res.text();
          userMovies = text ? JSON.parse(text) : [];
        }
      }

      // If we are appending, we need to tell Gemini what it already recommended so it doesn't repeat
      const existingTitles = append ? results.map(r => r.title).join(', ') : "";
      const avoidanceContext = append && existingTitles ? `\n\nIMPORTANT: Do NOT recommend any of these movies, as you already just suggested them: ${existingTitles}` : "";

      const finalPromptToUse = (customPrompt || prompt) + avoidanceContext;

      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: finalPromptToUse,
          userMovies: useHistory ? userMovies : []
        })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Failed to fetch recommendations");
      
      if (append) {
        setResults(prev => [...prev, ...data]);
      } else {
        setResults(data);
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleAddMovie = async (movie: any) => {
    setAddingId(movie.title);
    try {
      await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: movie.title,
          description: movie.description,
          genre: movie.genre,
          language: movie.language,
          releaseYear: movie.releaseYear,
          posterUrl: movie.posterUrl,
          imdbLink: movie.imdbLink,
          priority: 'Medium',
          status: 'ToWatch'
        })
      });
      // Mark as added in UI locally
      setResults(results.map(r => r.title === movie.title ? { ...r, added: true } : r));
    } catch (e) {
      console.error(e);
    }
    setAddingId(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Discover</h1>
        <p className="text-slate-500 dark:text-slate-400">Powered by Gemini AI. Ask for anything or get personalized recommendations.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-slate-900 border-indigo-100 dark:border-indigo-900/50">
          <CardHeader>
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <CardTitle>For You</CardTitle>
            <CardDescription>Smart suggestions based on your To Watch and Watched movies list.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              variant="secondary"
              onClick={() => fetchRecommendations("Give me 5 highly-rated recommendations based on my taste.", true)}
              disabled={loading}
            >
              Analyze My Taste
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/30 dark:to-slate-900 border-rose-100 dark:border-rose-900/50">
          <CardHeader>
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <CardTitle>Trending Now</CardTitle>
            <CardDescription>See what's popular in theaters and on streaming platforms right now.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              variant="secondary"
              onClick={() => fetchRecommendations("What are the top 5 trending movies right now? Give me a mix of genres.")}
              disabled={loading}
            >
              View Trending
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-white dark:from-teal-950/30 dark:to-slate-900 border-teal-100 dark:border-teal-900/50">
          <CardHeader>
            <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <CardTitle>Surprise Me</CardTitle>
            <CardDescription>Dive deep into specific categories to find hidden gems and classics.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              variant="secondary"
              onClick={() => fetchRecommendations("Suggest 5 absolute hidden gem movies that most people haven't seen but are masterpieces.")}
              disabled={loading}
            >
              Find Hidden Gems
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mt-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-indigo-500" /> Ask Gemini
        </h2>
        <form 
          className="flex gap-3"
          onSubmit={(e) => { e.preventDefault(); if(prompt) fetchRecommendations(); }}
        >
          <Input 
            placeholder="e.g. 'Sci-fi movies with mind-bending plots like Interstellar' or 'Best 90s action movies'" 
            className="text-base py-6"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button type="submit" size="lg" disabled={loading || !prompt} className="h-auto">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
          </Button>
        </form>
        {error && <p className="text-red-500 mt-4 text-sm font-medium">{error}</p>}
      </div>

      {loading && results.length === 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl aspect-[2/3]" />
          ))}
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-6 flex justify-between items-center">
            <span>AI Recommendations</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {results.map((movie, idx) => (
              <Card key={idx} className="overflow-hidden flex flex-col group border-slate-200 dark:border-slate-800 transition-all hover:shadow-lg">
                <div className="aspect-[2/3] relative bg-slate-100 dark:bg-slate-800">
                  {movie.posterUrl && movie.posterUrl !== 'N/A' && !movie.posterUrl.includes('placeholder.com') ? (
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-blue-900/40 backdrop-blur-md border border-blue-400/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] text-blue-200 p-4 text-center">
                      <span className="font-semibold text-sm text-blue-100 line-clamp-3">{movie.title}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                    {movie.added ? (
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white" disabled>
                        <CheckCircle className="w-4 h-4 mr-2" /> Added
                      </Button>
                    ) : (
                      <Button 
                        className="w-full" 
                        variant="default"
                        onClick={() => handleAddMovie(movie)}
                        disabled={addingId === movie.title}
                      >
                        {addingId === movie.title ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />} 
                        Add to Watchlist
                      </Button>
                    )}
                  </div>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-base line-clamp-1 mb-1" title={movie.title}>{movie.title}</h3>
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-2 gap-2">
                    <span>{movie.releaseYear}</span>
                    <span>•</span>
                    <span className="line-clamp-1">{movie.genre}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
                    {movie.description}
                  </p>
                  
                  <div className="mt-auto">
                    {movie.imdbLink && (
                      <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                        <a href={movie.imdbLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 mr-2" /> View on IMDB
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Show appending skeletons while loading more */}
            {loading && (
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={`skeleton-${i}`} className="animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl aspect-[2/3] w-full" />
                ))}
              </>
            )}
          </div>
          
          {!loading && (
            <div className="mt-12 flex justify-center pb-12">
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 rounded-full shadow-sm hover:shadow-md transition-shadow"
                onClick={() => fetchRecommendations(prompt || "Give me 5 more movies like the ones you just suggested.", false, true)}
                disabled={loading}
              >
                <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
                Load More Recommendations
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}