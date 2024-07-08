const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs") 
const database = require("../database/database")

router.get("/cadastro", (req, res) => {
    res.render("login/cadastro.ejs")

})


router.post("/cadastrar/usuario", (req, res) => {
    const nomeUsuario = req.body.nomeUsuario;
    const emailUsuario = req.body.emailUsuario;
    const senhaUsuario = req.body.senhaUsuario;

    database.select().where({ email: emailUsuario }).table("usuarios").first()
    .then(user => {
        if (!user) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(senhaUsuario, salt);

            database.insert({
                nomeUsuario: nomeUsuario,
                email: emailUsuario,
                senha: hash
            }).into("usuarios")
            .then(() => {
                return database.select().where({ email: emailUsuario }).table("usuarios").first();
            })
            .then(newUser => {
                if (newUser) {
                    const validacaoDeSenha = bcrypt.compareSync(senhaUsuario, newUser.senha);
                    if (validacaoDeSenha) {
                        req.session.user = {
                            id: newUser.id,
                            email: newUser.email,
                            nome: newUser.nomeUsuario
                        };
                        res.redirect("/");
                    } else {
                        res.send("Senha errada");
                    }
                } else {
                    res.send("Email não cadastrado");
                }
            })
            .catch(err => {
                console.log(err);
                res.redirect("/f");
            });
        } else {
            res.send("Email já cadastrado");
        }
    })
    .catch(err => {
        console.log(err);
        res.redirect("/f");
    });
});


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



router.get("/logout", (req, res) => {
    req.session.user = undefined
    res.redirect("/")
})

module.exports = router;
