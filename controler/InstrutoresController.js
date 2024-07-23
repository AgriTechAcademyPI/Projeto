var Instrutores = require("../models/CategoriasModel")
var Usuarios = require("../models/UsuariosModel")

class InstrutoresController{
    
    async carregaPaginaCadastroInstrutores(req, res){

        if(req.session.user == undefined){
            console.log("É necessario estar logado")
        }

        const idUsuarioSession = req.session.user.id

        const usuario = await Usuarios.pegaInformacoesUsuario(idUsuarioSession)
        console.log(usuario)
        res.render("instrutores/cadastroInstrutor.ejs", {usuario: usuario})

    }

    async cadastrarInstrutor(req, res){
        const idUsuario = req.body.idUsuario
        const nomeInstrutor = req.body.nomeInstrutor
        const cpfInstrutor = req.body.cpfInstrutor
        const enderecoInstrutor = req.body.enderecoInstrutor
        const contatoInstrutor = req.body.contatoInstrutor
        const dataNascimentoInstrutor = req.body.dataNascimentoInstrutor

        var cadastroInstrutores =
        await Instrutores.cadastrarInstrutores(idUsuario, cpfInstrutor, enderecoInstrutor,
        nomeInstrutor, contatoInstrutor, dataNascimentoInstrutor)

        if(cadastroInstrutores.status){
            console.log("deucerto")
            res.redirect("/cursos")
            req.session.authenticate


        }else{
            console.log("deu ruim")
        }


    }
    
}

module.exports = new InstrutoresController()