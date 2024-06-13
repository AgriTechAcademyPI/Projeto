var Curso = require("../models/CursoModel")

class CursoController{
    async informacoesCurso(req,res){
        var idCurso = req.params.idCurso
        var curso = await Curso.informacoesCurso(idCurso)

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

}

module.exports = new CursoController()