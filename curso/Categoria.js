const Sequelize = require("sequelize")
const connection = require("../database/connection")

const Categoria = connection.define('categorias', {
    title:{
        type: Sequelize.STRING,
        allowNull: true
    },slug: {
        type: Sequelize.STRING,
        allowNull: true
    }
})

/*     Categoria.sync({force: false}) 
 */  

module.exports = Categoria