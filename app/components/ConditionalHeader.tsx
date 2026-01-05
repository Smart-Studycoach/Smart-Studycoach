'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { authService } from '@/lib/services/auth';
import type { User } from '@/lib/types/auth';

export function ConditionalHeader() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getUser();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(currentUser);
    setIsLoading(false);
  }, [pathname]);
  
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
            {isLoading ? (
              <div aria-hidden="true" style={{ width: '80px', height: '32px' }} />
            ) : user ? (
                <a href="/account" className="nav-link-profile" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {user.name}
                <Image 
                  src={`https://api.dicebear.com/9.x/miniavs/svg?seed=${encodeURIComponent(user._id)}`}
                  alt={user.name}
                  width={32}
                  height={32}
                  style={{ borderRadius: '50%' }}
                />
                </a>
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
