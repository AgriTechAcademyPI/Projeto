var express = require("express");
var app = express();
var router = express.Router();
const MeuAprendizadoController = require("../controler/MeuAprendizadoController");
const PerfilController = require("../controler/PerfilController");


 
/* rotas meu aprendizado */
router.post("/meuAprendizado", MeuAprendizadoController.adicionaCursoMeuAprendizado)
router.get("/todosCursos", MeuAprendizadoController.listaTodosCursos)

/* rotas Perfil */
router.get("/perfil",PerfilController.perfilUsuario)
router.get("/perfilUsuario",PerfilController.perfilUsuarioByID)
router.get("/perfilInstrutor",PerfilController.perfilInstrutorByID)
router.put("/perfilUsuario",PerfilController.editarUsuarioPerfil)
router.put("/perfilInstrutor",PerfilController.editarInstrutorPerfil)
router.get("/perfil/usuario",PerfilController.perfilUsuario)

module.exports = router;