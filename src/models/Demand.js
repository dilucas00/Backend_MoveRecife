// src/models/Demand.js
import mongoose from 'mongoose';
const demandSchema = new mongoose.Schema({
  routeId: String,
  routeName: String,
  stopId: String,
  stopName: String,
  displayId: String,
  timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('Demand', demandSchema);
