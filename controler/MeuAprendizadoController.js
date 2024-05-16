var MeuAprendizado = require("../models/MeuAprendizado")

class MeuAprendizadoController{
    
    async adicionaCursoMeuAprendizado(req, res){
      var idUsuario = req.body.idUsuario
      var idCurso = req.body.idCurso
      var dataAquisicao = req.body.dataAquisicao

      if(idCurso == undefined){
        res.status(403) 
        res.json({err: "o idCurso Nao pode ser nulo"})
        return
      }
      if(idUsuario == undefined){
        res.status(403) 
        res.json({err: "o idUsuario nao pode ser nulo"})
        return
      } if(dataAquisicao == undefined){
        res.status(403) 
        res.json({err: "o dataAquisicao nao pode ser nula"})
        return
      }
  
      await MeuAprendizado.adquireCurso(idCurso, idUsuario, dataAquisicao)
      res.status(200)
      res.send("tudo ok")
    }

    async listaTodosCursos(req, res){
      if(req.session.user != undefined){
        var id = req.session.user.id
        var cursos = await MeuAprendizado.cursos(id)
        res.json(cursos)
      }else{
        res.status(403)
        res.send("O Usuário não esta logado")
      }
      

  }
}

module.exports = new MeuAprendizadoController()