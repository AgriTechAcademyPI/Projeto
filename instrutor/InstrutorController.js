const express = require("express")
const router = express.Router()
const Instrutor = require("./Instrutor")
const idSessionUsuario = require("../middlewares/idSessionUsuario")
const User = require("../user/User")

router.get("/cadastro/instrutor", (req, res) =>{
    
    if(req.session.user != undefined){
        idUsuarioSession = req.session.user.id

        User.findOne({where: {id: idUsuarioSession}}).then(usuario =>{
            res.render("instrutores/cadastroInstrutor.ejs", {usuario: usuario})

        })

    }

    })

    
router.post("/cadastrarInstrutor", (req, res) =>{
    const idUsuario = req.body.idUsuario
    const nomeInstrutor = req.body.nomeInstrutor
    const cpfInstrutor = req.body.cpfInstrutor
    const enderecoInstrutor = req.body.enderecoInstrutor
    const contatoInstrutor = req.body.contatoInstrutor
    const dataNascimentoInstrutor = req.body.dataNascimentoInstrutor

    Instrutor.create({
        idUsuario: idUsuario,
        cpf: cpfInstrutor,
        endereco: enderecoInstrutor,
        nomeCompleto: nomeInstrutor,
        celular: contatoInstrutor,
        dataDeNascimento: dataNascimentoInstrutor
    }).then(() =>{
        res.redirect("/")
    }).catch((err) =>{
        res.send("/f")
    })

    req.session.authenticate
})

module.exports = router;
