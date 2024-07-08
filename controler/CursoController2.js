var Curso = require("../models/CursoModel")


class CursoController{
    async informacoesCurso(req,res){
        var idCurso = req.params.idCurso
        var curso = await Curso.informacoesCurso(idCurso, 0)

        if(idCurso == undefined){
            res.status(403);
            res.send("É necessário passar um id de curso"); 
        }else{
            if(curso == undefined){
                res.status(403);
                res.send("Curso não encontrado");
            }else{
                res.json(curso)
            }   
        }

          
    }


    async cadastrarCurso(req,res){
        if(req.session.user != undefined){
            var {tituloCurso, categoriaCurso, instrutorCurso, imagemCurso, descricaoCurso,
                requisitosCursos,conteudoCurso, miniDescricaoCurso, linkCurso, dataCriacaoCurso  } = req.body

            var campos = {"Título": tituloCurso, "Imagem":imagemCurso, "Descrição":descricaoCurso,
                "Requisitos":requisitosCursos, "Conteúdo":conteudoCurso, "Mini Descrição":miniDescricaoCurso, "Link":linkCurso};

            

                async function verificarCamposPreenchidos(campos) {
                    try {
                        for (let campo in campos) {
                            if (!campos[campo]) {
                                return { status: false, mensagem: `Você precisa preencher o campo: ${campo}` };
                            }
                        }
                        return { status: true };
                    } catch (error) {
                        return { status: false, mensagem: error.message };
                    }
                }

                async function verificarCursoIgual(tituloCurso) {
                    try {
                        var cursosIguais = await Curso.verificaCursoExistente(tituloCurso)

                            if(cursosIguais.cursosContagem > 0){
                                return { status: false, mensagem: "Um curso com o nome " + tituloCurso + " já existe." };
                            }
                       
                        return { status: true };

                    } catch (error) {
                        return { status: false, mensagem: error.message };
                    }
                }

               

                const camposPreenchidos = await verificarCamposPreenchidos(campos);

                if (!camposPreenchidos.status) {
                    return res.status(400).send(camposPreenchidos.mensagem);
                }


                const cursosIguais = await verificarCursoIgual(tituloCurso)

                if(!cursosIguais.status){
                    return res.status(400).send(cursosIguais.mensagem);
                } 

                var cadastraCurso = await Curso.cadastrarCurso(tituloCurso, categoriaCurso, instrutorCurso, imagemCurso, descricaoCurso,
                    requisitosCursos,conteudoCurso, miniDescricaoCurso, linkCurso, dataCriacaoCurso)

                if(cadastraCurso.status){ 
                    res.status(200)
                    res.send("tudo ok")
                }else{
                    res.status(406)
                    res.send("falha na operação "+ cadastraCurso.err)
                }
           
        }else{
            res.status(403)
            res.send("Usuário não logado")
        }

    }

    async exibirGerenciarMeusCursos(req,res){
        var idUsuario = req.session.user.id
        var tela = "gerenciar-cursos"
        var nomeUsuarioSession  = req.session.user.nome
        
        if(idUsuario == undefined){
            return res.status(403).send("Usuário não logado");
        }else{
            var instrutor = await Curso.instrutor(idUsuario)
            if(instrutor == undefined){
                return res.status(400).send("Usuário não é um instrutor");
 
            }else{
                var cursos = await Curso.cursosInstrutorGerenciar(instrutor.id)
                res.render("curso/gerenciarMeusCursos.ejs", {cursos:cursos, tela:tela, nomeUsuarioSession:nomeUsuarioSession})
            }
           
        }
    }

    
  async exibirGerenciarMeusCursosFiltro(req, res) {
    var idUsuario = req.session.user.id
    var tipoOrdenacao = req.query.tipoOrdenacao || null;
    var categoria = req.query.categoria || null;

    if(idUsuario == undefined){
        return res.status(403).send("Usuário não esta logado")

    }else{
        var instrutor = await Curso.instrutor(idUsuario)

        var cursos = await Curso.cursosInstrutorGerenciar(instrutor.id, tipoOrdenacao, categoria)
      
        res.json(cursos)
    }
  }

