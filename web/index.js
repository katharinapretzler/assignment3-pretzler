const express = require('express');
const redis = require('redis');

const app = express();
const port = 3000;

const client = redis.createClient({ url: 'redis://redis:6379' });
client.connect();

app.get('/set/:key/:value', async (req, res) => {
  const { key, value } = req.params;
  await client.set(key, value);
  res.send(`Gespeichert: ${key} = ${value}`);
});

app.get('/get/:key', async (req, res) => {
  const { key } = req.params;
  const value = await client.get(key);
  res.send(`Wert für ${key} ist: ${value}`);
});

app.listen(port, () => {
  console.log(`Webapp läuft auf http://localhost:${port}`);
});
