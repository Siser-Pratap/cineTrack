import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Film, Star, List, Sparkles, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] -mt-8">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center pt-24 pb-16 text-center">
        <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm text-indigo-800 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 mb-8">
          <Sparkles className="w-4 h-4 mr-2" />
          <span>The elegant way to track your movies</span>
        </div>
        
        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 mb-6">
          Your Personal Movie Universe.
        </h1>
        
        <p className="max-w-2xl text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10">
          Track what you've watched, save what you want to see, and build your ultimate personal library with a beautifully crafted interface.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="rounded-full px-8 text-base">
            <Link href="/login">
              Go to Dashboard <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 text-base">
            <Link href="#features">
              Explore Features
            </Link>
          </Button>
        </div>
        
        {/* Preview Image / Mockup placeholder */}
        <div className="mt-20 relative w-full max-w-5xl aspect-video rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-2xl overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5" />
          <Film className="w-20 h-20 text-slate-300 dark:text-slate-700" />
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-white dark:from-slate-950 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need</h2>
          <p className="text-slate-600 dark:text-slate-400">Simple, elegant, and designed for film lovers.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
              <List className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Watchlists</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Easily organize movies you want to watch. Sort by priority, add tags, and never forget a recommendation again.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mb-6">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Rate & Review</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Keep a diary of everything you've watched. Rate movies, write personal notes, and track your viewing history over time.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Recommendations</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Discover your next favorite film. Get personalized recommendations based on your highest-rated genres and movies.
            </p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm text-slate-500">
        <div className="flex items-center space-x-2">
          <Film className="w-4 h-4" />
          <span className="font-semibold">CineTrack</span>
        </div>
        <p>© 2026 CineTrack. All rights reserved.</p>
      </footer>
    </div>
  );
}
