"use client"
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [soupLetters, setSoupLetters] = useState("");
  const [words, setWords] = useState("");
  const [soupMatrix, setSoupMatrix] = useState([])
  const [foundWords, setFoundWords] = useState(null)
  const [notFoundWords, setNotFoundWords] = useState(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFoundWords(null)
    setNotFoundWords(null)
    setSoupMatrix([])
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
        Temple Soup
        <Image src="/soup.png" alt="Icono de una sopa" width={50} height={50} />
      </header>
      <section className="px-46 py-6">
        <form className="flex flex-col gap-2 mb-4" onSubmit={handleSubmit}>
          <label htmlFor="soupLetters">Ingresa las letras de la sopa de letras:</label>
          <textarea value={soupLetters} onChange={(e) => setSoupLetters(e.target.value)} id="soupLetters" rows="3" placeholder="A, E, I, O, U, Z..." className="border rounded border-gray-400 px-2 py-1.5 focus:border-gray-600 focus:border-2 outline-none"/>
          <label htmlFor="words">Ingresa las palabras que deseas buscar:</label>
          <input value={words} onChange={(e) => setWords(e.target.value)} id="words" type="text" placeholder="CASA, PERRO, GATO..." className="border rounded border-gray-400 px-2 py-1.5 focus:border-gray-600 focus:border-2 outline-none"/>
          <button type="submit" className="bg-blue-700 text-white px-4 py-1 rounded hover:bg-blue-400 transition-colors cursor-pointer">
            Buscar palabras
          </button>
        </form>
      </section>
      <main className="bg-blue-100">
        {error && <p className="text-red-600 text-center">{error}</p>}
        {foundWords && (
          <section className="p-6">
            <h2 className="text-xl font-semibold">Palabras encontradas:</h2>
            <ul className="list-disc ml-6 text-green-600">
              {foundWords.map(({word,positions}, index) => (
                <li key={index}>{word}</li>
              ))}
            </ul>
          </section>
        )}
        {notFoundWords && (
          <section className="p-6">
            <h2 className="text-xl font-semibold">Palabras no encontradas:</h2>
            <ul className="list-disc ml-6 text-red-600">
              {notFoundWords.map((word, index) => (
                <li key={index}>{word}</li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
      
  );
}
