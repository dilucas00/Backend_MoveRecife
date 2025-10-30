// import_gtfs.js
// Script para importar arquivos GTFS (CSV) presentes na pasta ./gtfs para coleções MongoDB.
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/moverecife';
const GTFS_DIR = path.join('.', 'gtfs');

async function connect() {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB conectado');
}

function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    if (!fs.existsSync(filePath)) return resolve(rows);
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => rows.push(data))
      .on('end', () => resolve(rows))
      .on('error', (err) => reject(err));
  });
}

async function importFile(fileName, collectionName) {
  const filePath = path.join(GTFS_DIR, fileName);
  console.log('Importando', filePath);
  const rows = await readCSV(filePath);
  if (!rows.length) { console.log('Arquivo vazio ou inexistente:', fileName); return; }
  const col = mongoose.connection.collection(collectionName);
  // limpar coleção e inserir
  await col.deleteMany({});
  await col.insertMany(rows);
  console.log(`Importados ${rows.length} registros em ${collectionName}`);
}

async function main() {
  try {
    await connect();
    await importFile('stops.txt', 'stops');
    await importFile('routes.txt', 'routes');
    await importFile('trips.txt', 'trips');
    await importFile('stop_times.txt', 'stop_times');
    await importFile('shapes.txt', 'shapes');
    await importFile('calendar.txt', 'calendar');
    await importFile('calendar_dates.txt', 'calendar_dates');
    console.log('Importação GTFS finalizada');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
