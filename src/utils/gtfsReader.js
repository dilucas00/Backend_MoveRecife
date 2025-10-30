// src/utils/gtfsReader.js
// Lightweight helpers to query GTFS collections in MongoDB
import mongoose from 'mongoose';

export async function getStops(limit = 1000) {
  return mongoose.connection.collection('stops').find({}).limit(limit).toArray();
}

export async function getRoutes(limit = 1000) {
  return mongoose.connection.collection('routes').find({}).limit(limit).toArray();
}

// Get next scheduled stop_times for a given stopId (based on today's schedule)
// Note: This function uses arrival_time strings in format HH:MM:SS as in GTFS.
export function hhmmssToSeconds(t) {
  if (!t) return null;
  const parts = t.split(':').map(Number);
  return (parts[0] || 0)*3600 + (parts[1] || 0)*60 + (parts[2] || 0);
}

export async function getNextForStop(stopId, limit = 5) {
  const stopTimesCol = mongoose.connection.collection('stop_times');
  const tripsCol = mongoose.connection.collection('trips');
  const routesCol = mongoose.connection.collection('routes');

  const now = new Date();
  // seconds since midnight local time (server TZ)
  const secondsNow = now.getHours()*3600 + now.getMinutes()*60 + now.getSeconds();

  // get stop_times for stopId
  const cursor = stopTimesCol.find({ stop_id: stopId }).sort({ stop_sequence: 1 }).limit(500);
  const results = await cursor.toArray();

  // join trip -> route and compute secs
  const items = [];
  for (const st of results) {
    const trip = await tripsCol.findOne({ trip_id: st.trip_id });
    if (!trip) continue;
    const route = await routesCol.findOne({ route_id: trip.route_id });
    const secs = hhmmssToSeconds(st.arrival_time);
    if (secs !== null && secs >= secondsNow) {
      items.push({
        tripId: st.trip_id,
        routeId: trip.route_id,
        routeName: route ? (route.route_short_name || route.route_long_name) : trip.route_id,
        scheduled_time: st.arrival_time,
        eta_seconds: secs - secondsNow
      });
    }
  }
  items.sort((a,b) => a.eta_seconds - b.eta_seconds);
  return items.slice(0, limit);
}
