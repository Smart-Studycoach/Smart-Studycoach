'use client';

import { usePathname } from 'next/navigation';

export function ConditionalHeader() {
  const pathname = usePathname();
  
  // Hide header on login page
  if (pathname === '/login') {
    return null;
  }

  return (
    <>
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
      
      <main className="main-content" />
    </>
  );
}
