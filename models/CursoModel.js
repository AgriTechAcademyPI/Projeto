var knex = require("../database/database")

class Curso{
    async informacoesCurso(id){
        try {
            var result = knex.select(
                "cursos.*", 
                "instrutores.nomeCompleto",
                knex.raw('(SELECT SUM(aulas.duracaoAula) FROM aulas WHERE aulas.idCurso = cursos.id) AS duracaoTotalCurso'), 
                knex.raw('COUNT(aulas.id) AS totalAulasCurso'),
                knex.raw('(SELECT COUNT(DISTINCT cursos_usuarios.idUsuario) FROM cursos_usuarios WHERE cursos_usuarios.idCurso = cursos.id) AS quantidadeAlunos'),
                knex.raw('COALESCE((SELECT MAX(aulas.dataCriacao) FROM aulas WHERE aulas.idCurso = cursos.id), cursos.dataCriacaoCurso) AS ultimaAtualizacao')
            )
            .innerJoin("instrutores", "instrutores.id", "cursos.idInstrutor")
            .innerJoin("aulas", "aulas.idCurso", "cursos.id")
            .table("cursos")
            .where("cursos.id", id)
            .first()
        
            return result
        } catch (error) {
            console.log(error)
            return []
            
        }
    }

}

module.exports = new Curso()