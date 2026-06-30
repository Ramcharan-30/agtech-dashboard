import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import competitorRoutes from './routes/competitorRoutes.js';
import swotRoutes from './routes/swotRoutes.js';

// Import Routes


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/competitors', competitorRoutes);

app.get('/', (req, res) => {
  res.send('AgTech Market Intelligence API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running in development mode on port ${PORT}`);
});
app.use('/api/competitors', competitorRoutes);
app.use('/api/swot', swotRoutes);