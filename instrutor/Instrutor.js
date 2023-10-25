const Sequelize = require('sequelize');
const connection = require("../database/connection")
const User = require("../user/User")



  const Instrutor =  connection.define('instrutores', {

  
    idUsuario: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id'
      }
    },
    cpf: {
      type: Sequelize.STRING(14),
      allowNull: true
    },
    'endereço': {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    nomeCompleto: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    celular: {
      type: Sequelize.STRING(20),
      allowNull: true
    },
    dataDeNascimento: {
      type: Sequelize.DATEONLY,
      allowNull: true
    }
  }, {
    Sequelize,
    tableName: 'instrutores',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idInstrutor" },
        ]
      },
      {
        name: "idUsuario",
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });


/*       Instrutor.sync({force: false}) 
 */   
   module.exports = Instrutor

