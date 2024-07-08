var express = require("express");
var app = express();
var router = express.Router();
const MeuAprendizadoController = require("../controler/MeuAprendizadoController");
const PerfilController = require("../controler/PerfilController");
const CategoriasController = require("../controler/CategoriasController");
const CursoController2 = require("../controler/CursoController2");
const Avaliacoes = require("../controler/AvaliacoesController");

const Middleware = require("../controler/Middleware");

 
/* rotas meu aprendizado */
router.get("/meuAprendizado/filtro", MeuAprendizadoController.exibeMeuAprendizadoFiltro)
router.get("/meu-aprendizado",Middleware.AutenticacaoLogin, MeuAprendizadoController.exibeMeuAprendizado)
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
router.post("/cadastrar/curso", CursoController2.cadastrarCurso)
router.get("/gerenciar/cursos", CursoController2.exibirGerenciarMeusCursos)
router.get("/gerenciar/cursos/filtro", CursoController2.exibirGerenciarMeusCursosFiltro)
router.post("/cadastrar/aula", CursoController2.cadastrarAula)
router.put("/editar/aula/:idAula", CursoController2.editarAula)
router.delete("/deletar/aula/:idAula", CursoController2.deletarAula)

router.get("/aula/unica/:idAula", CursoController2.recuperaAulaUnica)

router.delete("/curso/:idCurso", CursoController2.deletarCurso)

router.get("/curso/:idCurso", CursoController2.pegarInformacoesCursoUnico)
router.put("/curso/:idCurso", CursoController2.editarCurso)

/* rotas avaliações */

router.post("/curso/avaliacao", Avaliacoes.cadastrarEditarAvaliacao)
router.get("/curso/avaliacao/usuario/:idCurso", Avaliacoes.pegaAvaliacaoExisteUsuarioCurso)
router.get("/avaliacao/estatisticas/:idCurso", Avaliacoes.estatisticasAvaliacoesCurso)

module.exports = router;