  async paginaCadastrarAula(req,res){
    var idUsuario = req.session.user.id
    var tituloCurso = req.params.tituloCurso
    var nomeUsuarioSession = "vivico"
    var curso = await Curso.informacoesCursoUnico(0, tituloCurso) 
    var aulas = await Curso.aulasCurso(curso.id)
    var tela = "cadastrar-aula"
    var instrutor = await Curso.instrutor(idUsuario)

    if(instrutor != undefined){
        if(curso.idInstrutor == instrutor.id){
            res.render("curso/adicionarAulas.ejs", {curso:curso, aulas:aulas, tela:tela, nomeUsuarioSession:nomeUsuarioSession })

        }else{
            return res.status(403).render('erro', { mensagem: "Acesso negado. Você não é o instrutor deste curso." });

        }
    }else{
        return res.status(403).render('erro', { mensagem: "Acesso negado. Você não é um instrutor" });

    }
    

  }

  async deletarAula(req,res){
    var idAula = req.params.idAula
    var idUsuario = req.session.user.id
    var curso = await Curso.informacoesCursoUnicoPorAula(idAula) 
    var instrutor = await Curso.instrutor(idUsuario)
    


    if(instrutor  != undefined){
        if(curso.idInstrutor == instrutor.id){

            if(idAula == undefined){
                return res.status(403).send("Você deve passar o id da aula que deseja deletar")
            } else{
                var result = await Curso.deletarAula(idAula)

                if(result.status){
                    return res.status(200).send("Aula deletada com sucesso!!")

                }else{
                    console.log(result.err)
                    return res.status(403).send("Houve um erro ao deletar a aula. Tente novamente mais Tarde!!")
                    
                }
            }
        }else{
            return res.status(403).send("Acesso negado. Você não é o instrutor deste curso." )

        }
    }else{
        return res.status(403).send("Acesso negado. Você não é um instrutor." )

    }
  }

  async cadastrarAula(req, res){
    var idUsuario = req.session.user.id
    var instrutor = await Curso.instrutor(idUsuario)

    if(instrutor != undefined){

            var {idCurso, tituloAula, descricaoAula, linkAula, dataCriacao, duracaoAula} = req.body

            var result = await Curso.cadastrarAula(idCurso, tituloAula, descricaoAula, linkAula, dataCriacao, duracaoAula)

            if(result.status){
                return res.status(200).send("Aula cadastrada com sucesso!!")

            }else{
                return res.status(403).send("Houve um erro ao cadastrar sua aula. Tente novamente mais tarde")

            }
    }else{
        return res.status(403).send("Acesso negado. Você não é um instrutor." )

    }

  }


  async editarAula(req, res){
    var idUsuario = req.session.user.id
    var instrutor = await Curso.instrutor(idUsuario)
    var idAula = req.params.idAula

    if(instrutor != undefined){
            var idAula = req.params.idAula
            var {idCurso, tituloAula, descricaoAula, linkAula, dataCriacao, duracaoAula} = req.body

            var result = await Curso.editarAula(idAula, idCurso, tituloAula, descricaoAula, linkAula, dataCriacao, duracaoAula)
        console.log(result)
            if(result.status){
                return res.status(200).send("Aula editada com sucesso!!")

            }else{
                return res.status(403).send("Houve um erro ao editar sua aula. Tente novamente mais tarde")

            }
    }else{
        return res.status(403).send("Acesso negado. Você não é um instrutor." )

    }

  }

  async recuperaAulaUnica(req,res){
    var idAula = req.params.idAula
    var result = await Curso.aulaUnica(idAula)
    if(idAula != undefined){
        if(result == undefined){
            return res.status(403).send("Nenhuma aula encontrada" )

        }else{
            return res.json(result)
        }

    }else{
        return res.status(403).send("É necessario passar um id" )

    }
        
  }

