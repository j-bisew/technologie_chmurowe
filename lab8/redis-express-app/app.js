const express = require('express');
const { createClient } = require('redis');

const app = express();
app.use(express.json());

const redisClient = createClient({ url: 'redis://redis:6379' });

redisClient.connect().catch(console.error);

app.post('/messages', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).send('Brak wiadomości');
  await redisClient.rPush('messages', message);
  res.send('Wiadomość zapisana');
});

app.get('/messages', async (req, res) => {
  const messages = await redisClient.lRange('messages', 0, -1);
  res.json(messages);
});

app.listen(3000, () => {
  console.log('API działa na http://localhost:3000');
});
