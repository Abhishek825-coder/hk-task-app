const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'Raj@0001', 
    database: 'hk_task',
  },
});

module.exports = knex;