  async deletarCurso(req, res) {
    const idCurso = req.params.idCurso;
    const idUsuario = req.session.user.id;
    
    try {
        const curso = await Curso.informacoesCursoUnico(idCurso, 0);
        const instrutor = await Curso.instrutor(idUsuario);
        
        if (!idUsuario) {
            return res.status(403).send("É necessário estar logado para deletar um curso");
        }
        
        if (!instrutor) {
            return res.status(403).send("É necessário ser um instrutor para deletar um curso");
        }
        
        if (!curso) {
            return res.status(403).send("Este curso não existe");
        }
        
        if (curso.idInstrutor !== instrutor.id) {
            return res.status(403).send("Você não é o instrutor desse curso");
        }
        
        const result = await Curso.excluirCurso(idCurso);
        
        if (result.status) {
            return res.status(200).send("Curso deletado com sucesso!!");
        } else {
            return res.status(403).send("Houve um erro ao deletar este curso!");
        }
    } catch (error) {
        console.error("Erro ao deletar o curso:", error);
        return res.status(500).send("Erro interno do servidor");
    }
}

async pegarInformacoesCursoUnico(req,res){
    var idCurso = req.params.idCurso

    if(idCurso == undefined){
        res.status(403);
        res.send("É necessário passar um id de curso"); 
    }

    const curso = await Curso.informacoesCursoUnico(idCurso, 0);
    if(curso == undefined){
        res.status(403);
        res.send("Curso não encontrado");
    }else{
        res.json(curso)
    }   
    


}

async editarCurso(req, res) {
    var idUsuario = req.session.user.id
    var {tituloCurso, categoriaCurso, instrutorCurso, imagemCurso, descricaoCurso,
        requisitosCursos,conteudoCurso, miniDescricaoCurso, linkCurso, dataCriacaoCurso, idCurso  } = req.body

    var campos = {"Título": tituloCurso, "Imagem":imagemCurso, "Descrição":descricaoCurso,
        "Requisitos":requisitosCursos, "Conteúdo":conteudoCurso, "Mini Descrição":miniDescricaoCurso, "Link":linkCurso};

    

        async function verificarCamposPreenchidos(campos) {
            try {
                for (let campo in campos) {
                    if (!campos[campo]) {
                        return { status: false, mensagem: `Você precisa preencher o campo: ${campo}` };
                    }
                }
                return { status: true };
            } catch (error) {
                return { status: false, mensagem: error.message };
            }
        }

        async function verificarCursoIgual(tituloCurso) {
            try {
                var cursosIguais = await Curso.verificaCursoExistente(tituloCurso)
                    if(cursosIguais.cursosContagem > 0){
                        if(cursosIguais.titulo == tituloCurso){
                            return {status: true}
                        }else{
                            return { status: false, mensagem: "Um curso com o nome " + tituloCurso + " já existe." };

                        }
                    }
               
                return { status: true };

            } catch (error) {
                return { status: false, mensagem: error.message };
            }
        }

       
    try{
        const curso = await Curso.informacoesCursoUnico(idCurso, 0);
        const instrutor = await Curso.instrutor(idUsuario);
        console.log(idCurso)
        console.log(curso)

        if (!idUsuario) {
            return res.status(403).send("É necessário estar logado para alterar um curso");
        }
        
        if (!instrutor) {
            return res.status(403).send("É necessário ser um instrutor para alterar um curso");
        }
        
        if (!curso || idCurso == undefined) {
            return res.status(403).send("É necessario passar um curso valido");
        }
        
        if (curso.idInstrutor != instrutor.id) {
            return res.status(403).send("Você não é o instrutor desse curso");
        }
        const camposPreenchidos = await verificarCamposPreenchidos(campos);

        if (!camposPreenchidos.status) {
            return res.status(400).send(camposPreenchidos.mensagem);
        }
        const cursosIguais = await verificarCursoIgual(tituloCurso)

        if(!cursosIguais.status){
            return res.status(400).send(cursosIguais.mensagem);
        } 
        var result = await Curso.editarCurso(tituloCurso, categoriaCurso, instrutorCurso, imagemCurso, descricaoCurso,
            requisitosCursos,conteudoCurso, miniDescricaoCurso, linkCurso, dataCriacaoCurso, idCurso)

        if (result.status) {
            return res.status(200).send("Curso alterado com sucesso!!");
        } else {
            return res.status(403).send("Houve um erro ao alterar este curso!");
        }
    } catch (error) {
        console.error("Erro ao alterar o curso:", error);
        return res.status(500).send("Erro interno do servidor");
    }
}   

}

module.exports = new CursoController()