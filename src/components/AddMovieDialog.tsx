"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";

export function AddMovieDialog({ onAdd }: { onAdd: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

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
        alert(data.error || "Failed to add movie.");
        return;
      }
      
      setIsOpen(false);
      onAdd();
    } catch (e) {
      console.error(e);
      alert("Something went wrong adding this movie.");
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="w-4 h-4 mr-2" /> Add Movie
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white dark:bg-slate-900 border-none shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Add to Watchlist</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>✕</Button>
          </div>
          
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <Input 
              placeholder="Search movie title..." 
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
              <div key={i} className="flex gap-4 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                {movie.posterUrl && movie.posterUrl !== 'N/A' ? (
                  <img src={movie.posterUrl} alt={movie.title} className="w-16 h-24 object-cover rounded-md" />
                ) : (
                  <div className="w-16 h-24 bg-slate-200 dark:bg-slate-800 rounded-md flex items-center justify-center">
                    <span className="text-xs text-slate-400">No Image</span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{movie.title} ({movie.releaseYear})</h3>
                  {movie.genre !== "Various" && (
                    <p className="text-xs font-medium text-indigo-500 dark:text-indigo-400 mt-1">{movie.genre}</p>
                  )}
                  <p className="text-sm text-slate-500 line-clamp-2 mt-1">{movie.description}</p>
                  <Button size="sm" className="mt-2" onClick={() => handleAdd(movie)}>
                    Add to List
                  </Button>
                </div>
              </div>
            ))}
            {loading && <p className="text-center text-slate-500 py-4">Searching...</p>}
            
            {!loading && results.length > 0 && results.length < totalResults && (
              <div className="flex justify-center pt-4 pb-2 border-t border-slate-100 dark:border-slate-800 mt-4">
                <Button variant="outline" onClick={handleLoadMore}>
                  Load More Results
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}