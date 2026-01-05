import type { Metadata } from "next";
import "./css/globals.css";
import "./css/layout.css";
import { ConditionalHeader } from "./components/ConditionalHeader";

export const metadata: Metadata = {
  title: "AVANS Smart Studycoach",
  description: "Smart Study Coach Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body>
        <ConditionalHeader />
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}