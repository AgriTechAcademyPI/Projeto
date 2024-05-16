var knex = require("../database/database")

class Perfil{

    async perfilUsuario(id){
        try{
            var perfil = 
            await knex.select("usuarios.nomeUsuario as nomeUsuario",
                              "usuarios.imagemUsuario as imagemUsuario",
                              "usuarios.email as emailUsuario",
                              "instrutores.nomeCompleto as nomeCompletoInstrutor",
                              "instrutores.dataDeNascimento as DataDeNascimentoInstrutor",
                              "instrutores.celular as celularInstrutor",
                              "instrutores.endereco",
                              "instrutores.cpf"
                            )
                .table("usuarios")
                .leftJoin("instrutores","instrutores.idUsuario", "usuarios.id")
                .where("usuarios.id", id)

            return perfil
            
        }catch(err){
            console.log(err)
            return []
        }
    }

    async findPerfilUsuarioByID(id){
        try {
            var perfil = await knex.select("usuarios.*").table("usuarios").where("usuarios.id", id)
            return perfil
        } catch (err) {
            res.status(403)
            return []
        }
    }

    async findPerfilInstrutorByID(id){
        try {
            var perfil = await knex.select("instrutores.*").table("instrutores")
                        .where("instrutores.idUsuario", id)
            return perfil
        } catch (err) {
            res.status(403)
            return []
        }
    }

    async editarUsuarioPerfil(id, nomeUsuario, imagemUsuario, bibliografia, twitter, facebook, linkedin, github){
        
        var usuarioPerfil = await this.findPerfilUsuarioByID(id)

        if(usuarioPerfil != undefined){

            var editarUsuarioPerfil = {
                nomeUsuario: nomeUsuario,
                imagemUsuario:imagemUsuario,
                bibliografia: bibliografia,
                twitter: twitter,
                facebook: facebook,
                linkedin: linkedin,
                github: github
            }
            
            try {
                await knex.update(editarUsuarioPerfil).where({id:id}).table("usuarios")
                return {status: true}
            } catch (err) {
                return {status: true, err:err}

            }

        }else{
            return {status: false, err: "usuario nao existe"}

        }
    }

    async editarInstrutorPerfil(id, cpf, endereco, nomeCompleto, celular, dataDeNascimento){ //finalizar
        
        var instrutorPerfil = await this.findPerfilInstrutorByID(id)

        if(instrutorPerfil != undefined){

            var editarInstrutorPerfil = {
                cpf: cpf, 
                endereco: endereco,
                nomeCompleto: nomeCompleto,
                celular: celular,
                dataDeNascimento: dataDeNascimento
            }
            
            try {
                await knex.update(editarInstrutorPerfil).where({idUsuario:id}).table("instrutores")
                return {status: true}
            } catch (err) {
                return {status: true, err:err}

            }

        }else{
            res.status(403)
            res.json("Falha ao encontrar Instrutor")

        }


    }




}

module.exports = new Perfil()