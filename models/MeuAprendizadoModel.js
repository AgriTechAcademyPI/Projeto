var knex = require("../database/database")

class MeuAprendizado{

    /* 
    status curso-->
    1 - começar
    2- em andamento
    3 - finalizado
    */
   
    async adquireCurso(idCurso, idUsuario ,dataAquisicao, ultimoAcesso){
        try{
            await knex.insert({idCurso, idUsuario, dataAquisicao, statusCurso:1, ultimoAcesso }).table("cursos_usuarios")
        }catch(err){
            console.log(err)
            return err
        }
    }

    async cursos(id, tipoOrdenacao, categoria, instrutor, progresso){
        
        try {
            var result =  
                knex.select("cursos.*",
                              "instrutores.nomeCompleto as nomeInstrutor",
                              "cursos_usuarios.ultimoAcesso",
                              "cursos_usuarios.dataAquisicao",
                              "cursos.idCategoria",
                              "cursos.idInstrutor",
                              "cursos.titulo",
                              "cursos_usuarios.statusCurso"
                              
             ).table("cursos_usuarios")
            .innerJoin("cursos", "cursos.id", "cursos_usuarios.idCurso")
            .innerJoin("usuarios", "usuarios.id", "cursos_usuarios.idUsuario")
            .innerJoin("instrutores", "instrutores.id", "cursos.idInstrutor" )
            .where("cursos_usuarios.idUsuario",id)

            if (categoria && categoria != 0) {
                result = result.andWhere("cursos.idCategoria", categoria);
            }

            if (instrutor && instrutor != 0) {
                result = result.andWhere("cursos.idInstrutor", instrutor);
            }

            if (progresso && progresso != 0) {
                result = result.andWhere("cursos_usuarios.statusCurso", progresso);
            }


            if(tipoOrdenacao == 1){
                result = result.orderBy("cursos_usuarios.ultimoAcesso", "desc")
            }

            if(tipoOrdenacao == 2){
                result = result.orderBy("cursos_usuarios.dataAquisicao", "desc")
                
            }
            if(tipoOrdenacao == 3){
                result = result.orderBy("cursos.titulo", "asc")

            }
            if(tipoOrdenacao == 4){
                result = result.orderBy("cursos.titulo", "desc")

            }

            const query = await result
            return query
         } catch (err) {
           console.log(err)  
           return []
         }
    }

    async listaInstrutoresCursosUsuarios(idUsuario){
        try {
            var result = await knex.select("instrutores.nomeCompleto", "instrutores.id")
            .table("cursos_usuarios")
            .distinct()
            .innerJoin("cursos","cursos.id", "cursos_usuarios.idCurso" )
            .innerJoin("instrutores","instrutores.id ", "cursos.idInstrutor" )
            .innerJoin("usuarios","usuarios.id", "instrutores.idUsuario" )  
            .where("cursos_usuarios.idUsuario", idUsuario)

            return result

        } catch (error) {
            console.log(error)  
            return []
        }
    }

}

module.exports = new MeuAprendizado()