"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tv, Loader2, ExternalLink } from "lucide-react";

export function StreamingProviders({ title, releaseYear, type }: { title: string, releaseYear?: number, type?: string }) {
  const [streams, setStreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/streams?q=${encodeURIComponent(title + (releaseYear ? ` ${releaseYear}` : ''))}`)
      .then(res => res.json())
      .then(data => {
        setStreams(data.streams || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [title, releaseYear]);

  if (loading) {
    return (
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 mt-6">
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Tv className="w-5 h-5 text-indigo-500" />
          Where to Watch
        </h3>
        <div className="flex items-center text-sm text-slate-500">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Fetching streaming options...
        </div>
      </div>
    );
  }

  if (streams.length === 0) {
    return (
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 mt-6">
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Tv className="w-5 h-5 text-indigo-500" />
          Where to Watch
        </h3>
        <p className="text-sm text-slate-500">No known streaming providers found for your region.</p>
        <Button variant="outline" size="sm" className="mt-3" asChild>
           <a href={`https://www.justwatch.com/us/search?q=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
             Search JustWatch Manually <ExternalLink className="w-3 h-3 ml-2" />
           </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-6 border-t border-slate-200 dark:border-slate-800 mt-6">
      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-slate-900 dark:text-slate-100">
        <Tv className="w-5 h-5 text-indigo-500" />
        Where to Watch
      </h3>
      <div className="flex flex-wrap gap-3">
        {streams.map((stream, idx) => (
          <Button 
            key={idx} 
            variant="outline" 
            className="flex items-center gap-2 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors" 
            asChild
          >
            <a href={stream.link} target="_blank" rel="noopener noreferrer" className="flex gap-2 p-3">
              <img src={stream.icon} alt={stream.name} className="w-4 h-4 rounded-sm object-cover" />
              <div className="flex ">
                <span>{stream.name}</span>
                <span className="text-[10px] uppercase text-slate-400 font-bold ml-1 tracking-wider bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded">
                    {stream.type === 'FLATRATE' ? 'Subs' : stream.type === 'RENT' ? 'Rent' : 'Buy'}
                </span>
              </div>
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}