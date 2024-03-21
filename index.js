const apiURL = "https://opentdb.com/api.php?amount=10"
const btnIniciar = document.querySelector('.btn-iniciar');
const btnReset = document.querySelector('.btn-reset');
const btnValidar = document.querySelector('.btn-validar');
const selector_trivia_category = document.getElementById("trivia_category");
const selector_trivia_difficulty = document.getElementById("trivia_difficulty");
const selector_trivia_type = document.getElementById("trivia_type");
const contenedor_preguntas = document.getElementById("contenedor_preguntas");
const label_puntos = document.getElementById("puntos")
const divResultado = document.getElementById('resultado');
let puntos = 0; // Inicializar el contador de puntos


// Obtener Preguntas Trivia

function obtenerPreguntasTrivia(endpoint) {
    fetch(endpoint)
        .then(response => {
            console.log()
            // Verificar si la respuesta de la red fue exitosa
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Convertir la respuesta a formato JSON
            return response.json();
        })
        .then(data => {
            // Procesar los datos JSON
            console.log('Data fetched successfully:', data);
            // Aquí puedes procesar y utilizar los datos. Por ejemplo, imprimir las preguntas en consola.
            data.results.forEach((elemento, index) => {
                const preguntaDiv = document.createElement("div");
                preguntaDiv.classList.add("row");
                preguntaDiv.classList.add("mb-4");

                // const respuesta_correcta = elemento.correct_answer;
                // Mezclar respuestas correctas e incorrectas (spread sintax o sinstaxis de propagacion)
                const respuestas = [elemento.correct_answer, ...elemento.incorrect_answers];

                // Función para mezclar aleatoriamente las respuestas
                respuestas.sort();

                // Crear la estructura de la pregunta y respuestas
                let respuestasHTML = respuestas.map(respuesta => {
                    // Verificar si la respuesta es la correcta para añadir una clase especial
                    // const esCorrecta = respuesta === elemento.correct_answer;
                    if (elemento.correct_answer === respuesta) {
                        return `<li class="list-group-item respuesta-correcta">${respuesta}</li>`;

                    }
                    else {
                        return `<li class="list-group-item">${respuesta}</li>`;

                    }
                }).join('');

                console.log(respuestasHTML);

                // Modificación aquí para incluir un `div` con clase `col`
                preguntaDiv.innerHTML = `
                    <div class="col">
                        <p><span class="question">Question #${index + 1}:</span> ${elemento.question}</p>
                        <ul class="list-group">
                            ${respuestasHTML}
                        </ul>
                    </div>
                `;

                contenedor_preguntas.appendChild(preguntaDiv);
            });
        })
        .catch(error => {
            alert('Error fetching data: ' + error.message);
        });
}


// Iniciar Trivia
btnIniciar.addEventListener('click', function () {
    console.log('Iniciar Trivia');
    console.log(selector_trivia_category.value);
    let endpoint = apiURL;

    if (selector_trivia_category.value != "any") {
        endpoint += `&category=${selector_trivia_category.value}`
        // endpoint = endpoint + "&category=" + selector_trivia_category.value;
    }

    if (selector_trivia_difficulty.value != "any") {
        endpoint += `&difficulty=${trivia_difficulty.value}`
    }

    if (selector_trivia_type.value != "any") {
        endpoint += `&type=${trivia_type.value}`
    }
    console.log("endpoint: ", endpoint);
    obtenerPreguntasTrivia(endpoint)

    divResultado.style.display = 'block';

    // Aquí puedes añadir lo que quieras que suceda cuando se haga clic en Iniciar
});

// Añade el evento click al botón de reset
btnReset.addEventListener('click', function () {
    console.log('Resetear Trivia');
    contenedor_preguntas.innerHTML = "";
    divResultado.style.display = 'none';
    label_puntos.textContent = "";

});

// Añade el evento click al botón validar
btnValidar.addEventListener('click', function () {
    console.log('Validar Trivia');

    // Seleccionar todos los elementos de respuesta
    const respuestas = document.querySelectorAll('.list-group-item');

    // Inicializar contador de respuestas activas
    let contadorRespuestasActivas = 0;

    // Usar forEach para iterar sobre la NodeList directamente
    respuestas.forEach(respuesta => {
        if (respuesta.classList.contains('active')) {
            // Incrementar el contador si la respuesta tiene la clase 'active'
            contadorRespuestasActivas++;
        }
    });

    // Verificar si hay 10 respuestas activas
    if (contadorRespuestasActivas === 10) {
        // Lógica para validar respuestas
        respuestas.forEach(respuesta => {
            if (respuesta.classList.contains('active')) {
                if (respuesta.classList.contains('respuesta-correcta')) {
                    // Si la respuesta es correcta y está activa, sumar 100 puntos y poner en verde
                    puntos += 100;
                    respuesta.style.background = 'green';
                } else {
                    // Si la respuesta está activa pero no es correcta, poner en rojo
                    respuesta.style.background = 'red';
                }
            }
        });

        // Mostrar los puntos acumulados
        console.log('Puntos acumulados:', puntos);
        label_puntos.textContent = `${puntos}/1000`;
    } else {
        // Manejo de caso donde no todas las preguntas están respondidas
        
        var toastLiveExample = document.getElementById('liveToast');
        document.getElementById('texto_alerta').textContent ="Debes seleccionar una respuesta para cada pregunta antes de validar";
        var toast = new bootstrap.Toast(toastLiveExample);
        toast.show();
    }
});



// Evento click para poner activa la opción del usuario
contenedor_preguntas.addEventListener('click', function (evento) {

    // Verificar si el elemento clickeado es un elemento de lista (list-group-item)
    if (evento.target.classList.contains('list-group-item')) {

        // Obtener todos los elementos 'li' dentro del 'ul' padre del elemento clickeado
        console.log(evento.target);
        const todosLosItems = evento.target.parentNode.querySelectorAll('.list-group-item');

        // Quitar la clase 'active' de todos los elementos para resetear el estado
        todosLosItems.forEach(item => item.classList.remove('active'));

        // Añadir la clase 'active' al elemento clickeado
        evento.target.classList.add('active');
    }
});

// Cuando carga el dom 

document.addEventListener("DOMContentLoaded", function () {

    // Ocultar el div de resultado
    divResultado.style.display = 'none';

})
