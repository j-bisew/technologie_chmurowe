const { Client } = require('pg');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const client = new Client({
    host: 'postgres',
    user: 'postgres',
    password: 'password',
    database: 'appdb',
    port: 5432,
  });

  while (true) {
    try {
      await client.connect();
      console.log("PostgreSQL gotowy!");
      client.end();
      break;
    } catch (err) {
      console.log("Oczekiwanie na PostgreSQL...");
      await sleep(2000);
    }
  }

  require('./app.js');
})();
