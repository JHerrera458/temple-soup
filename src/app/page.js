import Image from "next/image";

export default function Home() {
  return (
    <div>
      <header className="flex items-center justify-center py-4 bg-blue-800 text-white font-bold text-4xl uppercase">
        <Image src="/soup.png" alt="Icono de una sopa" width={50} height={50} />
        Temple Soup
        <Image src="/soup.png" alt="Icono de una sopa" width={50} height={50} />
      </header>
      <main className="bg-blue-100">
        hola
      </main>
    </div>
      
  );
}
