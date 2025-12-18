import type { Metadata } from "next";
import "./css/login.css";

export const metadata: Metadata = {
    title: "Login - AVANS Smart Studycoach",
    description: "Login to access your Smart Study Coach account",
};

export default function Login() {
    return (
        <div className="login-container">
            <div className="login-form-wrapper">
                <h1 className="login-title">Login</h1>
                <form className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            placeholder="mail@gmail.com"
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Wachtwoord</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            placeholder="*****"
                            required 
                        />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                    <div className="register-link">
                        <a href="/register">Of registreer</a>
                    </div>
                </form>
            </div>
        </div>
    );
}