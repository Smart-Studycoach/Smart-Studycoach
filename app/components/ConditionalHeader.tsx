'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export function ConditionalHeader() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };
  
  // Hide header on login and register pages
  if (pathname === '/login' || pathname === '/register') {
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

          <div className="user-actions nav">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <a href="/account" className="nav-link">{user.name}</a>
              </div>
            ) : (
              <a href="/login" className="login-btn">Login</a>
            )}
          </div>
        </div>
      </header>
      
      <main className="main-content" />
    </>
  );
}
