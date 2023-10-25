const express = require("express")
const router = express.Router()
const Curso = require("./Curso")
const User = require("../user/User")
const Instrutor = require("../instrutor/Instrutor")
const Categoria = require("./Categoria")

router.get("/cadastro/curso", (req,res) =>{
    if(req.session.user != undefined){
        idUsuarioSession = req.session.user.id

        Categoria.findAll().then(categorias =>{
            User.findOne({where: {id: idUsuarioSession}}).then(usuario =>{
                Instrutor.findOne({where: {idUsuario: usuario.id}}).then(instrutor =>{
    
                    res.render("curso/criarCurso.ejs", {usuario: usuario, instrutor: instrutor, categorias: categorias})
                })
                
    
            })
        })
       

    }


})

router.post("/cadastrarCurso", (req, res) =>{
    const tituloCurso = req.body.tituloCurso
    const descricaoCurso = req.body.descricaoCurso
    const precoCurso = req.body.precoCurso
    const instrutorCurso = req.body.instrutorCurso
    const imagem = req.body.imagemCurso
    const link = req.body.linkCurso
    const categoria = req.body.categoria

    Curso.create({
        titulo: tituloCurso,
        descricao: descricaoCurso,
        preco: precoCurso,
        idInstrutor: instrutorCurso,
        imagemCurso: imagem,
        linkCurso: link,
        idCategoria: categoria 


    }).then(() => {
        res.send("cadastrado")
    }).catch((err) =>{
        res.send(err)
    })

})

router.get("/assistir/curso", (req, res) =>{
    res.render("curso/assistirCurso.ejs")
})


module.exports = router
