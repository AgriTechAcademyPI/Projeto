const express = require("express")
const router = express.Router()
const database = require("../database/database")

router.get("/cadastro/curso", (req, res) => {
    if (req.session.user != undefined) {
        idUsuarioSession = req.session.user.id

         database.select().table("categorias").then(categorias =>{
         database.select(["usuarios.nomeUsuario as nomeUsuario", "instrutores.id as idInstrutor", "usuarios.id as idUsuario" ])
         .table("usuarios")
         .innerJoin("instrutores", "instrutores.idUsuario", "usuarios.id").where("usuarios.id", idUsuarioSession).first().then(instrutor =>{
            res.render("curso/criarCurso.ejs", {instrutor: instrutor, categorias: categorias })


         }).catch(err =>{
            console.log("categoiria" +err)
         })
         }).catch(err =>{
            console.log("usuarios" + err)
        })
    }

})

router.post("/cadastrarCurso", (req, res) => {
    const tituloCurso = req.body.tituloCurso
    const descricaoCurso = req.body.descricaoCurso
    const precoCurso = req.body.precoCurso
    const instrutorCurso = req.body.instrutorCurso
    const imagem = req.body.imagemCurso
    const categoria = req.body.categoria
    const link = req.body.linkCurso
    const tituloAulaCurso = req.body.tituloAulaCurso
    const descricaoAulaCurso = req.body.descricaoAulaCurso
    const duracaoAulaCurso = req.body.duracaoAulaCurso
    const dataCriacaoCurso = req.body.dataCriacaoCurso


    database.insert({
        titulo: tituloCurso,
        descricao: descricaoCurso,
        preco: precoCurso,
        idInstrutor: instrutorCurso,
        imagemCurso: imagem,
        linkCurso: link,
        idCategoria: categoria,
        tituloAulaCurso: tituloAulaCurso,
        descricaoAulaCurso: descricaoAulaCurso, 
        duracaoAulaCurso: duracaoAulaCurso, 
        dataCriacaoCurso: dataCriacaoCurso}).table("cursos").then(()=>{
            res.redirect("/cursos")

        }).catch(err =>{
            console.log(err)
        })

})

router.get("/assistir/curso/:nomeCurso", (req, res) => {
    var nomeCurso = req.params.nomeCurso


    database.select(["cursos.*","cursos.id as idDoCurso", "instrutores.*", "usuarios.*", "categorias.*" ]).table("cursos")
    .innerJoin("instrutores", "instrutores.id", "cursos.idInstrutor")
    .innerJoin("usuarios", "usuarios.id", "instrutores.idUsuario")
    .innerJoin("categorias", "categorias.id", "cursos.idCategoria")
    .where("cursos.titulo", nomeCurso)
    .first().then(curso =>{
        database.select(["aulas.*"]).table("aulas")
        .innerJoin("cursos", "cursos.id", "aulas.idCurso")
        .where("aulas.idCurso", curso.idDoCurso).then(aulas =>{
            console.log(aulas)
            res.render("curso/assistirCurso.ejs", {curso: curso, aulas: aulas})

        }).catch(err =>{
            console.log("Erro ao carregar Aulas" + err)
        })
      
   
    }).catch(err =>{
        console.log("Erro de curso" + err)
    })

})

router.get("/cursos", (req, res) => {

    if (req.session.user != undefined) {
        const idUsuarioSession = req.session.user.id

        database.select().table("cursos").then(cursos =>{
            database.select().table("usuarios").where("id", idUsuarioSession).first().then(usuario =>{
                database.select().table("categorias").then(categorias =>{
                    var sessao = 1
                    res.render("curso/listaCursos.ejs", { cursos: cursos, usuario: usuario, sessao: sessao, categorias: categorias })
                }).catch(err =>{
                    console.log("categorias erro" + err)
                })

            }).catch(err =>{
                console.log("user erro" + err)
            })
        }).catch(err =>{
            console.log("curso erro" + err)
        })


    } else if(req.session.user == undefined) {

        database.select().table("cursos").then(cursos =>{
            database.select().table("categorias").then(categorias =>{
                var sessao = 0
                res.render("curso/listaCursos.ejs", { cursos: cursos, sessao: sessao, categorias: categorias })

            }).catch(err =>{
                console.log("categorias 2 err" + err)
            })
        }).catch(err =>{
            console.log("cursos 2 err" + err)
        })

    }
})

