"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, PlayCircle } from "lucide-react";
import { TrailerDialog } from "./TrailerDialog";

export function AddMovieDialog({ onAdd }: { onAdd: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [trailerMovie, setTrailerMovie] = useState<any | null>(null);

  const fetchMovies = async (searchQuery: string, pageNum: number, append: boolean = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&page=${pageNum}`);
      if (res.ok) {
        const data = await res.json();
        setResults(prev => append ? [...prev, ...data.results] : data.results);
        setTotalResults(data.totalResults);
      } else {
        if (!append) setResults([]);
      }
    } catch (e) {
      console.error(e);
      if (!append) setResults([]);
    }
    setLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setPage(1);
    await fetchMovies(query, 1, false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    
    // Auto-search after 500ms when typing (debounce)
    if (val.length > 2) {
      if ((window as any).searchTimeout) {
        clearTimeout((window as any).searchTimeout);
      }
      (window as any).searchTimeout = setTimeout(() => {
        setPage(1);
        fetchMovies(val, 1, false);
      }, 500);
    }
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchMovies(query, nextPage, true);
  };

  const handleAdd = async (movie: any) => {
    try {
      const res = await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...movie,
          priority: 'Medium'
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || "Failed to add title.");
        return;
      }
      
      setIsOpen(false);
      onAdd();
    } catch (e) {
      console.error(e);
      alert("Something went wrong adding this title.");
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="w-4 h-4 mr-2" /> Add Title
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white dark:bg-slate-900 border-none shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Add to Watchlist</h2>
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200" onClick={() => setIsOpen(false)}>✕</Button>
          </div>
          
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <Input 
              placeholder="Search movies, series..." 
              value={query}
              onChange={handleInputChange}
              autoFocus
            />
            <Button type="submit" disabled={loading}>
              <Search className="w-4 h-4" />
            </Button>
          </form>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {results.map((movie, i) => (
              <div key={i} className="flex gap-3 sm:gap-4 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div className="flex-shrink-0">
                  {movie.posterUrl && movie.posterUrl !== 'N/A' ? (
                    <img src={movie.posterUrl} alt={movie.title} className="w-16 h-24 sm:w-20 sm:h-32 object-cover rounded-md" />
                  ) : (
                    <div className="w-16 h-24 sm:w-20 sm:h-32 bg-slate-200 dark:bg-slate-800 rounded-md flex items-center justify-center text-center p-1">
                      <span className="text-[10px] sm:text-xs text-slate-400">No Image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col py-1">
                  <div className="flex items-start gap-2 mb-1">
                    <h3 className="font-semibold text-sm sm:text-base line-clamp-1 sm:line-clamp-2 text-slate-900 dark:text-slate-100" title={`${movie.title} (${movie.releaseYear})`}>{movie.title} <span className="text-slate-500 dark:text-slate-400 shrink-0">({movie.releaseYear})</span></h3>
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    {movie.type && (
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded shrink-0">
                        {movie.type}
                      </span>
                    )}
                    {movie.genre && movie.genre !== "Various" && (
                      <p className="text-xs sm:text-sm font-medium text-indigo-500 dark:text-indigo-400 line-clamp-1">{movie.genre}</p>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 sm:line-clamp-3 mb-2 flex-1">{movie.description}</p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-3">
                    <Button size="sm" className="h-9 text-xs sm:text-sm px-3 sm:px-4 shrink-0" onClick={() => handleAdd(movie)}>
                      <span className="truncate">Add to List</span>
                    </Button>
                    <Button size="sm" variant="outline" className="h-9 text-xs sm:text-sm px-3 sm:px-4 shrink-0 text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-900/50 dark:text-indigo-400 dark:hover:bg-indigo-950/50" onClick={() => setTrailerMovie(movie)}>
                      <PlayCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 shrink-0" /> <span className="truncate">Trailer</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {loading && <p className="text-center text-slate-500 dark:text-slate-400 py-4">Searching...</p>}
            
            {!loading && results.length > 0 && results.length < totalResults && (
              <div className="flex justify-center pt-4 pb-2 border-t border-slate-100 dark:border-slate-800 mt-4">
                <Button variant="outline" className="text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={handleLoadMore}>
                  Load More Results
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
      
      {trailerMovie && (
        <TrailerDialog 
          movie={trailerMovie} 
          isOpen={!!trailerMovie} 
          setIsOpen={(open) => !open && setTrailerMovie(null)} 
        />
      )}
    </div>
  );
}