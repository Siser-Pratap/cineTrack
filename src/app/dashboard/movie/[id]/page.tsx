import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Film, Calendar, Languages, ArrowLeft, ExternalLink, Search, Tv } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { EditMovieButton } from '@/components/EditMovieButton';
import { StreamingProviders } from '@/components/StreamingProviders';

async function getMovie(id: string) {
  try {
    const movie = await prisma.movie.findUnique({
      where: { id },
    });
    return movie;
  } catch (error) {
    console.error("Failed to fetch movie (invalid ID format likely):", error);
    return null;
  }
}

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  const movie = await getMovie(resolvedParams.id);

  if (!movie) {
    notFound();
  }

  const hasImage = movie.posterUrl && movie.posterUrl !== 'N/A' && !movie.posterUrl.includes('placeholder.com');

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <Button variant="outline" asChild>
          <Link  className="flex gap-2 p-2" href={movie.status === 'Watched' ? '/dashboard/watched' : '/dashboard'}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {movie.status === 'Watched' ? 'Watched List' : 'Watch List'}
          </Link>
        </Button>
        <EditMovieButton movie={movie} />
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-8 items-start">
        <div className="md:col-span-1">
          {hasImage ? (
            <img src={movie.posterUrl!} alt={movie.title} className="w-full h-auto object-cover rounded-xl shadow-2xl" />
          ) : (
             <div className="w-full aspect-[2/3] flex flex-col items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 text-center">
              <Film className="w-10 h-10 mb-2 opacity-30 text-slate-500 dark:text-slate-400" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">{movie.title}</span>
            </div>
          )}
        </div>
        <div className="md:col-span-1 space-y-6">
          <div>
             <span className={`text-xs px-2 py-1 rounded-full font-medium shadow-sm mb-4 inline-block
              ${movie.status === 'Watched' ? 'bg-green-500/20 text-green-700 dark:text-green-300' :
                movie.priority === 'High' ? 'bg-red-500/20 text-red-700 dark:text-red-300' : 
                movie.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300' : 
                'bg-blue-500/20 text-blue-700 dark:text-blue-300'}`}>
              Status: {movie.status === 'Watched' ? 'Watched' : movie.priority}
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">{movie.title}</h1>
            <div className="flex flex-wrap items-center text-slate-500 dark:text-slate-400 gap-x-4 gap-y-1">
              <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {movie.releaseYear || 'N/A'}</div>
              <div className="flex items-center gap-1.5"><Languages className="w-4 h-4" /> {movie.language || 'N/A'}</div>
            </div>
          </div>
          
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {movie.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {movie.genre?.split(',').map(g => (
              <span key={g.trim()} className="text-xs px-3 py-1.5 rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">{g.trim()}</span>
            ))}
          </div>

          {movie.status === 'Watched' && (
            <Card className="bg-slate-50 dark:bg-slate-900/50">
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-lg">Your Review</h3>
                {movie.rating ? (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Rating:</span>
                    <div className="flex items-center text-2xl text-yellow-400">
                      {'★'.repeat(movie.rating)}{'☆'.repeat(5 - movie.rating)}
                    </div>
                  </div>
                ) : <p className="text-sm text-slate-500">No rating given.</p>}
                {movie.watchedAt && (
                   <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Watched On:</span>
                    <span>{format(new Date(movie.watchedAt), 'MMMM d, yyyy')}</span>
                  </div>
                )}
                {movie.review ? (
                  <blockquote className="border-l-4 border-slate-300 dark:border-slate-700 pl-4 italic text-slate-600 dark:text-slate-400">
                    {movie.review}
                  </blockquote>
                ) : <p className="text-sm text-slate-500">No review written.</p>}
              </CardContent>
            </Card>
          )}

          {movie.status === 'ToWatch' && (
            <StreamingProviders title={movie.title} releaseYear={movie.releaseYear || undefined} type={movie.type} />
          )}

          <div className="flex flex-wrap gap-3 pt-6 p-12 border-t border-slate-200 dark:border-slate-800 mt-6">
            {movie.imdbLink && (
              <>
                <Button variant="outline" asChild className="p-4">
                  <a className="flex p-2" href={movie.imdbLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" /> View IMDB Page
                  </a>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
