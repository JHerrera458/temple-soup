import { NextResponse } from "next/server";

export async function POST(request) {
    // 1. Extraemos de la request las palabras y la sopa de letras
    const {soup, words} = await request.json()

    // 2. Definimos el tamaño de la sopa de letras
    const filas = 14;
    const columnas = 14;

    // 3. A partir de los strings separados por comas, creamos arreglos de las letras y las palabras eliminando espacios en blanco y convirtiendo a mayuscula
    const soupArray = soup.toUpperCase().split(" ").join("").split(",")
    const wordsArray = words.toUpperCase().split(" ").join("").split(",")

    // 3.1 Confirmamos que el tamaño de la sopa de letras sea correcto
    if (soupArray.length !== filas * columnas) {
        return NextResponse.json({
            error: "El tamaño de la sopa de letras no coincide con el tamaño especificado."
        }, {status: 400})
    }

    // 4. Creamos una matriz vacia del tamaño filas x columnas (14x14)
    let soupMatrix = new Array (filas)
    for (let i = 0; i < filas; i++) {
        soupMatrix[i] = new Array(columnas);
    }

    // 5. Rellenamos la matriz con las letras de la sopa de letras
    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            soupMatrix[i][j] = soupArray[i * columnas + j]
        }
    }

    // 6. Creamos un arreglo con las posibles direcciones de busqueda
    const directions = [
        [0, 1], // derecha
        [0, -1], // izquierda
        [1, 0], // abajo
        [-1, 0], // arriba
        [1, 1], // diagonal ↘
        [1, -1], // diagonal ↙
        [-1, 1], // diagonal ↗
        [-1, -1] // diagonal ↖
    ]

    // 7. Creamos una función que recibe una palabra y la matriz donde deseamos buscar
    function buscarPalabraEnMatriz (palabra, matriz) {
        // 7.1 Recorremos la matriz
        for (let i = 0; i < filas; i++) {
          for (let j = 0; j < columnas; j++) {
            // 7.2 Recorremos la lista de direcciones para buscar la palabra en cada dirección desde la posición actual
            for (const [dx, dy] of directions) {
                const positions = buscarDesde(i, j, dx, dy, palabra, matriz)
                if (positions) {
                    return positions // 7.r Si la palabra se encuentra en la dirección actual, retornamos las posiciones. De lo contrario seguimos en la siguiente dirección.
                }
            }
          }
        }
        // 7.r2 Si la palabra no es encontrada en ninguna dirección, retornamos nulo.
        return null
    }

    // 8. Creamos una función que recibe la posición inicial, una dirección, la palabra que deseamos buscar y la matriz.
    function buscarDesde (x, y, dx, dy, palabra, matriz) {
        const positions = []
        // 8.1 Recorremos la longitud de la palabra
        for (let k = 0; k < palabra.length; k++) {
            // 8.2 Definimos la posición actual en la matriz en función de la posición inicial (x,y) y la dirección (dx,dy).
            const nx = x + (dx * k)
            const ny = y + (dy * k)

            // 8.3 Verificamos si la posición actual está fuera de los límites de la matriz.
            if (nx < 0 || ny < 0 || nx >= filas || ny >= columnas) {
                return null
            }

            // 8.4 Comparamos la letra de la posición actual de la matriz con la letra de la palabra que deseamos buscar.
            if (matriz[nx][ny] !== palabra[k]) {
                return null
            }

            // 8.5 Si la letra es igual, agregamos la posición actual al arreglo de posiciones.
            positions.push([nx, ny])
        }

        // 8.r Si en ningún punto del ciclo se retorna false, significa que la palabra se encontró, por lo que retornamos las posiciones de la palabra encontrada.
        return positions
    }

    // 9. Creamos dos arreglos para almacenar palabras encontradas y no encontradas.
    const foundWords = []
    const notFoundWords = []

    // 10. Iteramos la lista de palabras y usamos nuestra función para buscar cada palabra en la matriz.
    for (const palabra of wordsArray) {
        const posiciones = buscarPalabraEnMatriz(palabra, soupMatrix)
        if (posiciones) {
            foundWords.push({
                word: palabra,
                positions: posiciones
            })
        } else {
            notFoundWords.push(palabra)
        }
    }
    
    return NextResponse.json({foundWords, notFoundWords, soupMatrix});
}