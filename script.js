let squaresContainer = document.getElementById('squaresContainer');
let squares = []; // Lista de todos los cuadrados
let hoveredSquare = null; // Cuadrado sobre el que está el cursor

// Cargar cuadrados desde localStorage
function loadSquares() {
    const squaresData = JSON.parse(localStorage.getItem('squares')) || [];
    squaresData.forEach(squareData => {
        createSquare(squareData.hasImage, squareData.url, squareData.imgSrc);
    });
}

// Crear un nuevo cuadrado
function createSquare(hasImage = false, url = '', imgSrc = '') {
    let square = document.createElement('div');
    square.classList.add('square');
    square.dataset.hasImage = hasImage; // Indica si tiene una imagen
    square.dataset.url = url; // URL asociada a la imagen

    // Crear una nueva fila si es necesario
    if (squares.length % 4 === 0) {
        var row = document.createElement('div');
        row.classList.add('row');
        squaresContainer.appendChild(row);
    } else {
        var row = squaresContainer.lastChild; // Usar la última fila existente
    }
    row.appendChild(square);
    squares.push(square);

    // Cargar la imagen si existe
    if (hasImage && imgSrc) {
        let img = document.createElement('img');
        img.src = imgSrc;
        square.appendChild(img);

        // Añadir evento de click para la imagen
        img.addEventListener('click', function() {
            window.open(url, '_blank');
        });
    }

    // Evento para detectar cuando el cursor está sobre un cuadrado
    square.addEventListener('mouseenter', function() {
        hoveredSquare = square; // Guardar el cuadrado sobre el que está el cursor
    });

    // Evento para detectar cuando el cursor sale del cuadrado
    square.addEventListener('mouseleave', function() {
        if (hoveredSquare === square) {
            hoveredSquare = null; // Limpiar la referencia si el cursor sale del cuadrado
        }
    });

    // Evento para eliminar el cuadrado con clic derecho
    square.addEventListener('contextmenu', function(event) {
        event.preventDefault(); // Prevenir el menú contextual por defecto
        removeSquare(square);
    });
}

// Función para eliminar un cuadrado y actualizar localStorage
function removeSquare(square) {
    let index = squares.indexOf(square);
    if (index > -1) {
        squares.splice(index, 1);
        square.parentElement.removeChild(square);
        saveSquares(); // Guardar el estado actualizado en localStorage
    }
}

// Guardar los cuadrados en localStorage
function saveSquares() {
    const squaresData = squares.map((square) => {
        return {
            hasImage: square.dataset.hasImage === "true",
            url: square.dataset.url || '',
            imgSrc: square.querySelector('img') ? square.querySelector('img').src : ''
        };
    });
    localStorage.setItem('squares', JSON.stringify(squaresData));
}

// Evento de teclado para agregar imágenes y URL
document.addEventListener('keydown', function(event) {
    // Añadir imagen al cuadrado sobre el que está el cursor con la tecla 'F'
    if (event.key === 'f' || event.key === 'F') {
        if (hoveredSquare && hoveredSquare.dataset.hasImage === "false") {
            let imageUrl = prompt("Introduce la URL de la imagen:");
            if (imageUrl) {
                let img = document.createElement('img');
                img.src = imageUrl;
                hoveredSquare.appendChild(img);
                hoveredSquare.dataset.hasImage = "true";

                // Añadir evento de click para la imagen
                img.addEventListener('click', function() {
                    window.open(hoveredSquare.dataset.url, '_blank');
                });
            }
        } else {
            alert("Selecciona un cuadrado vacío antes de añadir una imagen.");
        }
    }

    // Añadir una URL a la imagen con la tecla 'M'
    if ((event.key === 'm' || event.key === 'M') && hoveredSquare) {
        if (hoveredSquare.dataset.hasImage === "true") {
            let url = prompt("Introduce la URL que quieres enlazar a la imagen:");
            if (url) {
                hoveredSquare.dataset.url = url;
                alert("URL añadida correctamente.");
            }
        } else {
            alert("Añade primero una imagen con la tecla F antes de enlazar una URL.");
        }
    }

    // Añadir más cuadrados con la tecla 'K'
    if (event.key === 'k' || event.key === 'K') {
        createSquare(false, '', ''); // Añadir cuadrado vacío
    }

    // Guardar cuadrados en localStorage después de cada modificación
    saveSquares();
});

// Cargar los cuadrados desde localStorage al cargar la página
loadSquares();
