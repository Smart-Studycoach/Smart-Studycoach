'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { authService } from '@/lib/services/auth';
import type { User } from '@/lib/types/auth';

export function ConditionalHeader() {
  const pathname = usePathname();
  const [user] = useState<User | null>(() => authService.getUser());
  
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
                <a href="/account" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {user.name}
                <img 
                  src={`https://api.dicebear.com/9.x/miniavs/svg?seed=${encodeURIComponent(user._id)}`}
                  alt={user.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                />
                </a>
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
