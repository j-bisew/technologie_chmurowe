const express = require('express');
const { createClient } = require('redis');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const redisClient = createClient({ url: 'redis://redis:6379' });
redisClient.connect().catch(console.error);

const pgPool = new Pool({
  host: 'postgres',
  user: 'postgres',
  password: 'password',
  database: 'appdb',
  port: 5432,
});

pgPool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
  );
`).catch(console.error);

app.get('/', (req, res) => {
    res.send('API działa');
});

app.post('/messages', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).send('Brak wiadomości');
  await redisClient.rPush('messages', message);
  res.send('Wiadomość zapisana w Redis');
});

app.get('/messages', async (req, res) => {
  const messages = await redisClient.lRange('messages', 0, -1);
  res.json(messages);
});

app.post('/users', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send('Brak nazwy użytkownika');
  await pgPool.query('INSERT INTO users(name) VALUES($1)', [name]);
  res.send('Użytkownik dodany do PostgreSQL');
});

app.get('/users', async (req, res) => {
  const result = await pgPool.query('SELECT * FROM users');
  res.json(result.rows);
});

app.listen(3000, () => {
  console.log('API działa na http://localhost (przez nginx)');
});
