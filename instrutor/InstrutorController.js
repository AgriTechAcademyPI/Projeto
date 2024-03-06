const express = require("express")
const router = express.Router()
const Instrutor = require("./Instrutor")
const User = require("../user/User")
const database = require("../database/database")


router.get("/cadastro/instrutor", (req, res) =>{
    
    if(req.session.user != undefined){
        idUsuarioSession = req.session.user.id

        database.select().where({id: idUsuarioSession}).table("usuarios").first().then(usuario =>{
            console.log(usuario)
            res.render("instrutores/cadastroInstrutor.ejs", {usuario: usuario})


        }).catch(err =>{

        })

       /* 
        ##### Sequelize
       User.findOne({where: {id: idUsuarioSession}}).then(usuario =>{
            res.render("instrutores/cadastroInstrutor.ejs", {usuario: usuario})

        }) */

    }else{
        res.send("É necessario ter um cadastro para se tornar instrutor")
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
        res.redirect("/cursos")
    }).catch((err) =>{
        res.send("/f")
    })

    req.session.authenticate
})

module.exports = router;
