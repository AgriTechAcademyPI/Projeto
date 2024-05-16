var knex = require("../database/database")

class MeuAprendizado{

    /* 
    status curso-->
    0 - começar
    1- em andamento
    2 - finalizado
    */
    async adquireCurso(idCurso, idUsuario ,dataAquisicao){
        try{
            await knex.insert({idCurso, idUsuario, dataAquisicao, statusCurso:0}).table("cursos_usuarios")
        }catch(err){
            console.log(err)
            return err
        }
    }

    async cursos(id){
        try {
            var result =  
            await knex.select("cursos.*",
                              "instrutores.nomeCompleto as nomeInstrutor"
                              
             ).table("cursos_usuarios")
            .innerJoin("cursos", "cursos.id", "cursos_usuarios.idCurso")
            .innerJoin("usuarios", "usuarios.id", "cursos_usuarios.idUsuario")
            .innerJoin("instrutores", "instrutores.id", "cursos.idInstrutor" )
            .where("cursos_usuarios.idUsuario",id)

            return result
         } catch (err) {
           console.log(err)  
           return []
         }
    }

}

module.exports = new MeuAprendizado()