export async function getMovies() {
  const res = await fetch('/api/movies', { cache: 'no-store' });
  return res.json();
}

export async function addMovie(movie: any) {
  const res = await fetch('/api/movies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie)
  });
  return res.json();
}

export async function updateMovie(id: string, data: any) {
  const res = await fetch(`/api/movies/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteMovie(id: string) {
  const res = await fetch(`/api/movies/${id}`, {
    method: 'DELETE'
  });
  return res.json();
}
