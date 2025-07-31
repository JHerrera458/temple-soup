import "./globals.css";

export const metadata = {
  title: "Temple Soup",
  description: "Crea una sopa de letras y busca las palabras que están (o no están) en ella",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
