import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { CheckCircle, ExternalLink, Film, Edit } from "lucide-react";
import { useState } from "react";
import { EditMovieDialog } from "./EditMovieDialog";

export function MovieCard({ movie, onWatched, onUpdate }: { movie: any, onWatched?: (id: string) => void, onUpdate?: () => void }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const hasImage = movie.posterUrl && movie.posterUrl !== 'N/A' && !movie.posterUrl.includes('placeholder.com');

  return (
    <>
      <Card className="overflow-hidden group border-slate-200 dark:border-slate-800 transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="aspect-[2/3] relative bg-slate-100 dark:bg-slate-800">
          {hasImage ? (
            <img 
              src={movie.posterUrl} 
              alt={movie.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-blue-900/40 backdrop-blur-md border border-blue-400/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] text-blue-200 p-4 text-center">
              <Film className="w-10 h-10 mb-2 opacity-50 text-blue-300" />
              <span className="font-semibold text-sm text-blue-100 line-clamp-3">{movie.title}</span>
            </div>
          )}
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 gap-3">
            {movie.status === 'ToWatch' && onWatched && (
              <Button 
                className="w-full" 
                variant="default"
                onClick={() => onWatched(movie.id)}
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Mark Watched
              </Button>
            )}
            {movie.imdbLink && (
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black border-none" variant="outline" asChild>
                <a href={movie.imdbLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" /> View IMDB
                </a>
              </Button>
            )}
            {onUpdate && (
              <Button 
                className="w-full bg-transparent text-white border-white hover:bg-white hover:text-black" 
                variant="outline"
                onClick={() => setIsEditOpen(true)}
              >
                <Edit className="w-4 h-4 mr-2" /> Edit Details
              </Button>
            )}
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
        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg line-clamp-1" title={movie.title}>{movie.title}</h3>
          <div className="flex flex-wrap items-center text-xs text-slate-500 dark:text-slate-400 mt-1 gap-x-2 gap-y-1 mb-2">
            <span>{movie.releaseYear}</span>
            {movie.genre && movie.genre !== "Various" && (
              <>
                <span>•</span>
                <span className="line-clamp-1 text-indigo-500 font-medium" title={movie.genre}>{movie.genre}</span>
              </>
            )}
          </div>
          {movie.description && movie.description !== "Click Add to Watchlist to save this movie." && (
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 mb-2">
              {movie.description}
            </p>
          )}
          {movie.rating && movie.status === 'Watched' && (
             <div className="mt-auto flex items-center gap-1 text-yellow-500 pt-2">
               {'★'.repeat(movie.rating)}{'☆'.repeat(5 - movie.rating)}
             </div>
          )}
        </CardContent>
      </Card>
      
      {isEditOpen && onUpdate && (
        <EditMovieDialog 
          movie={movie} 
          isOpen={isEditOpen} 
          setIsOpen={setIsEditOpen} 
          onUpdate={onUpdate} 
        />
      )}
    </>
  );
}