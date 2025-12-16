import type { Metadata } from "next";
import "./css/globals.css";
import "./css/layout.css";

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
        <header className="header">
          <div className="header-content">
            <div className="logo">AVANS</div>
            
            <nav className="nav">
              <a href="/modules" className="nav-link">Modules</a>
              <a href="/over-ons" className="nav-link">Over Ons</a>
              <a href="/favorieten" className="nav-link">Favorieten</a>
            </nav>

            <div className="user-actions">
              <a href="/login" className="login-btn">Login</a>
            </div>
          </div>
        </header>
        
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}