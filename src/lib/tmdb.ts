export async function fetchTMDBMovie(title: string) {
  // Mock function for TMDB API search
  // In a real app, you would use TMDB API Key:
  // const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${title}`);
  
  return [
    {
      title: "Inception",
      posterUrl: "https://image.tmdb.org/t/p/w500/811DjJTon9gD6hZ8nCjSitaIXFQ.jpg",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology...",
      releaseYear: 2010,
      language: "English",
      genre: "Action, Sci-Fi"
    },
    {
      title: "The Matrix",
      posterUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      description: "A computer hacker learns from mysterious rebels about the true nature of his reality...",
      releaseYear: 1999,
      language: "English",
      genre: "Action, Sci-Fi"
    }
  ].filter(m => m.title.toLowerCase().includes(title.toLowerCase()));
}
