 const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : 'localhost',
      user : 'root',
      password : 'familia100',
      database : 'agritech6'
    }
  });

  module.exports = knex