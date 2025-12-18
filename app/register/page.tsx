"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth";
import "./css/login.css";

export default function Register() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [studentProfile, setStudentProfile] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Voer een geldig e-mailadres in");
            return;
        }
        
        if (!name.trim()) {
            setError("Naam is verplicht");
            return;
        }
        
        setStep(2);
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password.length < 12) {
            setError("Wachtwoord moet minimaal 12 tekens bevatten");
            return;
        }

        if (!/[A-Z]/.test(password)) {
            setError("Wachtwoord moet minimaal één hoofdletter bevatten");
            return;
        }

        if (!/[0-9]/.test(password)) {
            setError("Wachtwoord moet minimaal één cijfer bevatten");
            return;
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            setError("Wachtwoord moet minimaal één speciaal teken bevatten");
            return;
        }

        if (password !== confirmPassword) {
            setError("Wachtwoorden komen niet overeen");
            return;
        }

        setStep(3);
    };

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const authResponse = await authService.register({
                email,
                name,
                password,
                studentProfile,
            });
            authService.storeAuth(authResponse);
            router.push("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Er is iets misgegaan. Probeer het opnieuw.");
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="register-form-wrapper">
                <h1 className="login-title">Registreer</h1>
                
                {error && (
                    <div style={{
                        color: "red",
                        marginBottom: "1rem",
                        padding: "0.5rem",
                        backgroundColor: "#ffebee",
                        borderRadius: "4px",
                    }}>
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form className="login-form" onSubmit={handleEmailSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Naam</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Jouw naam"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
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
                            />
                        </div>
                        <button type="submit" className="login-button">
                            Doorgaan
                        </button>
                        <div className="register-link">
                            <a href="/login">Of login</a>
                        </div>
                    </form>
                )}

                {step === 2 && (
                    <form className="login-form" onSubmit={handlePasswordSubmit}>
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
                            />
                            <small style={{ fontSize: "0.85rem", color: "#666" }}>
                                Min. 12 tekens, hoofdletter, cijfer en speciaal teken
                            </small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirm-password">
                                Bevestig Wachtwoord
                            </label>
                            <input
                                type="password"
                                id="confirm-password"
                                name="confirm-password"
                                placeholder="*****"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <small style={{ fontSize: "0.85rem", color: "#666" }}>
                                Vul hetzelfde wachtwoord in als hierboven
                            </small>
                        </div>
                        <button type="submit" className="login-button">
                            Doorgaan
                        </button>
                        <div className="register-link">
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setError("");
                                    setStep(1);
                                }}
                            >
                                Terug
                            </a>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <form className="login-form" onSubmit={handleFinalSubmit}>
                        <div className="form-group">
                            <label htmlFor="student-profile">Studentenprofiel</label>
                            <p className="profile-description">
                                Vertel ons over je interesses, passies en wat je wilt leren. 
                                Bijvoorbeeld: welke onderwerpen spreken je aan, wat zijn je doelen, 
                                en welke richting wil je op met je studie?
                            </p>
                            <textarea 
                                id="student-profile" 
                                name="student-profile" 
                                placeholder="Mijn passie ligt bij gedragsbeïnvloeding en psychologie. Ik wil leren hoe ik menselijk gedrag kan analyseren en positief kan sturen. Ik combineer mijn interesse in persoonlijke ontwikkeling graag met een internationale blik ('Learning and working abroad'). Ook het ontwerpen van gezonde, vitale omgevingen via 'Happy city, happy people' spreekt me aan. Ik zoek modules die theorie over gedrag direct vertalen naar maatschappelijke en internationale praktijk."
                                value={studentProfile}
                                onChange={(e) => setStudentProfile(e.target.value)}
                                rows={8}
                                required
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? "Registreren..." : "Registreer"}
                        </button>
                        <div className="register-link">
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setError("");
                                    setStep(2);
                                }}
                            >
                                Terug
                            </a>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}