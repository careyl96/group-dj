const { Pool } = require('pg');

// const pgPool = new Pool({
//   user: process.env.DBUSER,
//   host: process.env.DBHOST,
//   database: process.env.DB,
//   password: process.env.DBPASSWORD,
//   port: 5432,
// });

const pgPool = new Pool({
  user: 'careylee',
  database: 'groupdj',
});

pgPool.connect((err, client, release) => {
  if (err) throw err;
  console.log('successfully connected to database');
});

module.exports = pgPool;
