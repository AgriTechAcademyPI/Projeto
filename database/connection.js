/* const Sequelize = require("sequelize")

const connection = new Sequelize('agritec2', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = connection */

const Sequelize = require("sequelize")

const connection = new Sequelize('railway', 'root', 'Qig7wZRmxImGvBNm0DHH', {
    host: 'containers-us-west-103.railway.app',
    dialect: 'mysql',
    timezone: '-03:00',
    port: 6124
})

module.exports = connection
//