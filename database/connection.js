const Sequelize = require("sequelize")

const connection = new Sequelize('agritech6', 'root', 'familia100', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = connection

/* const Sequelize = require("sequelize")

const connection = new Sequelize('railway', 'root', 'Qig7wZRmxImGvBNm0DHH', {
    host: 'containers-us-west-103.railway.app',
    dialect: 'mysql',
    timezone: '-03:00',
    port: 6124
})

module.exports = connection
 */