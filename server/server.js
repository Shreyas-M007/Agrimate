import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Request logging for observability
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Mount MandiMate API routes
app.use('/api', apiRouter);

// Serve static frontend build if available
const distPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Fallback root endpoint
  app.get('/', (req, res) => {
    res.json({
      app: "MandiMate API Service",
      version: "1.0.0",
      docs: "/api/health",
      principle: "MandiMate must never invent a market price. Numerical information originates from verified external data sources."
    });
  });
}

import db from './database/db.js';
import { refreshCache } from './services/marketService.js';

// Initialize SQLite database and warm cache
async function startServer() {
  try {
    console.log("🌾 Initializing MandiMate SQLite database...");
    await db.initDb();
    await refreshCache();
    console.log("🌾 MandiMate SQLite database ready and verified.");

    app.listen(PORT, () => {
      console.log(`🌾 MandiMate full-stack service running on http://localhost:${PORT}`);
      console.log(`🌾 Verified agricultural intelligence ready.`);
    });
  } catch (err) {
    console.error("Failed to start MandiMate service:", err);
    process.exit(1);
  }
}

startServer();
