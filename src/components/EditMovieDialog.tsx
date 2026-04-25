"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function EditMovieDialog({ movie, isOpen, setIsOpen, onUpdate }: { movie: any, isOpen: boolean, setIsOpen: (b: boolean) => void, onUpdate: (action?: 'update' | 'delete') => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: movie.title || "",
    genre: movie.genre || "",
    priority: movie.priority || "Medium",
    rating: movie.rating || 0,
    review: movie.review || ""
  });

  // Keep state in sync if the movie prop changes while dialog is somehow kept around
  useState(() => {
    setFormData({
      title: movie.title || "",
      genre: movie.genre || "",
      priority: movie.priority || "Medium",
      rating: movie.rating || 0,
      review: movie.review || ""
    });
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/movies/${movie.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save');
      }
      
      setIsOpen(false);
      onUpdate('update');
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleMoveToWatchlist = async () => {
    if (!confirm("Move this title back to your To Watch list? This will remove its rating and review.")) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/movies/${movie.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'ToWatch',
          rating: null,
          review: null,
          watchedAt: null
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to move to watchlist');
      }
      
      setIsOpen(false);
      onUpdate('delete'); // Treat as 'delete' from Watched page to trigger redirect
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this title?")) return;
    setLoading(true);
    try {
      await fetch(`/api/movies/${movie.id}`, { method: 'DELETE' });
      setIsOpen(false);
      onUpdate('delete');
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-slate-900 border-none shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Edit Details</h2>
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200" onClick={() => setIsOpen(false)}>✕</Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block text-slate-700 dark:text-slate-300">Title</label>
            <Input 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              required
              className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block text-slate-700 dark:text-slate-300">Genre</label>
            <select 
              className="flex h-9 w-full rounded-md border border-slate-200 bg-white dark:bg-slate-950 px-3 py-1 text-sm shadow-sm dark:border-slate-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300 text-slate-900 dark:text-slate-100"
              value={formData.genre}
              onChange={e => setFormData({...formData, genre: e.target.value})}
            >
              <option value="Various">Various</option>
              <option value="Action">Action</option>
              <option value="Adventure">Adventure</option>
              <option value="Animation">Animation</option>
              <option value="Comedy">Comedy</option>
              <option value="Crime">Crime</option>
              <option value="Documentary">Documentary</option>
              <option value="Drama">Drama</option>
              <option value="Family">Family</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Horror">Horror</option>
              <option value="Mystery">Mystery</option>
              <option value="Romance">Romance</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Thriller">Thriller</option>
            </select>
          </div>
          
          {movie.status === 'ToWatch' && (
            <div>
              <label className="text-sm font-medium mb-1 block text-slate-700 dark:text-slate-300">Priority</label>
              <select 
                className="flex h-9 w-full rounded-md border border-slate-200 bg-white dark:bg-slate-950 px-3 py-1 text-sm shadow-sm dark:border-slate-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300 text-slate-900 dark:text-slate-100"
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value})}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          )}

          {movie.status === 'Watched' && (
            <>
              <div>
                <label className="text-sm font-medium mb-1 block text-slate-700 dark:text-slate-300">Rating (1-5)</label>
                <Input 
                  type="number" 
                  min="1" max="5" 
                  value={formData.rating || ''} 
                  onChange={e => setFormData({...formData, rating: parseInt(e.target.value) || 0})} 
                  className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block text-slate-700 dark:text-slate-300">Review</label>
                <textarea 
                  className="flex w-full rounded-md border border-slate-200 bg-white dark:bg-slate-950 px-3 py-2 text-sm shadow-sm dark:border-slate-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300 text-slate-900 dark:text-slate-100 min-h-[80px]"
                  value={formData.review || ""}
                  onChange={e => setFormData({...formData, review: e.target.value})}
                />
              </div>
            </>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-between mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <Button type="button" variant="destructive" className="w-full sm:w-auto py-5 sm:py-2" onClick={handleDelete} disabled={loading}>
                <span className="truncate">Delete</span>
              </Button>
              {movie.status === 'Watched' && (
                <Button type="button" variant="outline" className="w-full sm:w-auto py-5 sm:py-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-900/50 dark:text-indigo-400 dark:hover:bg-indigo-950/50" onClick={handleMoveToWatchlist} disabled={loading}>
                  <span className="truncate">Move to Watchlist</span>
                </Button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <Button type="button" variant="outline" className="w-full sm:w-auto py-5 sm:py-2" onClick={() => setIsOpen(false)}>
                <span className="truncate">Cancel</span>
              </Button>
              <Button type="submit" className="w-full sm:w-auto py-5 sm:py-2" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />} <span className="truncate">Save</span>
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}