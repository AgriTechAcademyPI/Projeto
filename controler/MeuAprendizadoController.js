var MeuAprendizado = require("../models/MeuAprendizadoModel")

class MeuAprendizadoController{
    
    async adicionaCursoMeuAprendizado(req, res){
      var idCurso = req.body.idCurso
      var dataAquisicao = req.body.dataAquisicao
      var ultimoAcesso = req.body.ultimoAcesso

      if(req.session.user == undefined){
        res.status(403)
        res.send("O Usuário não esta logado")        
      }

      if(idCurso == undefined){
        res.status(403) 
        res.json({err: "o idCurso Nao pode ser nulo"})
        return
      }
      if(dataAquisicao == undefined){
        res.status(403) 
        res.json({err: "o dataAquisicao nao pode ser nula"})
        return
      }
      var idUsuario = req.session.user.id
      await MeuAprendizado.adquireCurso(idCurso, idUsuario, dataAquisicao, ultimoAcesso)
      res.status(200)
      res.send("tudo ok")
    }

    async listaTodosCursos(req, res){
      var parametro = req.params.filtro
      console.log(parametro)
      if(req.session.user != undefined){
        var id = req.session.user.id
        var cursos = await MeuAprendizado.cursos(id)
        res.json(parametro)
      }else{
        res.status(403)
        res.send("O Usuário não esta logado")
      }
  }

  async listaTodosInstrutoresCursos(req, res){
    if(req.session.user != undefined){
      var id = req.session.user.id
      var InstrutoresCursos = await MeuAprendizado.listaInstrutoresCursosUsuarios(id)
      res.json(InstrutoresCursos)


    }else{
      res.status(403)
      res.send("O Usuário não esta logado")
    }
  }

  async exibeMeuAprendizado(req, res) {
    var id = req.session.user.id
    var cursos = await MeuAprendizado.cursos(id)
    res.render("curso/meuAprendizado.ejs", { cursos: cursos });
      
  }

  async exibeMeuAprendizadoFiltro(req, res) {
    var id = req.session.user.id
    var tipoOrdenacao = req.query.tipoOrdenacao || null;
    var categoria = req.query.categoria || null;
    var instrutor = req.query.instrutor || null;
    var progresso = req.query.progresso || null;


    var cursos = await MeuAprendizado.cursos(id, tipoOrdenacao, categoria, instrutor, progresso)
      
    res.json(cursos)
  }

 





}

module.exports = new MeuAprendizadoController()