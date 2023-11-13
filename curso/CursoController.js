const express = require("express")
const router = express.Router()
const Curso = require("./Curso")
const User = require("../user/User")
const Instrutor = require("../instrutor/Instrutor")
const Categoria = require("./Categoria")
const { where } = require("sequelize")

router.get("/cadastro/curso", (req, res) => {
    if (req.session.user != undefined) {
        idUsuarioSession = req.session.user.id

        Categoria.findAll().then(categorias => {
            User.findOne({ where: { id: idUsuarioSession } }).then(usuario => {
                Instrutor.findOne({ where: { idUsuario: usuario.id } }).then(instrutor => {

                    res.render("curso/criarCurso.ejs", { usuario: usuario, instrutor: instrutor, categorias: categorias })
                })


            })
        })


    }


})

router.post("/cadastrarCurso", (req, res) => {
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
        res.redirect("/cursos")
    }).catch((err) => {
        res.send(err)
    })

})

router.get("/assistir/curso/:nomeCurso", (req, res) => {
    var nomeCurso = req.params.nomeCurso
    Curso.findOne({ where: { titulo: nomeCurso } }).then(curso => {
        Instrutor.findOne({ where: { id: curso.idInstrutor } }).then(instrutor => {
            User.findOne({ where: { id: instrutor.idUsuario } }).then(usuario => {
                Categoria.findOne({ where: { id: curso.idCategoria } }).then(categoria => {
                    res.render("curso/assistirCurso.ejs", { curso: curso, instrutor: instrutor, usuario: usuario, categoria: categoria })

                })
            })
        })
    })
})

router.get("/cursos", (req, res) => {

    if (req.session.user != undefined) {
        const idUsuarioSession = req.session.user.id

        Curso.findAll().then(cursos => {
            User.findOne({ where: { id: idUsuarioSession } }).then(usuario => {
                Categoria.findAll().then(categorias =>{
                    var sessao = 1
                    res.render("curso/listaCursos.ejs", { cursos: cursos, usuario: usuario, sessao: sessao, categorias: categorias })
                })
                 
            })


        })

    } else if(req.session.user == undefined) {

        Curso.findAll().then(cursos => {
            Categoria.findAll().then(categorias =>{
                var sessao = 0
                res.render("curso/listaCursos.ejs", { cursos: cursos, sessao: sessao, categorias: categorias })
           
            })
              


        })
    }
})

router.get("/cursos/:categoria", (req, res)=>{
    const categoria = req.params.categoria
    if (req.session.user != undefined) {
        const idUsuarioSession = req.session.user.id

        Categoria.findOne({where:{title: categoria}}).then(categoria =>{
            Curso.findAll({where:{idCategoria:categoria.id }}).then(cursos => {
                User.findOne({ where: { id: idUsuarioSession } }).then(usuario => {
                    Categoria.findAll().then(categorias =>{
                        var sessao = 1
                        res.render("curso/listaCursoFiltado.ejs", { cursos: cursos, usuario: usuario, sessao: sessao, categoria: categoria, categorias:categorias })
                    
                    })
                       
                     
                })
    
    
            })
        })
       

    } else if(req.session.user == undefined) {

        Categoria.findOne({where:{title: categoria }}).then(categoria =>{
            Curso.findAll({where:{idCategoria: categoria.id}}).then(cursos => {
                Categoria.findAll().then(categorias =>{

                var sessao = 0
                res.render("curso/listaCursoFiltrado.ejs", { cursos: cursos, sessao: sessao, categoria: categoria, categorias: categorias })
            })
        })
        })
        
    }

})

router.post("/filtrarCursos",(req, res) =>{
    const idCategoria = req.body.categorias
    res.redirect("/cursos/"+ idCategoria)


})



module.exports = router
