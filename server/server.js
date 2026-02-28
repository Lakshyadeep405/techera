import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware — allow all origins in production (frontend is on a different Render URL)
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? true  // allow all origins in production
        : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

import apiRoutes from './routes/api.js';

// API Routes
app.use('/api', apiRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'ok', platform: 'DebugX API' });
});

// Database connection
const connectDB = async () => {
    try {
        if (process.env.MONGO_URI) {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('MongoDB Connected');
        } else {
            console.log('MongoDB URI not found. Running without DB.');
        }
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
    }
};

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
