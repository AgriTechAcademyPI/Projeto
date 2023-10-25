const Sequelize = require('sequelize');
const connection = require("../database/connection")
const Instrutor = require("../instrutor/Instrutor")
const Categoria = require("./Categoria")


const Curso = connection.define('cursos', {
    

    titulo: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    descricao: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    preco: {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true
    },
    idInstrutor: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: Instrutor,
        key: 'id'
      }
    },
    idCategoria: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: Categoria,
        key: 'id'
      }
    },
    imagemCurso: {
      type: Sequelize.BLOB,
      allowNull: true
    },
    linkCurso: {
      type: Sequelize.STRING(500),
      allowNull: true
    }
  }, {
    Sequelize,
    tableName: 'cursos',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idCurso" },
        ]
      },
      {
        name: "idInstrutor",
        using: "BTREE",
        fields: [
          { name: "idInstrutor" },
        ]
      },
      {
        name: "idCategoria",
        using: "BTREE",
        fields: [
          { name: "idCategoria" },
        ]
      }
    ]
  });

/*     Curso.sync({force: false})  
 */    

  module.exports = Curso

