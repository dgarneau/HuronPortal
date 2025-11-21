import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Huron Portal - Gestion des Machines CNC",
  description: "Système de gestion des machines CNC pour Huron",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.Node;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased bg-secondary-50 text-secondary-900">
        {children}
      </body>
    </html>
  );
}
