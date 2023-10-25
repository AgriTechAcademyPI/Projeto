const Sequelize = require('sequelize');
const connection = require("../database/connection")

  const User =  connection.define('usuarios', {

    nomeUsuario: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    email: {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: "email"
    },
    senha: {
      type: Sequelize.STRING(255),
      allowNull: true
    }
  }, 
  
  {
    Sequelize,
    tableName: 'usuarios',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idUsuario" },
        ]
      },
      {
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });

/*      User.sync({force: false}) 
 */  
  module.exports = User
