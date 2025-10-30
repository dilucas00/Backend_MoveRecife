// src/routes/statsRoutes.js
import express from 'express';
import Demand from '../models/Demand.js';

const router = express.Router();

router.post('/select', async (req,res) => {
  try {
    const { routeId, routeName, stopId, stopName, displayId } = req.body;
    if (!routeId || !stopId) return res.status(400).json({ error: 'routeId and stopId required' });
    const d = new Demand({ routeId, routeName, stopId, stopName, displayId });
    await d.save();
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving selection' });
  }
});

router.get('/top', async (req,res) => {
  const top = await Demand.aggregate([
    { $group: { _id: { routeId: '$routeId', routeName: '$routeName' }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
  res.json(top);
});

export default router;
