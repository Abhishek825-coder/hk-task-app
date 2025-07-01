const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'Raj@0001', // ← agar tumne MySQL login me password diya tha, to yahan likho
    database: 'hk_task',
  },
});

module.exports = knex;
