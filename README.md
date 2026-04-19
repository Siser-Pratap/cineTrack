# 🎬 CineTrack - The Intelligent Movie Tracker

CineTrack is a beautifully designed, full-stack movie tracking application built with **Next.js**, **Tailwind CSS**, and **Prisma**. It allows users to meticulously track the movies they want to watch, log their watched history, rate films, and discover new cinematic masterpieces using the power of **Google's Gemini AI**.

---

## ✨ Features

- 📌 **To-Watch & Watched Dashboards**: Clean, grid-based interfaces to manage your movie backlog and your viewing history.
- 🧠 **AI-Powered Discovery Engine**: Chat directly with **Gemini AI** to get personalized recommendations based on your current watch history, or ask it to find hidden gems and trending blockbusters.
- 📊 **Exploratory Data Analysis (EDA)**: A dedicated Analytics page powered by `recharts` that visualizes your watching habits (Genre distributions, Release Decades, Completion rates, etc.).
- 🖼️ **Rich OMDB Metadata Integration**: Automatically fetches official movie posters, genres, release years, plot summaries, and IMDB links.
- 🔒 **PIN-Protected Access**: Secure your personal dashboards behind a sleek 6-digit passcode lock (with secure HTTP-Only cookies).
- 🔍 **Live Debounced Search & Filtering**: Instantly search your massive collections and filter by precise genres.
- 📱 **Fully Responsive & Dark Mode**: A premium UI/UX inspired by Apple and Letterboxd that looks gorgeous on mobile and desktop, automatically adapting to your system's light/dark preference.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) concepts
- **Database**: [MongoDB](https://www.mongodb.com/) via [Prisma ORM](https://www.prisma.io/)
- **AI Intelligence**: [Google Generative AI (Gemini 3.1 Pro Preview)](https://ai.google.dev/)
- **External Data**: [OMDB API](http://www.omdbapi.com/)
- **Charts**: [Recharts](https://recharts.org/)

---

## 🚀 Getting Started

Follow these steps to set up and run CineTrack on your local machine.

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/Siser-Pratap/cineTrack.git
cd cineTrack
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables
Create a \`.env\` file in the root directory of the project and add the following keys:

\`\`\`env
# MongoDB Connection String (from MongoDB Atlas)
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster-url>/cinetrack?retryWrites=true&w=majority"

# Google Gemini API Key (Get from Google AI Studio)
GEMINI_API_KEY="your_gemini_api_key"

# OMDB API Key (Get from omdbapi.com)
OMDB_API_KEY="your_omdb_api_key"

# Your personal 6-digit login PIN
APP_PIN="123456"
\`\`\`

### 4. Setup the Database
Push the Prisma schema to your MongoDB cluster to initialize the collections:
\`\`\`bash
npx prisma db push
npx prisma generate
\`\`\`

*(Optional)* If you have existing text files (`to_Watch.txt` or `Watched.txt`), you can run the import scripts to bulk-load your movies via the OMDB API:
\`\`\`bash
npx tsx scripts/import-movies.ts
npx tsx scripts/import-watched.ts
\`\`\`

### 5. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser. 
Log in with the \`APP_PIN\` you set in your environment variables to access the dashboard!

---

## 🏗️ Deployment

This project is fully optimized for deployment on **Vercel**. 
Simply link your GitHub repository to Vercel, ensure you add all four Environment Variables in the Vercel project settings, and deploy!

---

*Crafted with ❤️ for film lovers.*
