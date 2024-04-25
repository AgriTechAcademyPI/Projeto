const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs") 
const database = require("../database/database")

router.get("/cadastro", (req, res) => {
    res.render("login/cadastro.ejs")

})

router.post("/cadastrar/usuario", (req, res) =>{
    var nomeUsuario = req.body.nomeUsuario
    var emailUsuario = req.body.emailUsuario
    var senhaUsuario = req.body.senhaUsuario

    database.select().where({email: emailUsuario}).table("usuarios").first().then(user =>{
        console.log(user)
        if(!user){
            var salt = bcrypt.genSaltSync(10)
            var hash = bcrypt.hashSync(senhaUsuario, salt)

          database.insert([
            {nomeUsuario: nomeUsuario,
            email: emailUsuario,
            senha: hash
            }]).into("usuarios")
            .then(() =>{
                res.redirect("/")
            }).catch((err) =>{
                res.redirect("/f")
            })
        }else{
             res.send("email ja cadastrado") 
        }
    }).catch(err =>{
        console.log(err)
    })

})

router.get("/login", (req, res) =>{
    res.render("login/login.ejs")
})

router.post("/autenticarLogin", (req, res) =>{
    var emailLogin = req.body.emailLogin
    var senhaLogin = req.body.senhaLogin


    database.select().where({email: emailLogin}).table("usuarios").first().then(user =>{
        if(user){
            var validacaoDeSenha = bcrypt.compareSync(senhaLogin, user.senha)

            if(validacaoDeSenha){
                    req.session.user = {
                    id: user.id,
                    emai: user.email,
                    nome: user.nomeUsuario
                }

                res.redirect("/")
            
            }else{
                res.send("senha errada")
            }
        }else{
            res.send("email nao cadastrado")
        }
    }).catch(err =>{
        console.log("*********"+ err)
    })

})



router.get("/carregarPerfil", (req,res) =>{
    if(req.session.user != undefined){
        idUsuarioSession = req.session.user.id
            User.findOne({where: {id: idUsuarioSession}}).then(usuario =>{
                Instrutor.findOne({where: {idUsuario: idUsuarioSession}}).then(instrutor =>{
                    res.render("perfil/perfil.ejs", {usuario: usuario, instrutor: instrutor})

                })
        })
                
    }

})




router.get("/logout", (req, res) => {
    req.session.user = undefined
    res.redirect("/")
})

module.exports = router;
