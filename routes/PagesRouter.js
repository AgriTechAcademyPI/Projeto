var express = require("express");
var app = express();
var router = express.Router();
const MeuAprendizadoController = require("../controler/MeuAprendizadoController");
const PerfilController = require("../controler/PerfilController");
const CategoriasController = require("../controler/CategoriasController");
const CursoController2 = require("../controler/CursoController2");


// Rotas Cursos
router.get("/gerenciador/aulas/:tituloCurso", CursoController2.paginaCadastrarAula)



module.exports = router;