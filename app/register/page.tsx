'use client';

import type { Metadata } from "next";
import { useState } from "react";
import "./css/login.css";

export default function Register() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [studentProfile, setStudentProfile] = useState('');

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setStep(2);
        }
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password && confirmPassword && password === confirmPassword) {
            setStep(3);
        }
    };

    const handleFinalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle final registration
        console.log({ email, password, studentProfile });
    };

    return (
        <div className="login-container">
            <div className="register-form-wrapper">
                <h1 className="login-title">Registreer</h1>
                
                {step === 1 && (
                    <form className="login-form" onSubmit={handleEmailSubmit}>
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
                        <button type="submit" className="login-button">Doorgaan</button>
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
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirm-password">Bevestig Wachtwoord</label>
                            <input 
                                type="password" 
                                id="confirm-password" 
                                name="confirm-password" 
                                placeholder="*****"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required 
                            />
                        </div>
                        <button type="submit" className="login-button">Doorgaan</button>
                        <div className="register-link">
                            <a href="#" onClick={() => setStep(1)}>Terug</a>
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
                            />
                        </div>
                        <button type="submit" className="login-button">Registreer</button>
                        <div className="register-link">
                            <a href="#" onClick={() => setStep(2)}>Terug</a>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}