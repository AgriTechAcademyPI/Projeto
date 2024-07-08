var knex = require("../database/database")

class Curso{
    async informacoesCurso(id, tituloCurso){
        try {
            var result = knex.select(
                "cursos.*",
                "cursos.id", 
                "cursos.titulo",
                "instrutores.nomeCompleto",
                knex.raw('(SELECT SUM(aulas.duracaoAula) FROM aulas WHERE aulas.idCurso = cursos.id) AS duracaoTotalCurso'), 
                knex.raw('COUNT(aulas.id) AS totalAulasCurso'),
                knex.raw('(SELECT COUNT(DISTINCT cursos_usuarios.idUsuario) FROM cursos_usuarios WHERE cursos_usuarios.idCurso = cursos.id) AS quantidadeAlunos'),
                knex.raw('COALESCE((SELECT MAX(aulas.dataCriacao) FROM aulas WHERE aulas.idCurso = cursos.id), cursos.dataCriacaoCurso) AS ultimaAtualizacao')
            )
            .innerJoin("instrutores", "instrutores.id", "cursos.idInstrutor")
            .leftJoin("aulas", "aulas.idCurso", "cursos.id")
            .table("cursos").where("cursos.id", id)

            if(tituloCurso == 0 && id){
                result.where("cursos.id", id).first()
            }
            if(tituloCurso && id == 0){
                result.where("cursos.titulo", tituloCurso).first()

            }

            const query = await result
            return query 
        } catch (error) {
            console.log(error)
            return []
            
        }
    }

    async cadastrarCurso(tituloCurso, categoriaCurso, instrutorCurso, imagemCurso, descricaoCurso,
        requisitosCursos,conteudoCurso, miniDescricaoCurso, linkCurso, dataCriacaoCurso){
        try {
           await knex.insert({
                titulo: tituloCurso,
                idCategoria: categoriaCurso,
                descricao: descricaoCurso,
                idInstrutor: instrutorCurso,
                imagemCurso: imagemCurso,
                linkCurso: linkCurso,
                dataCriacaoCurso: dataCriacaoCurso,
                descricaoMini:miniDescricaoCurso,
                requisitos:requisitosCursos,
                conteudoAprendizado:conteudoCurso
            }).table("cursos")
    
                return {status: true}
                
        } catch (error) {
            return {status: false, err:error} 
        }
    }

    async verificaCursoExistente(tituloCurso){
        try {
            var result = knex("cursos")
            .select("cursos.titulo")
            .count("* as cursosContagem")
            .where("cursos.titulo", tituloCurso)
            .first();
            return result
            
        } catch (error) {
            console.log(error)
            return[]
        }
    }

    async cursosInstrutorGerenciar(id, tipoOrdenacao, categoria){
        
        try {
            var result =  
                knex.select("cursos.*",
                              "instrutores.nomeCompleto as nomeInstrutor",
                              "cursos.idCategoria",
                              "cursos.idInstrutor",
                              "cursos.titulo",
                              
                              
             ).table("cursos")
            .innerJoin("instrutores", "instrutores.id", "cursos.idInstrutor" )
            .where("cursos.idInstrutor",id)

            if (categoria && categoria != 0) {
                result = result.andWhere("cursos.idCategoria", categoria);
            }

            if(tipoOrdenacao == 2){
                result = result.orderBy("cursos.titulo", "asc")

            }
            if(tipoOrdenacao == 3){
                result = result.orderBy("cursos.titulo", "desc")

            }

            const query = await result
            return query
         } catch (err) {
           console.log(err)  
           return []
         }
    }

    async instrutor(idUsuario){
        try {
            var result = knex.table("instrutores").select("instrutores.id", "instrutores.nomeCompleto")
            .where("instrutores.idUsuario", idUsuario).first()
            
            return result

        } catch (error) {
            console.log(error)
            return[]
        }

    }

    async aulasCurso(idCurso){
        try{
            var result = knex.table("aulas").select("aulas.idCurso","aulas.*")
            .where("aulas.idCurso", idCurso)

            return result

        }catch(error){
            console.log(error)
            return[]
        }

    }

    async informacoesCursoUnico(id, tituloCurso){
        try {
            var query =  knex.table("cursos").select("cursos.*", "cursos.titulo", "cursos.id")

            if(id == 0){
                query = query.where("cursos.titulo",tituloCurso).first()
            }

            if(tituloCurso == 0 ){
                query = query.where("cursos.id", id).first()

            }
            const result = await query
            return result

        } catch (error) {
            console.log(error)
            return[]
            
        }
    }
    
    async informacoesCursoUnicoPorAula(idAula){
        try {
            var result = knex.table('aulas')
            .select('aulas.id', 'cursos.idInstrutor', 'cursos.id as idCurso', 'cursos.titulo')
            .innerJoin('cursos', 'aulas.idCurso', 'cursos.id')
            .where('aulas.id', idAula)
            .first();

            return result

        } catch (error) {
            console.log(error)
            return[]
            
        }
    }

    async deletarAula(idAula){
        try {
            await knex.delete().table("aulas").where("id", idAula)
            return {status: true}
        } catch (error) {
            return {status: false, err:error}
        }
    }

    async cadastrarAula(idCurso, tituloAula, descricaoAula, linkAula, dataCriacao, duracaoAula){
        try {
            await knex.insert({
                idCurso: idCurso,
                tituloAula: tituloAula,
                descricaoAula: descricaoAula,
                linkAula: linkAula,
                dataCriacao: dataCriacao, 
                duracaoAula: duracaoAula
            }).table("aulas")

            return {status:true}
        } catch (error) {
            return{status:true, err:error}
            
        }
    }


    async editarAula(idAula, idCurso, tituloAula, descricaoAula, linkAula, dataCriacao, duracaoAula){
        try {
            await knex.update({
                idCurso: idCurso,
                tituloAula: tituloAula,
                descricaoAula: descricaoAula,
                linkAula: linkAula,
                dataCriacao: dataCriacao, 
                duracaoAula: duracaoAula
            }).table("aulas").where({id: idAula})

            return {status:true}
        } catch (error) {
            return{status:true, err:error}
            
        }
    }

    async aulaUnica(idAula){
        try {
            var result = await knex.select("aulas.*").table("aulas").where({id:idAula}).first()
            return result
        } catch (error) {
            console.log(error)
            return []
            
        }
    }

    async excluirCurso(idCurso){
        try {
            var result = await knex.delete().table("cursos").where("id", idCurso)
            return {status: true}
            
        } catch (error) {
            console.log(error)
            return{status: false, err: error}
            
        }
    }


    async editarCurso(tituloCurso, categoriaCurso, instrutorCurso, imagemCurso, descricaoCurso,
        requisitosCursos,conteudoCurso, miniDescricaoCurso, linkCurso, dataCriacaoCurso, idCurso){
        try {
           await knex.update({
                titulo: tituloCurso,
                idCategoria: categoriaCurso,
                descricao: descricaoCurso,
                idInstrutor: instrutorCurso,
                imagemCurso: imagemCurso,
                linkCurso: linkCurso,
                dataCriacaoCurso: dataCriacaoCurso,
                descricaoMini:miniDescricaoCurso,
                requisitos:requisitosCursos,
                conteudoAprendizado:conteudoCurso
            }).table("cursos").where("cursos.id", idCurso)
                return {status: true}

        } catch (error) {
            return {status: false, err:error} 
        }
    }
}

module.exports = new Curso()