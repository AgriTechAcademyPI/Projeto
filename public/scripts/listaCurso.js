
function limitaTexto(){
    const elements = document.querySelectorAll('#descricaoP')
    const LIMITE = 130
        for (let p of elements) {
            const acimaLimite = p.innerText.length > LIMITE
            const pontosOuVazio = acimaLimite ? '...' : ''
            p.innerText = p.innerText.substring(0, LIMITE) + pontosOuVazio
        }

}

limitaTexto()

console.log("teste")

document.addEventListener('DOMContentLoaded', function() {
    const courses = document.querySelectorAll('#botaoVerMais');
    
    courses.forEach(course => {
        course.addEventListener('click', function() {
            const courseId = this.getAttribute('data-id');
            axios.get("http://localhost:8080/informacoes-curso/"+courseId)
            .then(function(data){
                var curso = data.data
                $("#tituloCursoModal").html(curso.titulo)
                $("#linkVideoModal").attr("src", curso.linkCurso);
                $("#descricaoMiniModal").html(curso.descricaoMini);
                $("#criadoPorModal").html("Criado por: "+ curso.nomeCompleto);
                $("#ultimaAtualizacaoModal").html("Última atualização: " + formataDataISO(curso.ultimaAtualizacao));
                /*$("#notaAvaliacaoModal").html("");
                $("#imgAvaliacaoModal").attr("src", curso.linkCurso);
                $("#quantidadeAvaliacoesModal").html(`(${teste} avaliações)`);*/
                $("#quantidadeAlunosModal").html(curso.quantidadeAlunos + " alunos");
                $("#horasCursoModal").html(curso.duracaoTotalCurso +" horas de vídeo sob demanda") 
                $("#requisitosModal").html(curso.requisitos);
                $("#descricaoCompletaModal").html(curso.descricao);
                $("#conteudoAprendizadoModal").html(curso.conteudoAprendizado);
                $("#informacoesConteudoCursoModal").html(`${curso.totalAulasCurso} aulas • Duração total: ${curso.duracaoTotalCurso} horas`)

            }).catch(function(error){
                console.log("Erro ao carregar o ver mais"+ error)
            }) 
            
            $("#adicionarMeusCursos").click(function(){
            
                var dadosObterCurso = {
                    idCurso: courseId,
                    dataAquisicao: dataAtualIso(),
                    ultimoAcesso: dataAtualIso()
                }

                axios.post('http://localhost:8080/obter-curso', dadosObterCurso)
                .then(function(response){
                    Swal.fire({
                        title: "Curso adquirido com sucesso!!! ",
                        text: "Deseja ir para a tela meus cursos?",
                        icon: "success",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Sim",
                        cancelButtonText: "Não"
                      }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = 'http://localhost:8080/meuaprendizado';

                        }
                      });
                }).catch(function(error){
                    console.log("Houve um erro ao obter o curso" + error)
                })

            })
        });
    });
            
});

    
function formataDataISO(dataISO){

    const data = new Date(dataISO);
    
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear().toString();
    
    const dataFormatada = `${dia}/${mes}/${ano}`;
    
    return dataFormatada
    
}

function dataAtualIso(){
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const horas = String(dataAtual.getHours()).padStart(2, '0');
    const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
    const segundos = String(dataAtual.getSeconds()).padStart(2, '0');

    const dataFormatada = `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;

    return dataFormatada
}