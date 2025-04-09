const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
  host: 'database',
  user: 'admin',
  password: 'admin',
  database: 'testdb',
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM example');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Błąd połączenia z bazą danych: ' + err.message);
  }
});

app.listen(port, () => {
  console.log(`Backend działa na porcie ${port}`);
});

