// src/routes/busRoutes.js
import express from 'express';
import { getStops, getRoutes, getNextForStop } from '../utils/gtfsReader.js';

const router = express.Router();

router.get('/stops', async (req,res) => {
  const stops = await getStops(10000);
  res.json(stops);
});

router.get('/routes', async (req,res) => {
  const routes = await getRoutes(10000);
  res.json(routes);
});

router.get('/next/:stopId', async (req,res) => {
  try {
    const limit = parseInt(req.query.limit || '5', 10);
    const { stopId } = req.params;
    const next = await getNextForStop(stopId, limit);
    res.json({ stopId, next, now: new Date().toISOString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar próximos ônibus' });
  }
});

export default router;