router.get("/cursos/:categoria", (req, res)=>{
    const categoria = req.params.categoria
    if (req.session.user != undefined) {
        const idUsuarioSession = req.session.user.id

        database.select("cursos.titulo as tituloCurso", "cursos.descricao as descricaoCurso", 
        "cursos.preco as precoCurso","cursos.imagemCurso as imagemCurso", "categorias.title as tituloCategoria")
        .table("cursos")
        .innerJoin("categorias", "categorias.id", "cursos.idCategoria")
        .where("categorias.title", categoria).then(cursos =>{
            database.select().table("usuarios").where("id", idUsuarioSession).first().then(usuario =>{
                database.select().table("categorias").then(categorias =>{
                    var sessao = 1
            res.render("curso/listaCursoFiltrado.ejs", { cursos: cursos, usuario: usuario, sessao: sessao, categorias:categorias})

                }).catch(err =>{
                    console.log("categorias erro" + err)
                })

            }).catch(err =>{
                console.log("usuario erro" + err)
            })

        }).catch(err =>{
            console.log("cursos erro" + err)
        })


    } else if(req.session.user == undefined) {

        database.select("cursos.titulo as tituloCurso", "cursos.descricao as descricaoCurso", 
        "cursos.preco as precoCurso","cursos.imagemCurso as imagemCurso", "categorias.title as tituloCategoria")
        .table("cursos")
        .innerJoin("categorias", "categorias.id", "cursos.idCategoria")
        .where("categorias.title", categoria).then(cursos =>{
            database.select().table("categorias").then(categorias =>{
                var sessao = 0
                res.render("curso/listaCursoFiltrado.ejs", { cursos: cursos, sessao: sessao, categorias: categorias })
            }).catch(err =>{
                console.log("Categorias err" + err)
            })

        }).catch(err =>{
            console.log("cursos err" + err)
        })
        
    }

})

router.post("/filtrarCursos",(req, res) =>{
    const idCategoria = req.body.categorias
    res.redirect("/cursos/"+ idCategoria)


})

router.get("/curso/meuscursos", (req, res) =>{
    const idUsuarioSession = req.session.user.id

    database.select().table("cursos")
    .innerJoin("instrutores", "instrutores.id", "cursos.idInstrutor")
    .innerJoin("usuarios", "usuarios.id", "instrutores.idUsuario")
    .where("instrutores.idUsuario", idUsuarioSession).then(meuscursos =>{
        
        res.render("curso/meusCursos.ejs", {meuscursos: meuscursos})

    }).catch(err =>{
        console.log("Meus Cursos" + err)
    })       
})


router.get("/curso/cadastraraula/:nomeCurso", (req, res) =>{
    var nomeCurso = req.params.nomeCurso

    database.select().table("cursos")
    .where("cursos.titulo" ,nomeCurso)
    .then(curso =>{
        database.select().table("aulas")
        .where("aulas.idCurso", curso[0].id)
        .then(aulas =>{
             res.render("curso/adicionarAulas.ejs", {curso:curso, aulas:aulas}) 
 
        }).catch(err =>{
            console.log("erro aula"+ err)
        })
    
    }).catch(err =>{
        console.log("Erro ao carregar curso" + err)
    })

})


router.post("/adicionarAula", (req, res) =>{
    var tituloAula = req.body.tituloAula
    var idCurso = req.body.idCurso
    var descricaoAula = req.body.descricaoAula
    var linkAula = req.body.linkAula
    var dataCriacao = req.body.dataCriacao
    var duracaoAula = req.body.duracaoAula
    

    database.insert({
        idCurso:idCurso,
        tituloAula: tituloAula,
        descricaoAula: descricaoAula,
        linkAula: linkAula,
        dataCriacao: dataCriacao,
        duracaoAula: duracaoAula
        
    }).table("aulas").then(() =>{
        res.redirect("/curso/meuscursos")
    }).catch(err =>{
        console.log("Erro insert Aulas" + err)
    })


})

router.get("/assistir/:tituloCurso/:tituloAula", (req, res) =>{
    var tituloCurso = req.params.tituloCurso
    var tituloAula = req.params.tituloAula


    database.select(["cursos.*","cursos.id as idDoCurso", "instrutores.*", "usuarios.*", "categorias.*" ]).table("cursos")
    .innerJoin("instrutores", "instrutores.id", "cursos.idInstrutor")
    .innerJoin("usuarios", "usuarios.id", "instrutores.idUsuario")
    .innerJoin("categorias", "categorias.id", "cursos.idCategoria")
    .where("cursos.titulo", tituloCurso)
    .first().then(curso =>{

        database.select(["aulas.*"]).table("aulas")
        .innerJoin("cursos", "cursos.id", "aulas.idCurso")
        .where("aulas.idCurso", curso.idDoCurso).then(aulas =>{
            database.select().table("aulas")
            .where("aulas.tituloAula","=", tituloAula)
            .andWhere("aulas.idCurso","=", curso.idDoCurso)
            .first().then(aula=>{
                res.render("curso/assistirAula.ejs", {curso: curso, aulas: aulas, aula:aula})
 

            }).catch(err =>{
                console.log("erro aula"+ err)
            }) 
        

        }).catch(err =>{
            console.log("Erro ao carregar Aulas" + err)
        })
      
   
    }).catch(err =>{
        console.log("Erro de curso" + err)
    })


})


module.exports = router
