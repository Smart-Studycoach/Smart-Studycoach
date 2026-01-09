"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth";
import "./css/login.css";
import { AuthError } from "@/src/domain/errors/AuthError";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const authResponse = await authService.login({ email, password });
      authService.storeAuth(authResponse);
      router.push("/");
    } catch (err) {
      if (err instanceof AuthError) {
        switch (err.status) {
          case 400:
            setError("Vul zowel email als wachtwoord in.");
            break;
          case 401:
            setError("Email of wachtwoord is onjuist.");
            break;
          case 500:
            setError("Er is een serverfout opgetreden. Probeer later opnieuw.");
            break;
          default:
            setError("Onbekende fout. Probeer opnieuw.");
        }
      } else {
        setError("Kan geen verbinding maken met de server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h1 className="login-title">Login</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                color: "red",
                marginBottom: "1rem",
                padding: "0.5rem",
                backgroundColor: "#ffebee",
                borderRadius: "4px",
              }}
            >
              {error}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="mail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Wachtwoord</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="*****"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Inloggen..." : "Login"}
          </button>
          <div className="register-link">
            <a href="/register">Of registreer</a>
          </div>
        </form>
      </div>
    </div>
  );
}
