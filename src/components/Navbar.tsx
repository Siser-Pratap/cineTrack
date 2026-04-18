import Link from 'next/link';
import { Film, CheckCircle, Search, Home } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Film className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span className="font-bold text-xl tracking-tight">CineTrack</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="flex items-center space-x-1 text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors">
            <Home className="w-4 h-4" />
            <span>To Watch</span>
          </Link>
          <Link href="/dashboard/watched" className="flex items-center space-x-1 text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors">
            <CheckCircle className="w-4 h-4" />
            <span>Watched</span>
          </Link>
          <Link href="/dashboard/discover" className="flex items-center space-x-1 text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors">
            <Search className="w-4 h-4" />
            <span>Discover</span>
          </Link>
          <Link href="/dashboard/analytics" className="flex items-center space-x-1 text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-3"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
            <span>Analytics</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}