 const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : 'localhost',
      user : '***',
      password : '***',
      database : '***'
    }
  });

  module.exports = knex
