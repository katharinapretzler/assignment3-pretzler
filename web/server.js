import express from 'express';
import { createClient } from 'redis';

const app = express();
const PORT = process.env.PORT || 3000;

const redisClient = createClient({ url: 'redis://redis:6379' });

redisClient.on('error', err => console.error('Redis Fehler:', err));

await redisClient.connect();

app.get('/store', async (req, res) => {
  const { key, value } = req.query;
  if (!key || !value) {
    return res.status(400).send('Fehlende Parameter');
  }
  await redisClient.set(key, value);
  res.send(`"${key}" wurde erfolgreich gespeichert mit Wert "${value}"`);
});

app.get('/fetch', async (req, res) => {
  const { key } = req.query;
  if (!key) {
    return res.status(400).send('Parameter "key" fehlt');
  }
  const result = await redisClient.get(key);
  res.send(result ? `Wert: ${result}` : 'Leider kein Eintrag gefunden');
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
