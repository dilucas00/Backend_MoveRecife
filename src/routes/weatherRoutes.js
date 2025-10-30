// src/routes/weatherRoutes.js
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Fetch the latest feed from ThingSpeak channel
router.get('/', async (req,res) => {
  try {
    const channelId = process.env.THINGSPEAK_CHANNEL_ID;
    const apiKey = process.env.THINGSPEAK_READ_API_KEY || '';
    if (!channelId) return res.status(500).json({ error: 'THINGSPEAK_CHANNEL_ID not configured' });

    const url = `https://api.thingspeak.com/channels/${channelId}/feeds.json?results=1${apiKey ? '&api_key=' + apiKey : ''}`;
    const r = await axios.get(url, { timeout: 5000 });
    if (!r.data || !r.data.feeds || r.data.feeds.length === 0) {
      return res.status(500).json({ error: 'No feeds from ThingSpeak' });
    }
    const last = r.data.feeds[0];
    res.json({
      temperature: last.field1,
      humidity: last.field2,
      updatedAt: last.created_at,
      raw: last
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching ThingSpeak' });
  }
});

export default router;
