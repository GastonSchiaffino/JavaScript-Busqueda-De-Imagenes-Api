const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registrosPorPagina= 30;
let totalPaginas;
let iterador;
let paginaActual = 1;

document.addEventListener('DOMContentLoaded', ()=>{
    formulario.addEventListener('submit', validarFormulario);
})

function validarFormulario(e){
    e.preventDefault();

    const terminoBusqueda= document.querySelector('#termino').value;

    //Validacion
    if(terminoBusqueda === '') {
        mostrarAlerta('Debes agregar algún término de búsqueda');
        return;
    }

    //Busqueda atraves de la API 
    buscarImagenes();
}

function mostrarAlerta(mensaje){
    const existeAlerta = document.querySelector('.bg-red-100');

    if(!existeAlerta){
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','rounded','max-w-lg','mx-auto','mt-6','text-center');

        alerta.innerHTML = `
            <strong class="font-bold"> ERROR:</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;

        formulario.appendChild(alerta);

        setTimeout(()=>{
            alerta.remove();
        },3000);
    }
}

function buscarImagenes(){

    const termino= document.querySelector('#termino').value;
    const key = '28941576-e0b53185b0d54ce2ff682aacb';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    fetch(url)
        .then(respuesta => respuesta.json()) 
        .then(resultados => {
            totalPaginas = calcularPaginas(resultados.totalHits);
            mostrarImagenes(resultados.hits);
        })
}

//Paginas de la web
function calcularPaginas(total){
    return parseInt(Math.ceil(total/registrosPorPagina));
}

//Generador que va a registrar la cantidad de elementos de acuerdo a las paginas
function *crearPaginador(total){
    for(let i = 1; i<=total; i++){
        yield i;
    }
}
//Paginas de la web

function mostrarImagenes(imagenes){
    limpiarHTML(resultado);
    //Iterar sobre el arreglo de imagenes y construir HTML
    imagenes.forEach( imagen => {
        const { previewURL,likes,views,largeImageURL } = imagen;

        resultado.innerHTML += `
        <div class="1/2 md:w-1/4 lg:w-1/5 p-3 mb-4">
            <div class="bg-white">
                <img class="w-full" src="${previewURL}">
                <div class="p-4">
                    <p class="font-bold"> ${likes} <span class="font-light"> Me gusta </span></p>
                    <p class="font-bold"> ${views} <span class="font-light"> Vistas</span></p>

                    <a 
                    class="block w-full bg-yellow-400 hover:bg-yellow-300 text-base text-center rounded mt-5 p-1"
                    href="${largeImageURL}" target="_blank" rel="noopener noreferrer"
                    >
                    Ver Imagen
                    </a>

                </div>
            </div>
        </div>
        `;
    });

    //Limpiar el paginador previo
    limpiarHTML(paginacionDiv);
    //Generar el nuevo HTML
    imprimirPaginador();
}

function limpiarHTML(div){
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }
}

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);
    while(true){
        const {value,done} = iterador.next();
        if(done) return;
        //Caso contrario, genera un botón por cada elemento en el generador
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente','bg-yellow-400','px-4','py-1','mr-2','font-bold','mb-2','uppercase','rounded');
        paginacionDiv.appendChild(boton);

        boton.onclick = () => {
            paginaActual = value;
            buscarImagenes();
        }
    }
    
}