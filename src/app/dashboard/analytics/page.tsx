"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Film, Clock, Star, Languages } from "lucide-react";

const COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#ef4444', '#10b981'];

export default function AnalyticsPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch('/api/movies');
        const data = await res.json();
        setMovies(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchMovies();
  }, []);

  const stats = useMemo(() => {
    const watched = movies.filter(m => m.status === 'Watched');
    const toWatch = movies.filter(m => m.status === 'ToWatch');

    // 1. Decade Distribution (Watched vs ToWatch)
    const decadeMap: Record<string, { name: string, Watched: number, ToWatch: number }> = {};
    movies.forEach(m => {
      if (!m.releaseYear) return;
      const decade = `${Math.floor(m.releaseYear / 10) * 10}s`;
      if (!decadeMap[decade]) decadeMap[decade] = { name: decade, Watched: 0, ToWatch: 0 };
      decadeMap[decade][m.status as 'Watched' | 'ToWatch'] += 1;
    });
    const decadeData = Object.values(decadeMap).sort((a, b) => a.name.localeCompare(b.name));

    // 2. Top Genres (Exploded from comma-separated strings)
    const genreCount: Record<string, number> = {};
    watched.forEach(m => {
      if (!m.genre || m.genre === "Various") return;
      m.genre.split(',').forEach((g: string) => {
        const genre = g.trim();
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    });
    const genreData = Object.entries(genreCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7); // Top 7

    // 3. Language Diversity
    const langCount: Record<string, number> = {};
    movies.forEach(m => {
      if (!m.language || m.language === "Various") return;
      m.language.split(',').forEach((l: string) => {
        const lang = l.trim();
        langCount[lang] = (langCount[lang] || 0) + 1;
      });
    });
    const langData = Object.entries(langCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return {
      totalWatched: watched.length,
      totalToWatch: toWatch.length,
      completionRate: movies.length ? Math.round((watched.length / movies.length) * 100) : 0,
      oldestMovie: movies.filter(m => m.releaseYear).sort((a, b) => a.releaseYear - b.releaseYear)[0]?.releaseYear || 'N/A',
      newestMovie: movies.filter(m => m.releaseYear).sort((a, b) => b.releaseYear - a.releaseYear)[0]?.releaseYear || 'N/A',
      decadeData,
      genreData,
      langData
    };
  }, [movies]);

  if (loading) {
    return <div className="text-center py-20 text-slate-500 animate-pulse">Computing Analytics...</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Data & Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400">Exploratory Data Analysis (EDA) of your entire movie collection.</p>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900 border-indigo-100 dark:border-indigo-900/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-indigo-600 dark:text-indigo-400">Total Watched</h3>
              <Film className="w-5 h-5 text-indigo-600/50 dark:text-indigo-400/50" />
            </div>
            <p className="text-3xl font-bold">{stats.totalWatched}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/20 dark:to-slate-900 border-rose-100 dark:border-rose-900/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-rose-600 dark:text-rose-400">To Watch Backlog</h3>
              <Star className="w-5 h-5 text-rose-600/50 dark:text-rose-400/50" />
            </div>
            <p className="text-3xl font-bold">{stats.totalToWatch}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-teal-50 to-white dark:from-teal-950/20 dark:to-slate-900 border-teal-100 dark:border-teal-900/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-teal-600 dark:text-teal-400">Completion Rate</h3>
              <Clock className="w-5 h-5 text-teal-600/50 dark:text-teal-400/50" />
            </div>
            <p className="text-3xl font-bold">{stats.completionRate}%</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900 border-amber-100 dark:border-amber-900/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-amber-600 dark:text-amber-400">Release Timeline</h3>
              <Languages className="w-5 h-5 text-amber-600/50 dark:text-amber-400/50" />
            </div>
            <p className="text-2xl font-bold mt-1">{stats.oldestMovie} - {stats.newestMovie}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Genre Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Watched Genres</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {stats.genreData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.genreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.genreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">Not enough genre data</div>
            )}
          </CardContent>
        </Card>

        {/* Language Diversity Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Language Diversity (Whole Collection)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {stats.langData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.langData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ec4899" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">Not enough language data</div>
            )}
          </CardContent>
        </Card>

        {/* Release Decade Trends */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Movies by Release Decade</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
             {stats.decadeData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.decadeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="Watched" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="ToWatch" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
             ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">Not enough release year data</div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}