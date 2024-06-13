var express = require("express");
var app = express();
var router = express.Router();
const MeuAprendizadoController = require("../controler/MeuAprendizadoController");
const PerfilController = require("../controler/PerfilController");
const CategoriasController = require("../controler/CategoriasController");
const CursoController2 = require("../controler/CursoController2");


 
/* rotas meu aprendizado */
router.get("/meuAprendizado/filtro", MeuAprendizadoController.exibeMeuAprendizadoFiltro)
router.get("/meuAprendizado", MeuAprendizadoController.exibeMeuAprendizado)
router.post("/obter-curso", MeuAprendizadoController.adicionaCursoMeuAprendizado)
router.get("/meuAprendizado/instrutores", MeuAprendizadoController.listaTodosInstrutoresCursos)

    
/* rotas Perfil */
router.get("/perfil",PerfilController.perfilUsuario)
router.get("/perfilUsuario",PerfilController.perfilUsuarioByID)
router.get("/perfilInstrutor",PerfilController.perfilInstrutorByID)
router.put("/perfilUsuario",PerfilController.editarUsuarioPerfil)
router.put("/perfilInstrutor",PerfilController.editarInstrutorPerfil)
router.get("/perfil/usuario",PerfilController.perfilUsuario)

/* rotas Categorias */
router.get("/categorias", CategoriasController.todasCategorias)


/* rotas cursos */
router.get("/informacoes-curso/:idCurso", CursoController2.informacoesCurso)

router.get("/informacoes-curso/:idCurso", CursoController2.informacoesCurso)




module.exports = router;