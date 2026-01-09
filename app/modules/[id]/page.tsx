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
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollingLoading, setEnrollingLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const fetchModule = async () => {
      if (!params.id) {
        setError("Geen module ID opgegeven");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/modules/${params.id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Module niet gevonden");
          } else if (response.status >= 500) {
            setError(
              "Er ging iets mis bij het laden van de module. Probeer het later opnieuw."
            );
          } else {
            const data = await response.json();
            setError(data.error || "Kon de module niet laden");
          }
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (!data.module) {
          setError("Module data ontbreekt");
          setLoading(false);
          return;
        }

        setModule(data.module);
        setIsEnrolled(data.isEnrolled || false);
        setIsFavorited(data.isFavorited || false);

        // Fetch favorite state separately if user is authenticated
        try {
          const favRes = await fetch(`/api/users/me/favorites/${params.id}`);
          if (favRes.ok) {
            const favData = await favRes.json();
            setIsFavorited(Boolean(favData.favorite));
          }
        } catch (err) {
          // Silent fail for favorite state - not critical
          console.error("Kon favoriet status niet laden", err);
        }

        setLoading(false);
      } catch (err) {
        console.error("Fout bij het laden van module:", err);
        setError(
          "Kan geen verbinding maken met de server. Controleer je internetverbinding."
        );
        setLoading(false);
      }
    };

    fetchModule();
  }, [params.id]);

  const handleEnrolling = async () => {
    if (!module) return;

    setActionError("");
    setEnrollingLoading(true);

    const newEnrolled = !isEnrolled;
    const previousEnrolled = isEnrolled;
    setIsEnrolled(newEnrolled);

    try {
      const endpoint = newEnrolled
        ? "/api/users/me/enrollments"
        : `/api/users/me/enrollments/${params.id}`;

      const response = await fetch(endpoint, {
        method: newEnrolled ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: newEnrolled
          ? JSON.stringify({ module_id: Number(params.id) })
          : undefined,
      });

      if (!response.ok) {
        const data = await response.json();
        setIsEnrolled(previousEnrolled);

        if (response.status === 401) {
          setActionError(
            "Je moet ingelogd zijn om je aan te melden voor een module"
          );
        } else if (response.status === 404) {
          setActionError("Module niet gevonden");
        } else if (response.status >= 500) {
          setActionError(
            newEnrolled
              ? "Er ging iets mis bij het aanmelden. Probeer het later opnieuw."
              : "Er ging iets mis bij het afmelden. Probeer het later opnieuw."
          );
        } else {
          setActionError(
            data.error ||
              (newEnrolled ? "Aanmelden mislukt" : "Afmelden mislukt")
          );
        }
        return;
      }

      // Success - no error message needed
    } catch (err) {
      console.error("Fout bij inschrijving:", err);
      setIsEnrolled(previousEnrolled);
      setActionError(
        "Kan geen verbinding maken met de server. Controleer je internetverbinding."
      );
    } finally {
      setEnrollingLoading(false);
    }
  };

  const handleFavoriting = async () => {
    if (!module) return;

    setActionError("");
    setFavoriteLoading(true);

    const newFavorited = !isFavorited;
    const previousFavorited = isFavorited;
    setIsFavorited(newFavorited);

    try {
      const response = await fetch(`/api/users/me/favorites/${params.id}`, {
        method: newFavorited ? "PUT" : "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const data = await response.json();
        setIsFavorited(previousFavorited);

        if (response.status === 401) {
          setActionError("Je moet ingelogd zijn om favorieten toe te voegen");
        } else if (response.status === 404) {
          setActionError("Module niet gevonden");
        } else if (response.status >= 500) {
          setActionError(
            newFavorited
              ? "Er ging iets mis bij het toevoegen aan favorieten. Probeer het later opnieuw."
              : "Er ging iets mis bij het verwijderen van favorieten. Probeer het later opnieuw."
          );
        } else {
          setActionError(
            data.error ||
              (newFavorited
                ? "Toevoegen aan favorieten mislukt"
                : "Verwijderen van favorieten mislukt")
          );
        }
        return;
      }

      // Success - no error message needed
    } catch (err) {
      console.error("Fout bij favorieten:", err);
      setIsFavorited(previousFavorited);
      setActionError(
        "Kan geen verbinding maken met de server. Controleer je internetverbinding."
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="module-detail-container">
        <div className="loading">Module laden...</div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="module-detail-container">
        <div className="error">
          <h2>Oeps!</h2>
          <p>{error || "Module niet gevonden"}</p>
          <button
            className="btn-primary"
            onClick={() => (window.location.href = "/modules")}
            style={{ marginTop: "1rem" }}
          >
            Terug naar modules
          </button>
        </div>
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
            onClick={handleEnrolling}
            disabled={enrollingLoading}
          >
            {isEnrolled ? (
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
            {enrollingLoading
              ? "Bezig..."
              : isEnrolled
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
                fill={isFavorited ? "currentColor" : "none"}
              />
            </svg>
            {favoriteLoading
              ? "Bezig..."
              : isFavorited
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
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23323333" width="400" height="300"/%3E%3Ctext fill="%23fff" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20"%3EModule Afbeelding%3C/text%3E%3C/svg%3E';
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
