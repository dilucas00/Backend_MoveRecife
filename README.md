# MoveRecife - Backend 

Projeto backend Node.js para o MoveRecife — painel de parada de ônibus que combina dados GTFS (ônibus) + sensores (ThingSpeak) + analytics (MongoDB).

## Conteúdo
- `src/` - código fonte
- `import_gtfs.js` - script para importar arquivos GTFS (CSV) do diretório `gtfs/` para o MongoDB
- `.env.example` - variáveis de ambiente

## Requisitos
- Node.js >= 18
- MongoDB rodando (local ou Atlas)
- Colocar os arquivos GTFS extraídos em `gtfs/` no diretório do projeto (mesma pasta que `import_gtfs.js`)

## Como rodar
1. Copie `.env.example` para `.env` e preencha:
   - MONGO_URI
   - THINGSPEAK_CHANNEL_ID
2. Instale dependências:
   ```bash
   npm install
   ```
3. Importe o GTFS para o MongoDB (executa `import_gtfs.js`):
   ```bash
   npm run import-gtfs
   ```
   Certifique-se de ter uma pasta `gtfs/` com os arquivos (stops.txt, routes.txt, trips.txt, stop_times.txt, shapes.txt, calendar.txt, calendar_dates.txt).
4. Rode o servidor:
   ```bash
   npm start
   ```
5. Endpoints principais:
   - `GET /api/bus/stops` → lista de paradas
   - `GET /api/bus/routes` → lista de linhas
   - `GET /api/bus/next/:stopId?limit=5` → próximos ônibus na parada (ETA baseado em horários programados)
   - `GET /api/weather` → último feed do ThingSpeak (temperature/humidity)
   - `POST /api/stats/select` → registrar seleção do usuário (body: { routeId, routeName, stopId, stopName, displayId })
   - `GET /api/stats/top` → top rotas selecionadas

## Notas
- O cálculo de ETA aqui usa horários programados do GTFS; se você obtiver GTFS-RT (tempo real) é possível melhorar consideravelmente as estimativas.
- O ThingSpeak é usado como ponte para o ESP32 + DHT11 — os dados mais recentes são buscados via API do ThingSpeak.
