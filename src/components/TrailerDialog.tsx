"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TrailerDialog({ movie, isOpen, setIsOpen }: { movie: any, isOpen: boolean, setIsOpen: (b: boolean) => void }) {
  if (!isOpen) return null;

  const searchQuery = encodeURIComponent(`${movie.title} ${movie.releaseYear || ""} official trailer`);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6" onClick={() => setIsOpen(false)}>
      <Card 
        className="w-full max-w-5xl bg-black border-slate-800 shadow-2xl p-0 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()} // Prevent clicking inside modal from closing it
      >
        <div className="flex justify-between items-center p-4 bg-slate-900 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white line-clamp-1">{movie.title} - Trailer</h2>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800" onClick={() => setIsOpen(false)}>✕</Button>
        </div>
        <div className="relative w-full aspect-video bg-black">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed?listType=search&list=${searchQuery}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </Card>
    </div>
  );
}