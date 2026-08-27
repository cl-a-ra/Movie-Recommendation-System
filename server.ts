import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-Side Gemini Client Initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Scalability Architecture Simulated Live Telemetry Endpoint
app.get('/api/metrics/scale', (req, res) => {
  // Generates realistic live metrics showing thousands of concurrent users
  const baseUsers = 7420;
  const jitter = Math.floor(Math.random() * 250) - 125;
  const activeUsers = baseUsers + jitter;
  const cacheHit = +(99.1 + Math.random() * 0.7).toFixed(2);
  const latency = +(11 + Math.random() * 4).toFixed(1);
  const qps = Math.floor(activeUsers * 1.85 + Math.random() * 50);

  res.json({
    activeConcurrentUsers: activeUsers,
    cacheHitRatio: cacheHit,
    averageResponseTimeMs: latency,
    databaseQueriesPerSec: qps,
    readReplicaNodes: 4,
    edgeCdnLocations: 48,
    memoryUsageMb: 512 + Math.floor(Math.random() * 30),
    serverTimestamp: Date.now()
  });
});

// AI Recommendation Route (Server-Side with Gemini 3.7 Flash)
app.post('/api/recommendations/ai', async (req, res) => {
  const { prompt, userGenres, favoriteMovies, mood } = req.body;

  try {
    const ai = getGeminiClient();

    if (ai) {
      const systemInstruction = `You are CineMatch's world-class Movie & TV Show Recommendation AI Engine. 
You provide structured JSON recommendations based on the user's inquiry, taste profile, moods, and favorite titles.
Always return valid JSON containing an array of recommendation objects with:
- title (string)
- type ('movie' or 'series')
- year (number)
- genres (array of strings)
- matchScore (number between 85 and 99)
- pitch (compelling 1-2 sentence reason why this matches their specific prompt)
- moodTags (array of 2-3 mood tags, e.g. ["Mind-Bending", "Atmospheric", "Dark Thriller"])
- similarTo (string mentioning which of their favorites or prompt elements inspired it)`;

      const userContent = `User query: "${prompt || 'Recommend high-quality movies'}"
User favorite genres: ${userGenres?.join(', ') || 'Sci-Fi, Thriller, Drama'}
User favorite titles: ${favoriteMovies?.join(', ') || 'Inception, Interstellar, Severance'}
Target mood: ${mood || 'Any'}

Please recommend 4 tailored movie or series titles. Format as JSON array of objects.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: userContent,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7
        }
      });

      const responseText = response.text || '[]';
      let parsed = [];
      try {
        parsed = JSON.parse(responseText);
      } catch (parseErr) {
        console.warn('Failed to parse AI JSON response, fallbacking:', parseErr);
      }

      return res.json({
        success: true,
        source: 'gemini-3.7-flash',
        recommendations: parsed
      });
    }

    // Fallback recommendation engine if API key is not configured
    const fallbackRecs = [
      {
        title: 'Arrival',
        type: 'movie',
        year: 2016,
        genres: ['Sci-Fi', 'Drama', 'Mystery'],
        matchScore: 97,
        pitch: 'A profound, linguistically centered sci-fi mystery with breathtaking emotional payoff and non-linear storytelling.',
        moodTags: ['Mind-Bending', 'Emotional', 'Philosophical'],
        similarTo: 'Interstellar & Inception'
      },
      {
        title: 'Dark',
        type: 'series',
        year: 2017,
        genres: ['Sci-Fi', 'Mystery', 'Drama'],
        matchScore: 95,
        pitch: 'Intricate multi-generational time mystery with tight puzzle-box writing, eerie atmosphere, and stunning score.',
        moodTags: ['Dark Thriller', 'Mind-Bending', 'Moody'],
        similarTo: 'Severance & Stranger Things'
      },
      {
        title: 'Prisoners',
        type: 'movie',
        year: 2013,
        genres: ['Crime', 'Drama', 'Mystery'],
        matchScore: 93,
        pitch: 'Taut, rain-soaked moral dilemma thriller with powerhouse performances from Hugh Jackman and Jake Gyllenhaal.',
        moodTags: ['Dark Thriller', 'Adrenaline', 'Moody'],
        similarTo: 'The Batman & Parasite'
      },
      {
        title: 'Arcane',
        type: 'series',
        year: 2021,
        genres: ['Animation', 'Action', 'Sci-Fi', 'Drama'],
        matchScore: 96,
        pitch: 'Masterpiece level art direction, gripping emotional sister dynamics, and unmatched animation fluidity.',
        moodTags: ['Adrenaline', 'Emotional', 'Epic'],
        similarTo: 'Spider-Verse & Cyberpunk: Edgerunners'
      }
    ];

    return res.json({
      success: true,
      source: 'heuristic-engine',
      recommendations: fallbackRecs
    });
  } catch (error: any) {
    console.error('Error generating AI recommendation:', error);
    res.status(500).json({
      error: 'Failed to generate recommendations',
      message: error?.message || 'Unknown error'
    });
  }
});

// Push notification mock subscription / trigger endpoint
app.post('/api/notifications/dispatch', (req, res) => {
  const { title, message, type, movieTitle } = req.body;
  res.json({
    success: true,
    sentAt: new Date().toISOString(),
    notification: {
      id: 'notif-' + Date.now(),
      title: title || 'New Release Alert',
      message: message || `New update regarding ${movieTitle || 'your watchlist'}`,
      type: type || 'episode_alert',
      timestamp: 'Just now',
      read: false
    }
  });
});

// Vite middleware & Static serving setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎬 CineMatch Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
