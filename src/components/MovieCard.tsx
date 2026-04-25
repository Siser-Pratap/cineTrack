import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { CheckCircle, ExternalLink, Film, Info, Trash2, Loader2 } from "lucide-react";
import Link from 'next/link';
import { useState } from "react";

export function MovieCard({ movie, onWatched, onUpdate }: { movie: any, onWatched?: (id: string) => void, onUpdate?: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const hasImage = movie.posterUrl && movie.posterUrl !== 'N/A' && !movie.posterUrl.includes('placeholder.com');

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to remove this title?")) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/movies/${movie.id}`, { method: 'DELETE' });
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden group border-slate-200 dark:border-slate-800 transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col h-full">
        <div className="aspect-[2/3] relative bg-slate-100 dark:bg-slate-800">
          {hasImage ? (
            <img 
              src={movie.posterUrl} 
              alt={movie.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 p-4 text-center">
              <Film className="w-10 h-10 mb-2 opacity-30 text-slate-500 dark:text-slate-400" />
              <span className="font-semibold text-sm text-slate-700 dark:text-slate-300 line-clamp-3">{movie.title}</span>
            </div>
          )}
          
          {/* Hover overlay - Desktop Only */}
          <div className="hidden md:flex absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex-col items-center justify-center p-4 gap-2 z-10">
            <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white border-none" variant="outline" asChild>
              <Link href={`/dashboard/movie/${movie.id}`} className="flex p-2 gap-2">
                <Info className="w-4 h-4" /> View Details
              </Link>
            </Button>
            
            {movie.status === 'ToWatch' && onWatched && (
              <Button 
                className="w-full" 
                variant="default"
                onClick={() => onWatched(movie.id)}
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Mark Watched
              </Button>
            )}
            
            <Button 
              className="w-full bg-red-500/90 hover:bg-red-600 text-white border-none" 
              variant="outline"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Remove
            </Button>
          </div>
          
          <div className="absolute top-2 right-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium shadow-sm backdrop-blur-md
              ${movie.priority === 'High' ? 'bg-red-500/90 text-white' : 
                movie.priority === 'Medium' ? 'bg-yellow-500/90 text-white' : 
                'bg-blue-500/90 text-white'}`}>
              {movie.priority}
            </span>
          </div>
        </div>
        <CardContent className="p-4 flex-1 flex flex-col min-w-0">
          <Link href={`/dashboard/movie/${movie.id}`} passHref>
            <h3 className="font-semibold text-lg line-clamp-1 hover:underline cursor-pointer mb-1.5 text-slate-900 dark:text-slate-100" title={movie.title}>{movie.title}</h3>
          </Link>
          <div className="flex flex-wrap items-center text-xs text-slate-500 dark:text-slate-400 mt-1 gap-x-2 gap-y-1 mb-2">
            {movie.type && (
              <span className="shrink-0 uppercase text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                {movie.type}
              </span>
            )}
            <span className="shrink-0">{movie.releaseYear}</span>
            {movie.genre && movie.genre !== "Various" && (
              <>
                <span className="shrink-0">•</span>
                <span className="line-clamp-1 text-indigo-500 font-medium break-all" title={movie.genre}>{movie.genre}</span>
              </>
            )}
          </div>
          {movie.description && movie.description !== "Click Add to Watchlist to save this title." && movie.description !== "Click Add to Watchlist to save this movie." && (
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1.5 mb-3">
              {movie.description}
            </p>
          )}
          {movie.rating && movie.status === 'Watched' && (
             <div className="mt-auto flex items-center gap-1 text-yellow-500 pt-2 mb-2">
               {'★'.repeat(movie.rating)}{'☆'.repeat(5 - movie.rating)}
             </div>
          )}
          
          {/* Mobile Actions */}
          <div className="mt-auto pt-4 flex flex-col gap-2 md:hidden">
            <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white border-none" size="sm" asChild>
              <Link href={`/dashboard/movie/${movie.id}`} className="flex p-2 gap-2">
                <Info className="w-4 h-4" /> View Details
              </Link>
            </Button>
            
            {movie.status === 'ToWatch' && onWatched && (
              <Button 
                className="w-full" 
                size="sm"
                variant="default"
                onClick={() => onWatched(movie.id)}
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Mark Watched
              </Button>
            )}
            
            <Button 
              className="w-full" 
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Remove
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}