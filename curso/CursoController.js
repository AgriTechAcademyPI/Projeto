const express = require("express")
const router = express.Router()
const database = require("../database/database")
var page = require("../models/navBarModel")
var Curso = require("../models/CursoModel")
var Middleware = require("../controler/Middleware")



router.get("/cadastro/curso/:idCurso?",Middleware.AutenticacaoInstrutor, (req, res) => {
    if (req.session.user != undefined) {
        var idUsuarioSession = req.session.user.id
        var nomeUsuarioSession = req.session.user.nome
        var tela = "cadastrar-curso"
        
         database.select().table("categorias").then(categorias =>{
         database.select(["usuarios.nomeUsuario as nomeUsuario", "instrutores.id as idInstrutor", "usuarios.id as idUsuario" ])
         .table("usuarios")
         .innerJoin("instrutores", "instrutores.idUsuario", "usuarios.id").where("usuarios.id", idUsuarioSession).first().then(instrutor =>{
            res.render("curso/criarCurso.ejs", {instrutor: instrutor, categorias: categorias,  })


         }).catch(err =>{
            console.log("categoiria" +err)
         })
         }).catch(err =>{
            console.log("usuarios" + err)
        })
    }

})

router.get("/assistir/curso/:nomeCurso", (req, res) => {
    var nomeCurso = req.params.nomeCurso


    database.select(["cursos.*","cursos.id as idDoCurso", "instrutores.*", "usuarios.*", "categorias.*" ]).table("cursos")
    .innerJoin("instrutores", "instrutores.id", "cursos.idInstrutor")
    .innerJoin("usuarios", "usuarios.id", "instrutores.idUsuario")
    .innerJoin("categorias", "categorias.id", "cursos.idCategoria")
    .where("cursos.titulo", nomeCurso)
    .first().then(curso =>{
        database.select(["aulas.*", "aulas.id as idAula", "aulas_concluidas.id as idAulaConcluida" , "aulas_concluidas.concluida" ])
        .table("aulas")
        .leftJoin("cursos", "cursos.id", "aulas.idCurso")
        .leftJoin("aulas_concluidas", "aulas_concluidas.idAula", "aulas.id")
        .where("aulas.idCurso", curso.idDoCurso).then(aulas =>{
            database.select(["perguntas.*", "usuarios.*"]).table("perguntas")
            .innerJoin("cursos", "cursos.id", "perguntas.idCurso")
            .innerJoin("usuarios", "usuarios.id", "perguntas.idUsuario").then(perguntas =>{

                const queryTotalAulas = `SELECT COUNT(*) AS total_aulas FROM aulas WHERE idCurso = ?`;
                const queryAulasAssistidas = `SELECT COUNT(*) AS aulas_assistidas FROM aulas_concluidas WHERE idCurso = ?`;

                            database.raw(queryTotalAulas, [curso.idDoCurso])
                                .then(resultsTotalAulas => {
                                    const total_aulas = resultsTotalAulas[0][0].total_aulas;

                                    database.raw(queryAulasAssistidas, [curso.idDoCurso])
                                        .then(resultsAulasAssistidas => {
                                            const aulas_assistidas = resultsAulasAssistidas[0][0].aulas_assistidas;
                                            const porcentagem_assistida = (aulas_assistidas / total_aulas) * 100;

                                            const queryDuracaoTotal = `SELECT SUM(duracaoAula) AS duracao_total FROM aulas WHERE idCurso = ?`;
                                            database.raw(queryDuracaoTotal, [curso.idDoCurso])
                                                .then(resultsDuracaoTotal => {
                                                    const duracao_total = resultsDuracaoTotal[0][0].duracao_total;

                                                    // Consulta para calcular a duração total das aulas assistidas
                                                    const queryDuracaoAssistida = `SELECT SUM(aulas.duracaoAula) AS duracao_assistida FROM aulas_concluidas INNER JOIN aulas ON aulas_concluidas.idAula = aulas.id WHERE aulas_concluidas.idCurso = ?`;
                                                    database.raw(queryDuracaoAssistida, [curso.idDoCurso])
                                                        .then(resultsDuracaoAssistida => {
                                                            const duracao_assistida = resultsDuracaoAssistida[0][0].duracao_assistida;


                                                            const progresso = {
                                                                total_aulas: total_aulas,
                                                                aulas_assistidas: aulas_assistidas,
                                                                porcentagem_assistida: (aulas_assistidas / total_aulas) * 100,
                                                                duracao_total: duracao_total,
                                                                duracao_assistida: duracao_assistida
                                                            };

                                            res.render("curso/assistirCurso.ejs", { curso: curso, aulas: aulas, perguntas: perguntas, progresso: progresso });
                                        })
                                    })
                                })
                            })

        
            }).catch(err=>{
                console.log("err" + perguntas)
            })

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
        const nomeUsuarioSession = req.session.user.nome
        var tela = "cursos"
        
        database.select("cursos.*", "instrutores.nomeCompleto").table("cursos")
        .innerJoin("instrutores" ,"cursos.idInstrutor", "instrutores.id").then(cursos =>{
            database.select().table("usuarios").where("id", idUsuarioSession).first().then(usuario =>{
                database.select().table("categorias").then(categorias =>{
                    
                    var sessao = 1
                    res.render("curso/listasCursos.ejs", { cursos: cursos, usuario: usuario, sessao: sessao, categorias: categorias, nomeUsuarioSession:nomeUsuarioSession, tela:tela })
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
                res.render("curso/listasCursos.ejs", { cursos: cursos, sessao: sessao, categorias: categorias ,tela:tela})

            }).catch(err =>{
                console.log("categorias 2 err" + err)
            })
        }).catch(err =>{
            console.log("cursos 2 err" + err)
        })

    }
})

router.get("/cursos/meuscursos", (req, res) =>{
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


/* router.post("/adicionarAula", (req, res) =>{
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


}) */

router.get("/assistir/:tituloCurso/:tituloAula", (req, res) =>{
    var tituloCurso = req.params.tituloCurso
    var tituloAula = req.params.tituloAula


    database.select(["cursos.*","cursos.id as idDoCurso", "instrutores.*", "usuarios.*", "categorias.*","aulas.*" ])
    .table("aulas")
    .innerJoin("cursos", "cursos.id", "aulas.idCurso")
    .innerJoin("instrutores", "instrutores.id", "cursos.idInstrutor")
    .innerJoin("usuarios", "usuarios.id", "instrutores.idUsuario")
    .innerJoin("categorias", "categorias.id", "cursos.idCategoria")
    .where(function() {
        this.where("aulas.tituloAula", "LIKE", `%${tituloAula}%`)
            .andWhere("cursos.titulo", "LIKE", `%${tituloCurso}%`);
    })
    .first().then(aula=>{

        database.select(["aulas.*", "aulas.id as idAula", "aulas_concluidas.id as idAulaConcluida" , "aulas_concluidas.concluida" ,"cursos.titulo as tituloCurso" ])
        .table("aulas")
        .leftJoin("cursos", "cursos.id", "aulas.idCurso")
        .leftJoin("aulas_concluidas", "aulas_concluidas.idAula", "aulas.id")
        .where("aulas.idCurso", aula.idCurso).then(aulas =>{
            

                database.select(["perguntas.*", "usuarios.*"]).table("perguntas")
                .innerJoin("cursos", "cursos.id", "perguntas.idCurso")
                .innerJoin("usuarios", "usuarios.id", "perguntas.idUsuario")
                .where("perguntas.idAula", aula.id )
                .then(perguntas =>{
    
                    const queryTotalAulas = `SELECT COUNT(*) AS total_aulas FROM aulas WHERE idCurso = ?`;
                    const queryAulasAssistidas = `SELECT COUNT(*) AS aulas_assistidas FROM aulas_concluidas WHERE idCurso = ?`
                    database.raw(queryTotalAulas, [aula.idDoCurso])

                        .then(resultsTotalAulas => {
                            const total_aulas = resultsTotalAulas[0][0].total_aulas
                            database.raw(queryAulasAssistidas, [aula.idDoCurso])

                                .then(resultsAulasAssistidas => {
                                    const aulas_assistidas = resultsAulasAssistidas[0][0].aulas_assistidas;
                                    const porcentagem_assistida = (aulas_assistidas / total_aulas) * 100
                                    const queryDuracaoTotal = `SELECT SUM(duracaoAula) AS duracao_total FROM aulas WHERE idCurso = ?`;
                                    database.raw(queryDuracaoTotal, [aula.idDoCurso])

                                        .then(resultsDuracaoTotal => {
                                            const duracao_total = resultsDuracaoTotal[0][0].duracao_total
                                            // Consulta para calcular a duração total das aulas assistidas
                                            const queryDuracaoAssistida = `SELECT SUM(aulas.duracaoAula) AS duracao_assistida FROM aulas_concluidas INNER JOIN aulas ON aulas_concluidas.idAula = aulas.id WHERE aulas_concluidas.idCurso = ?`;
                                            database.raw(queryDuracaoAssistida, [aula.idDoCurso])

                                                .then(resultsDuracaoAssistida => {
                                                    const duracao_assistida = resultsDuracaoAssistida[0][0].duracao_assistida
                                                    const progresso = {
                                                        total_aulas: total_aulas,
                                                        aulas_assistidas: aulas_assistidas,
                                                        porcentagem_assistida: (aulas_assistidas / total_aulas) * 100,
                                                        duracao_total: duracao_total,
                                                        duracao_assistida: duracao_assistida
                                                    }
                                    res.render("curso/assistirAula2.ejs", { aula:aula , aulas: aulas, perguntas: perguntas, progresso: progresso });
                                })
                            })
                        })
                    })
    
            
                }).catch(err=>{
                    console.log("err" + perguntas)
                }) 

        

        }).catch(err =>{
            console.log("Erro ao carregar Aulas" + err)
        })
      
   
    }).catch(err =>{
        console.log("Erro de aula" + err)
    })


})

router.post("/perguntarAulaCurso", (req, res) =>{
    var tituloPergunta = req.body.tituloPergunta
    var descricaoPergunta = req.body.descricaoPergunta
    var dataPergunta = req.body.dataPergunta
    var idCurso = req.body.idCurso
    var idUsuarioLogado = req.session.user.id

    database.insert({
        idCurso: idCurso,
        idUsuario: idUsuarioLogado,
        tituloPergunta: tituloPergunta,
        descricaoPergunta: descricaoPergunta,
        dataPergunta: dataPergunta
    }).table("perguntas").then(() =>{
        res.redirect("/cursos")
    }).catch(err =>{
        console.log("Erro insert perguntas" + err)
    })

})

router.post("/salvaVideoAssistido", (req,res) =>{
    var idUsuario = req.session.user.id
    var idAula = req.body.idAula
    var idCurso = req.body.idCurso
    var concluida = 1
    var dataConclusao = req.body.dataConclusao
    const paginaAnterior = req.headers.referer
    database.insert({
        idUsuario: idUsuario,
        idAula: idAula,
        idCurso: idCurso,
        concluida: concluida,
        dataConclusao: dataConclusao
    }).table("aulas_concluidas").then(() =>{
        res.redirect(paginaAnterior)
    }).catch(err =>{
        console.log("Erro insert aulas_concluidas" + err)
    })
    
})

router.post("/removeVideoAssistido", (req,res) =>{
   var idAulaConcluida =  req.body.idAulaConcluida
   const paginaAnterior = req.headers.referer

   database("aulas_concluidas")
   .where('id', idAulaConcluida)
   .delete().then(() =>{
        res.redirect(paginaAnterior)
    }).catch(function(error) {
        console.error('Error deleting data:', error);
    });

})



module.exports = router
