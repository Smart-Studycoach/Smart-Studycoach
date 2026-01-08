"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "./styles.css";

interface Module {
  _id: string;
  module_id: number;
  name: string;
  shortdescription: string[];
  description: string;
  studycredit: number;
  location: string[];
  level: string;
  learningoutcomes: string;
  estimated_difficulty: number;
  available_spots: number;
  start_date: string;
}

export default function ModuleDetailPage() {
  const params = useParams();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeringLoading, setRegisteringLoading] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const response = await fetch(`/api/modules/${params.id}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to load module");
          setLoading(false);
          return;
        }

        setModule(data.module);
        setLoading(false);
        setIsRegistered(data.module_chosen);
      } catch (err) {
        setError("Failed to load module");
        setLoading(false);
        console.error(err);
      }
    };

    if (params.id) {
      fetchModule();
    }
  }, [params.id]);

  const handleRegistering = async () => {
    if (!module) return;
    setActionError("");
    setRegisteringLoading(true);

    const newChosen = !isRegistered;
    setIsRegistered(newChosen);

    try {
      const response = await fetch(`/api/modules/${params.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chosen: newChosen }),
      });
      const data = await response.json();

      if (!response.ok) {
        setIsRegistered(!newChosen); // revert
        setActionError(data.error || "Failed to update module choice");
      }
    } catch (err) {
      setIsRegistered(!newChosen); // revert
      setActionError("Failed to update module choice");
      console.error(err);
    } finally {
      setRegisteringLoading(false);
    }
  };

  const handleFavoriting = async () => {
    if (!module) return;
    setActionError("");
    setFavoriteLoading(true);

    const newFav = !favorited;
    setFavorited(newFav);

    // No backend implemented for favorites yet — keep client-side optimistic toggle.
    // If a backend exists, replace this with a fetch call similar to registering.
    setTimeout(() => setFavoriteLoading(false), 300);
  };

  if (loading) {
    return (
      <div className="module-detail-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="module-detail-container">
        <div className="error">{error || "Module not found"}</div>
      </div>
    );
  }

  return (
    <div className="module-detail-container">
      <div className="module-header">
        <span className="module-type">Keuzemodule</span>
        <h1 className="module-title">{module.name}</h1>

        <div className="module-tags">
          <span className="tag">NL</span>
          <span className="tag">{module.studycredit}-ECTS</span>
          <span className="tag">{module.level}</span>
        </div>

        {module.shortdescription && module.shortdescription.length > 0 && (
          <div className="module-summary">
            <p>{module.shortdescription.join(" ")}</p>
          </div>
        )}

        <div className="module-actions">
          <button
            className="btn-primary"
            onClick={handleRegistering}
            disabled={registeringLoading}
          >
            {isRegistered ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 3l10 10M13 3L3 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1v14M1 8h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {registeringLoading
              ? "..."
              : isRegistered
              ? "Afmelden"
              : "Aanmelden"}
          </button>
          <button
            className="btn-secondary"
            onClick={handleFavoriting}
            disabled={favoriteLoading}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2.5l1.5 4.5h4.5l-3.5 2.5 1.5 4.5-3.5-2.5-3.5 2.5 1.5-4.5-3.5-2.5h4.5z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
            {favoriteLoading
              ? "..."
              : favorited
              ? "Verwijder favoriet"
              : "Maak favoriet"}
          </button>
        </div>
        {actionError && <div className="action-error">{actionError}</div>}
      </div>

      <div className="module-content">
        <div className="module-image">
          <img
            src={`https://picsum.photos/seed/${module.module_id}/800/500`}
            alt={module.name}
            onError={(e) => {
              e.currentTarget.src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23323333" width="400" height="300"/%3E%3Ctext fill="%23fff" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20"%3EModule Image%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>

        <div className="module-info-card">
          <div className="info-item">
            <p className="info-label">Start datum</p>
            <p>{module.start_date}</p>
          </div>

          <div className="info-item">
            <p className="info-label">Studiepunten</p>
            <p>{module.studycredit} ECTS</p>
          </div>

          <div className="info-item">
            <p className="info-label">Waar</p>
            <p>{module.location.join(", ")}</p>
          </div>

          <div className="info-item">
            <p className="info-label">Niveau</p>
            <p>{module.level}</p>
          </div>
          <div className="info-item">
            <p className="info-label">Beschikbare plekken</p>
            <p>{module.available_spots}</p>
          </div>
        </div>
      </div>

      <div className="module-content">
        <div className="learning-title-side">
          <div className="learning-title-box">
            <h2>Wat leer je in de Keuzemodule?</h2>
          </div>
        </div>
        <div className="learning-content">
          <p>{module.description}</p>
          {module.learningoutcomes && <p>{module.learningoutcomes}</p>}
        </div>
      </div>

      <div className="bottom-section">
        <div className="contact-section">
          <h3>Heb je nog vragen over deze module?</h3>
          <p className="contact-subtitle">
            Je kan nu via Teams in contact komen met de docent die deze module
            geeft.
          </p>

          <div className="contact-buttons">
            <button className="btn-contact">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 2h12v10H4l-2 2V2z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinejoin="round"
                />
                <line
                  x1="5"
                  y1="6"
                  x2="11"
                  y2="6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="5"
                  y1="9"
                  x2="9"
                  y2="9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Stel nu je vraag
            </button>
            <button className="btn-contact">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect
                  x="2"
                  y="3"
                  width="12"
                  height="10"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M2 5l6 4 6-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
              E-mail
            </button>
          </div>
        </div>

        <div className="teacher-card">
          <div className="teacher-avatar">
            <img
              src={`https://i.pravatar.cc/150?img=${module.module_id % 70}`}
              alt="Docent"
              onError={(e) => {
                e.currentTarget.src =
                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Ccircle fill="%23C6002A" cx="50" cy="50" r="50"/%3E%3Ctext fill="%23fff" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="40"%3ED%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
          <h4 className="teacher-name">Norma van Eijk</h4>
        </div>
      </div>
    </div>
  );
}
