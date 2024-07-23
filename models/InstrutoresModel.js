var knex = require("../database/database")

class Instrutores{

   async cadastrarInstrutores(idUsuario, cpf, endereco, nomeCompleto, celular, dataDeNascimento){
        try {
            await database.insert({
                  idUsuario: idUsuario,
                  cpf: cpf,
                  endereco: endereco,
                  nomeCompleto: nomeCompleto,
                  celular: celular,
                  dataDeNascimento: dataDeNascimento
            }).table('instrutores')

            return {status:true}

        } catch (error) {
            console.log(error)
            return {status:false}
        }
            


    }
  

}

module.exports = new Instrutores()