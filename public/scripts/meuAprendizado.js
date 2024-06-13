const elements = document.querySelectorAll('#descricaoP')
const LIMITE = 130

for (let p of elements) {
    const acimaLimite = p.innerText.length > LIMITE
    const pontosOuVazio = acimaLimite ? '...' : ''
    p.innerText = p.innerText.substring(0, LIMITE) + pontosOuVazio
}


function updateProgressBar(value) {
        var progressBar = document.getElementById('progressBar');
        progressBar.setAttribute('aria-valuenow', value);
        progressBar.style.width = value + '%';
        progressBar.innerHTML = value + '%';
}

function animateProgressBar() {
    var value = 0;
    var interval = setInterval(function() {
        if (value >= 50) {
            clearInterval(interval);
        } else {
            value++;
            updateProgressBar(value);
        }
    }, 10); 
}

function dropDownCategorias() {
    const selectElement = document.getElementById('selectCategorias');
    axios.get('http://localhost:8080/categorias')
        .then(function(response) {
            const categorias = response.data;
            categorias.forEach(function(categoria) {
                const option = document.createElement('option');
                option.value = categoria.id; 
                option.text = categoria.title; 
                selectElement.appendChild(option);
            });
        })
        .catch(function(error) {
            console.error('Erro ao buscar categorias:', error);
        });
}

function dropDownInstrutores() {
    const selectElement = document.getElementById('selectInstrutores');
    axios.get('http://localhost:8080/meuAprendizado/instrutores')
        .then(function(response) {
            const instrutores = response.data;
            instrutores.forEach(function(instrutor) {
                const option = document.createElement('option');
                option.value = instrutor.id; 
                option.text = instrutor.nomeCompleto; 
                selectElement.appendChild(option);
            });
        })
        .catch(function(error) {
            console.error('Erro ao buscar instrutores:', error);
        });
}


animateProgressBar();
dropDownCategorias();
dropDownInstrutores();




$("#botaoBuscar").click(function(){
    const tipoOrdenacao = $("#filtroCursoOrdem").val()
    const categoria = $("#selectCategorias").val()
    const progresso = $("#selectProgresso").val()
    const instrutor = $("#selectInstrutores").val()

    /* console.log(tipoOrdenacao)
    console.log(categoria)
    console.log(progresso)
    console.log(instrutor)
 */

    let url = 'http://localhost:8080/meuAprendizado/filtro';
    let params = [];

    if (tipoOrdenacao) params.push(`tipoOrdenacao=${tipoOrdenacao}`);
    if (categoria) params.push(`categoria=${categoria}`);
    if (instrutor) params.push(`instrutor=${instrutor}`);
    if (progresso) params.push(`progresso=${progresso}`);


    if (params.length > 0) {
        url += '?' + params.join('&');
    }

    axios.get(url)
        .then(response => {
            atualizarListaCursos(response.data);

        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
    
    })

      function requisicaoFiltros(tipoOrdenacao, categoria, instrutor){
            axios.get(`http://localhost:8080/meuAprendizado/filtro?tipoOrdenacao=${tipoOrdenacao}&categoria=${categoria}&instrutor=${instrutor}`)
        .then(function(response){
            atualizarListaCursos(response.data);

        }).catch(function(error){

        })
} 

function atualizarListaCursos(cursos) {
    var elemento = document.getElementById('testeee');
    
    
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild)
    } 

    if(cursos <= 0){
        var cursoElement = document.createElement('div');
        cursoElement.innerHTML = `<h3 style="margin: 0px 0px 10px 10px"> Nenhum resultado encontrado </h3>`
        elemento.appendChild(cursoElement)

    }
       
    cursos.forEach(curso => {
        var cursoElement = document.createElement('div');
        cursoElement.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'align-self-center', 'curso');
        cursoElement.setAttribute('data-ultimo-acesso', curso.ultimoAcesso || '');
        cursoElement.innerHTML = `
            <div class="container containerPlantacaoDentro text-center ">
            <div class="row ">
                <img class="imagem" src="${curso.imagemCurso}" alt="">
            </div>
            <div class="row">
                <h3>${curso.titulo} </h3>
            </div>
            <div class="row">
                <p>${curso.nomeInstrutor}</p>
            </div>
                <div class="progress-container">
                    <div class="progress-bar" id="progressBar" aria-valuenow="50"></div>
                </div>         
            <div class="row align-items-start">
                <div class="col-6">
                    <img src="/img/icons/estrela.png" class="img-fluid estrela" alt="estrela">
                </div>
                <div class="col-6">
                    <a class=" btn btn-warning btn-sm botao" href="/assistir/curso/${curso.titulo}">Ver Mais</a>
                </div>
            </div>
            <div class="row">
                <p class="avaliacao">Deixe uma avaliação</p>
            </div>
        </div>
     </div>`;

    elemento.appendChild(cursoElement)
            
        });

    
}




        


