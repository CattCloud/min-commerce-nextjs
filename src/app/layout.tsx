import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; 

import Header from "@/app/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Min-Commerce Next.js",
  description: "Migración de Min-Commerce a Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* El Header se mostrará en todas las páginas */}
        <Header />
        {/* Aquí se renderizará el contenido de cada página (page.tsx) */}
        <main className="bg-bg-body min-h-screen px-4">
          {children}
        </main>
      </body>
    </html>
  );
}