"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { authService } from "@/lib/services/auth";
import type { User } from "@/lib/types/auth";

export function ConditionalHeader() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await authService.getUser();
      setUser(currentUser);
      setIsLoading(false);
    };
    fetchUser();
  }, [pathname]);

  // Hide header on login and register pages
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="logo">AVANS</div>

          <button
            className={`hamburger ${isMobileMenuOpen ? "hamburger-open" : ""}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`nav ${isMobileMenuOpen ? "nav-open" : ""}`}>
            <Link href="/modules" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Modules
            </Link>
            <Link href="/recommender" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Aanbeveler
            </Link>
            <Link href="/favorites" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Favorieten
            </Link>
            <div className="mobile-nav-divider"></div>
            {user && (
              <Link href="/account" className="nav-link nav-link-mobile-account" onClick={() => setIsMobileMenuOpen(false)}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  {user.name}
                  <Image
                    src={`https://api.dicebear.com/9.x/miniavs/svg?seed=${encodeURIComponent(
                      user._id
                    )}`}
                    alt={user.name}
                    width={28}
                    height={28}
                    style={{ borderRadius: "50%" }}
                  />
                </span>
              </Link>
            )}
          </nav>

          <div className="user-actions nav desktop-only">
            {isLoading ? (
              <div
                aria-hidden="true"
                style={{ width: "80px", height: "32px" }}
              />
            ) : user ? (
              <a
                href="/account"
                className="nav-link-profile"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                {user.name}
                <Image
                  src={`https://api.dicebear.com/9.x/miniavs/svg?seed=${encodeURIComponent(
                    user._id
                  )}`}
                  alt={user.name}
                  width={28}
                  height={28}
                  style={{ borderRadius: "50%" }}
                />
              </a>
            ) : (
              <a href="/login" className="login-btn">
                Login
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="main-content" />
    </>
  );
}
