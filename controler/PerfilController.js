var Perfil = require("../models/Perfil")

class PerfilController{
    
    async perfilUsuario(req, res){
      var id = req.session.user.id
      if(req.session.user != undefined){
        var perfil = await Perfil.perfilUsuario(id)
        res.json(perfil)
      }else{
        res.status(403) 
        res.json({err: "Usuário fora de Sessão"})
        return
      }
    }

    async perfilUsuarioByID(req, res){

      if(req.session.user != undefined){
        
        var id = req.session.user.id
        var perfilUsuario = await Perfil.findPerfilUsuarioByID(id)
        res.json(perfilUsuario)

      }else{
        res.status(403) 
        res.json({err: "Usuário fora de Sessão"})
        return
      }
    }

    async perfilInstrutorByID(req, res){

      if(req.session.user != undefined){
        
        var id = req.session.user.id
        var perfilInstrutor = await Perfil.findPerfilInstrutorByID(id)
        if (!perfilInstrutor || (Array.isArray(perfilInstrutor) && perfilInstrutor.length === 0)) {
          res.status(404);
          res.send("usuario nao é instrutor");
        }else {
          res.json(perfilInstrutor);
        }

        

      }else{
        res.status(403) 
        res.json({err: "Usuário fora de Sessão"})
        return
      }
    }

    async editarUsuarioPerfil(req, res){

      if(req.session.user != undefined){

        var id = req.session.user.id
        var {nomeUsuario, email, bibliografia, twitter, facebook, linkedin, github, profissao} = req.body
        var result = await Perfil.editarUsuarioPerfil(id, nomeUsuario, bibliografia, email, twitter, facebook, linkedin, github, profissao) //retorna o json


        if(result != undefined){
            if(result.status){ //le o json true(deu certo)
                res.status(200)
                res.send("tudo ok")
            }else{
                res.status(406)
                res.send("falha na operação")
            }
        }else{
            res.status(406)
                res.send("usuario nao encontrado")
            
        }  
      }else{
        res.status(403)
        res.send("Usuário não logado")
      }
    }

    async editarInstrutorPerfil(req, res){
      if(req.session.user != undefined){

      var id = req.session.user.id
      var {cpf, endereco, nomeCompleto, celular, dataDeNascimento} = req.body
      var result = await Perfil.editarInstrutorPerfil(id, cpf, endereco, nomeCompleto, celular, dataDeNascimento) //retorna o json
        console.log(result)

      if(result != undefined){
          if(result.status){ //le o json true(deu certo)
              res.status(200)
              res.send("tudo ok")
          }else{
              res.status(406)
              res.send("falha na operação")
          }
      }else{
          res.status(406)
              res.send("instrutor nao encontrado")
          
      }
    }else{
      res.status(403)
      res.send("Usuário não logado")
    }
  }

async perfilUsuario(req,res){
  res.render("perfil/perfil.ejs")
}



}

module.exports = new PerfilController()