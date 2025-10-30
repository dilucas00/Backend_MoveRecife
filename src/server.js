// src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config.js';
import busRoutes from './routes/busRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

await connectDB();

app.use('/api/bus', busRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/stats', statsRoutes);

app.get('/', (req,res) => res.send('MoveRecife API is running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
