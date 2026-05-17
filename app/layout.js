export const metadata = {
  title: "Lizzy",
  description: "Lizzy AI"
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
    }
