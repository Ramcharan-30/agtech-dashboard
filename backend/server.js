import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import competitorRoutes from './routes/competitorRoutes.js';
import swotRoutes from './routes/swotRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

// CORS: allow deployed frontend + local dev
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(express.json());

// Connect to DB on every request (cached after first connection).
// This is the correct pattern for serverless — avoids fire-and-forget
// at module load time which can crash the function container.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('DB connection error:', error.message);
    res.status(503).json({ message: 'Database unavailable. Please try again.' });
  }
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/competitors', competitorRoutes);
app.use('/api/swot', swotRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'AgTech Market Intelligence API is running.' });
});

// Only start the HTTP server when running locally (not on Vercel)
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running in development mode on port ${PORT}`);
  });
}

export default app;