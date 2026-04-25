"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function TrailerDialog({ movie, isOpen, setIsOpen }: { movie: any, isOpen: boolean, setIsOpen: (b: boolean) => void }) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen && movie) {
      setLoading(true);
      setError(false);
      setVideoId(null);
      
      const query = encodeURIComponent(`${movie.title} ${movie.releaseYear || ""}`);
      
      fetch(`/api/trailer?q=${query}`)
        .then(res => res.json())
        .then(data => {
          if (data.videoId) {
            setVideoId(data.videoId);
          } else {
            setError(true);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError(true);
          setLoading(false);
        });
    }
  }, [isOpen, movie]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6" onClick={() => setIsOpen(false)}>
      <Card 
        className="w-full max-w-5xl bg-black border-slate-800 shadow-2xl p-0 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()} // Prevent clicking inside modal from closing it
      >
        <div className="flex justify-between items-center p-4 bg-slate-900 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white line-clamp-1">{movie.title} - Trailer</h2>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800 shrink-0" onClick={() => setIsOpen(false)}>✕</Button>
        </div>
        <div className="relative w-full aspect-video min-h-[200px] bg-black flex items-center justify-center">
          {loading && (
            <div className="flex flex-col items-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p>Finding trailer...</p>
            </div>
          )}
          
          {error && !loading && (
            <div className="flex flex-col items-center text-slate-400">
              <p className="mb-4">Could not find a trailer for this title.</p>
              <Button variant="outline" onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' trailer')}`, '_blank')}>
                Search on YouTube manually
              </Button>
            </div>
          )}
          
          {videoId && !loading && (
            <div className="w-full h-full">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
        {videoId && !loading && (
          <div className="bg-slate-900 p-3 border-t border-slate-800 flex justify-between items-center flex-wrap gap-2 text-sm">
            <span className="text-slate-400">Video not playing? Mobile browsers may block some trailers.</span>
            <Button variant="secondary" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white border-none" asChild>
              <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer">
                Open in YouTube App
              </a>
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}