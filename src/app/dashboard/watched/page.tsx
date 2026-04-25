"use client";

import { useEffect, useState, useMemo } from "react";
import { MovieCard } from "@/components/MovieCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function WatchedPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, genreFilter, yearFilter]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/movies');
      if (!res.ok) throw new Error("Failed to fetch movies");
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      setMovies(Array.isArray(data) ? data.filter((m: any) => m.status === 'Watched') : []);
    } catch (e) {
      console.error("Error fetching movies:", e);
      setMovies([]);
    }
    setLoading(false);
  };

  // Safe initial fetch hook
  useEffect(() => {
    fetchMovies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const PRESET_GENRES = ["All", "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller", "Various"];
  
  const filteredMovies = useMemo(() => {
    return movies.filter(m => {
      const matchesSearch = m.title.toLowerCase().includes(debouncedQuery.toLowerCase());
      const matchesGenre = genreFilter === "All" || (m.genre && m.genre.toLowerCase().includes(genreFilter.toLowerCase()));
      const matchesYear = yearFilter === "" || (m.releaseYear && m.releaseYear.toString() === yearFilter);
      return matchesSearch && matchesGenre && matchesYear;
    });
  }, [movies, debouncedQuery, genreFilter, yearFilter]);

  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const currentMovies = filteredMovies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Watched Titles</h1>
        <p className="text-slate-500 dark:text-slate-400">Your personal media diary. Rate and review the titles you've seen.</p>
      </div>

      {!loading && movies.length > 0 && (
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <Input 
            placeholder="Search titles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <select 
            className="flex h-9 rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            {PRESET_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <Input
            type="number"
            placeholder="Year (e.g. 2023)"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-32"
          />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl aspect-[2/3]" />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <h3 className="text-xl font-medium text-slate-500 mb-4">You haven't marked any titles as watched yet</h3>
          <p className="text-slate-400 mb-6">Go to your To Watch list to start tracking.</p>
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-slate-500">No titles match your search/filter.</p>
        </div>
      ) : (
        <div className="space-y-8 pb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {currentMovies.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onUpdate={fetchMovies}
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4">
              <Button 
                variant="outline" 
                disabled={currentPage === 1} 
                onClick={() => {
                  setCurrentPage(p => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Previous
              </Button>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                disabled={currentPage === totalPages} 
                onClick={() => {
                  setCurrentPage(p => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}