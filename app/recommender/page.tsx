"use client";

import { useEffect, useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth";
import type { User } from "@/lib/types/auth";
import { submitRecommendation } from "./actions";
import type { RecommendationDto } from "@/application/dto/RecommendationDto";
import "./styles.css";

export default function RecommenderPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [interests, setInterests] = useState("");
  const [level, setLevel] = useState("");
  const [locations, setLocations] = useState<string[]>([]);
  const [result, formAction, isPending] = useActionState(
    submitRecommendation,
    null
  );

  // Auth check and profile pre-fill
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await authService.getUser();
      if (!currentUser) {
        router.push("/login");
        return;
      }
      setUser(currentUser);
      if (currentUser.studentProfile) {
        setInterests(currentUser.studentProfile);
      }
    };
    fetchUser();
  }, [router]);

  if (!user) {
    return (
      <div className="recommender-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const showResults = result?.success === true;
  const error = result?.success === false ? result.error : null;
  const recommendations = result?.success === true ? result.data : [];

  return (
    <div className="recommender-container">
      <div className="recommender-header">
        <h1>Module Aanbevelingen</h1>
        <p className="subtitle">
          Vind modules die bij jouw interesses en voorkeuren passen
        </p>
      </div>

      <div className="recommender-card">
        {!showResults ? (
          <form action={formAction} className="recommender-form">
            {error && (
              <div className="form-error" role="alert" aria-live="assertive">
                <strong>Fout:</strong> {error}
              </div>
            )}

            <div className="form-section">
              <label htmlFor="interests" className="form-label">
                Jouw interesses en doelen
              </label>
              <p className="form-hint">
                Beschrijf wat je wilt leren of waar je geïnteresseerd in bent
              </p>
              <textarea
                id="interests"
                name="interests"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="Bijvoorbeeld: Visuele communicatie, storytelling, webdesign, app development..."
                className="form-textarea"
                rows={4}
                required
                minLength={10}
              />
              {interests.length > 0 && interests.length < 10 && (
                <p className="validation-error">
                  Minimaal 10 karakters vereist ({interests.length}/10)
                </p>
              )}
            </div>

            <div className="form-section">
              <label className="form-label">Voorkeursniveau</label>
              <div className="radio-group">
                {[
                  { value: "", label: "Geen voorkeur" },
                  { value: "NLQF5", label: "NLQF5" },
                  { value: "NLQF6", label: "NLQF6" },
                ].map(({ value, label }) => (
                  <label key={value} className="radio-label">
                    <input
                      type="radio"
                      name="level"
                      value={value}
                      checked={level === value}
                      onChange={(e) => setLevel(e.target.value)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-section">
              <label className="form-label">Voorkeurslocatie(s)</label>
              <p className="form-hint">
                Selecteer één of meerdere locaties
              </p>
              <div className="checkbox-group">
                {[
                  { value: "Den Bosch", label: "Den Bosch" },
                  { value: "Breda", label: "Breda" },
                  { value: "Tilburg", label: "Tilburg" },
                ].map(({ value, label }) => (
                  <label key={value} className="checkbox-label">
                    <input
                      type="checkbox"
                      name="location"
                      value={value}
                      checked={locations.includes(value)}
                      onChange={(e) => {
                        setLocations((prevLocations) => {
                          if (e.target.checked) {
                            return [...prevLocations, value];
                          } else {
                            return prevLocations.filter((l) => l !== value);
                          }
                        });
                      }}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isPending || interests.trim().length < 10}
            >
              {isPending ? "Aanbevelingen ophalen..." : "Vind modules"}
            </button>
          </form>
        ) : (
          <ResultsView
            recommendations={recommendations}
            onChangeFilters={() => formAction(new FormData())}
          />
        )}
      </div>
    </div>
  );
}

function ResultsView({
  recommendations,
  onChangeFilters,
}: {
  recommendations: RecommendationDto[];
  onChangeFilters: () => void;
}) {
  return (
    <div>
      <div className="filter-change-section">
        <button onClick={onChangeFilters} className="change-filters-button">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="filter-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              stroke="currentColor"
            />
          </svg>
          Wijzig filters
        </button>
      </div>

      {recommendations.length > 0 ? (
        <div className="results-section">
          <h2 className="results-title">Aanbevolen modules voor jou</h2>
          <div className="results-grid">
            {recommendations.map((r) => (
              <div key={r.module_id} className="recommendation-card">
                <div className="recommendation-header">
                  <h3 className="recommendation-title">{r.module_name}</h3>
                  <div className="recommendation-score">
                    {Math.round(r.score * 100)}% match
                  </div>
                </div>
                <div className="recommendation-meta">
                  <span className="meta-tag">{r.level}</span>
                  <span className="meta-tag">{r.location}</span>
                </div>
                <p className="recommendation-reason">{r.waarom_match}</p>
                <a
                  href={`/modules/${r.module_id}`}
                  className="view-module-link"
                >
                  Bekijk module →
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-results">
          <p>Geen modules gevonden die bij jouw criteria passen.</p>
          <p className="no-results-hint">
            Probeer je zoekopdracht aan te passen of kies andere filters.
          </p>
        </div>
      )}
    </div>
  );
}
