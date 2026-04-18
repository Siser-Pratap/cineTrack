import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), '.env') });

const prisma = new PrismaClient();

async function main() {
  const filePath = '/Users/siserpratap/Personal/Movie/Movies/Watched.txt';
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found at ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  
  const omdbKey = process.env.OMDB_API_KEY;
  if (!omdbKey || omdbKey === 'YOUR_OMDB_API_KEY_HERE') {
    console.log("⚠️ No valid OMDB API Key found. Movies will be imported without posters/details.");
  } else {
    console.log("✅ OMDB API Key detected. Fetching rich metadata...");
  }
  
  let count = 0;

  for (const line of lines) {
    // Matches "(2) Frozen 2" or "(187) The Ritual"
    const match = line.match(/^\(\d+\)\s*(.*?)$/);
    if (!match) continue;
    
    let title = match[1].trim();
    if (!title) continue; // Skip empty titles
    
    console.log(`Processing: "${title}"...`);
    
    let posterUrl = null;
    let imdbLink = null;
    let description = "Imported from Watched.txt";
    let genre = "Various";
    let releaseYear = null;
    let language = "Various";

    if (omdbKey && omdbKey !== 'YOUR_OMDB_API_KEY_HERE') {
      try {
        const res = await fetch(`http://www.omdbapi.com/?apikey=${omdbKey}&t=${encodeURIComponent(title)}&plot=short`);
        const data = await res.json();
        
        if (data.Response === "True") {
          posterUrl = data.Poster !== "N/A" ? data.Poster : null;
          imdbLink = `https://www.imdb.com/title/${data.imdbID}/`;
          description = data.Plot !== "N/A" ? data.Plot : description;
          genre = data.Genre !== "N/A" ? data.Genre : genre;
          releaseYear = parseInt(data.Year) || null;
          language = data.Language !== "N/A" ? data.Language : language;
          title = data.Title; // Prefer the official capitalized title from IMDB
        }
      } catch (e) {
        console.error(`  -> Failed to fetch OMDB metadata for ${title}`);
      }
    }

    // Check if it already exists to avoid duplicates
    const existing = await prisma.movie.findFirst({
      where: { title: title }
    });

    if (existing) {
      if (existing.status === 'ToWatch') {
        // If it exists in ToWatch, upgrade it to Watched
        await prisma.movie.update({
          where: { id: existing.id },
          data: { status: 'Watched', watchedAt: new Date() }
        });
        console.log(`  -> Upgraded existing from To Watch to Watched`);
        count++;
      } else {
        console.log(`  -> Skipped (already exists in Watched)`);
      }
      continue;
    }

    await prisma.movie.create({
      data: {
        title,
        description,
        genre,
        language,
        releaseYear,
        posterUrl,
        imdbLink,
        priority: 'Medium',
        status: 'Watched',
        watchedAt: new Date()
      }
    });
    
    console.log(`  -> Added successfully`);
    count++;
    
    // Slight delay to respect OMDB API rate limits
    if (omdbKey) await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log(`\n🎉 Done! Successfully imported/updated ${count} movies into your Watched list.`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });