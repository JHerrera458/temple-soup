"use client"
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [soupLetters, setSoupLetters] = useState("");
  const [words, setWords] = useState("");
  const [soupMatrix, setSoupMatrix] = useState(null)
  const [foundWords, setFoundWords] = useState(null)
  const [notFoundWords, setNotFoundWords] = useState(null)
  const [error, setError] = useState("")

  const isValidPosition = (row,col)=>{
    for (const wordObj of foundWords) {
      for (const [x, y] of wordObj.positions) {
        if (x === row && y === col) {
          return wordObj.color;
        }
      }
    }
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFoundWords(null)
    setNotFoundWords(null)
    setSoupMatrix(null)
    setError("")

    try {
      const res = await fetch("/api/soup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ soup: soupLetters, words: words })
      })
  
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }
    
      const data = await res.json()
      
      setFoundWords(data.foundWords)
      setNotFoundWords(data.notFoundWords)
      setSoupMatrix(data.soupMatrix)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <header className="flex items-center justify-center py-4 bg-blue-800 text-white font-bold text-4xl uppercase">
        <Image src="/soup.png" alt="Icono de una sopa" width={50} height={50} />
        <h1 className="tracking-wider">Temple Soup</h1>
        <Image src="/soup.png" alt="Icono de una sopa" width={50} height={50} />
      </header>
      <section className="px-4 pt-6">
        <form className="flex flex-col max-w-[60rem] mx-auto gap-2 mb-4" onSubmit={handleSubmit}>
          <label htmlFor="soupLetters">Ingresa las letras de la sopa de letras:</label>
          <textarea value={soupLetters} onChange={(e) => setSoupLetters(e.target.value)} id="soupLetters" rows="3" placeholder="A, E, I, O, U, Z..." className="border rounded border-gray-400 px-2 py-1.5 focus:border-gray-600 focus:border-2 outline-none"/>
          <label htmlFor="words">Ingresa las palabras que deseas buscar:</label>
          <input value={words} onChange={(e) => setWords(e.target.value)} id="words" type="text" placeholder="CASA, PERRO, GATO..." className="border rounded border-gray-400 px-2 py-1.5 focus:border-gray-600 focus:border-2 outline-none"/>
          <button type="submit" className="bg-blue-800 text-white px-4 py-1 rounded hover:bg-blue-700 transition-colors cursor-pointer">
            Buscar palabras
          </button>
        </form>
      </section>
      <main>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <div className="flex flex-col md:flex-row items-center md:justify-center">
          {soupMatrix && (
            <section className="grid grid-cols-14 gap-0.5 p-4 max-w-[60rem]">
              {
                soupMatrix.map((row, rowIndex) =>{
                  return row.map((letter, colIndex) => {
                    const color = isValidPosition(rowIndex, colIndex)
                    return(
                      <div
                        key={`${rowIndex}-${colIndex}`} 
                        className={`rounded aspect-square flex items-center justify-center border border-gray-100
                          ${color ? color : "bg-white"}`}
                      >
                        {letter}
                      </div>
                    )
                  })
                }
                )
              }
            </section>
          )}
          {foundWords && (
            <section className="p-6 self-start">
              <h2 className="text-xl font-semibold">Palabras encontradas:</h2>
              <ul className="space-y-1.5">
                {foundWords.map(({word, color}, index) => (
                  <li className={`px-2 py-1 max-w-32 rounded-xl ${color}`} key={index}>{word}</li>
                ))}
              </ul>
            </section>
          )}
          {notFoundWords && (
            <section className="p-6 self-start">
              <h2 className="text-xl font-semibold">Palabras no encontradas:</h2>
              <ul className="space-y-1.5">
                {notFoundWords.map((word, index) => (
                  <li className="bg-red-100 px-2 py-1 max-w-32 rounded-xl" key={index}>{word}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </div>
      
  );
}
