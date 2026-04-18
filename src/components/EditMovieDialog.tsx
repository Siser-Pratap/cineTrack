"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function EditMovieDialog({ movie, isOpen, setIsOpen, onUpdate }: { movie: any, isOpen: boolean, setIsOpen: (b: boolean) => void, onUpdate: () => void }) {
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
      onUpdate();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this movie?")) return;
    setLoading(true);
    try {
      await fetch(`/api/movies/${movie.id}`, { method: 'DELETE' });
      setIsOpen(false);
      onUpdate();
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
          <h2 className="text-xl font-bold">Edit Details</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>✕</Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Genre</label>
            <select 
              className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
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
              <label className="text-sm font-medium mb-1 block">Priority</label>
              <select 
                className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800"
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
                <label className="text-sm font-medium mb-1 block">Rating (1-5)</label>
                <Input 
                  type="number" 
                  min="1" max="5" 
                  value={formData.rating || ''} 
                  onChange={e => setFormData({...formData, rating: parseInt(e.target.value) || 0})} 
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Review</label>
                <textarea 
                  className="flex w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm dark:border-slate-800 min-h-[80px]"
                  value={formData.review || ""}
                  onChange={e => setFormData({...formData, review: e.target.value})}
                />
              </div>
            </>
          )}

          <div className="flex justify-between mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
              Delete
            </Button>
            <div className="space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}