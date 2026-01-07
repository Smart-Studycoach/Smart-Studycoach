"use client";

import { UserProfileInfo } from "@/domain/entities/User";
import { ModuleMinimal } from "@/domain";
import { useEffect, useState } from "react";
import { MiniModuleCard } from "@/components/MiniModuleCard";

import "./styles.css";

export default function Account() {
  const [userProfile, setUserProfile] = useState<UserProfileInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await fetch("/api/account");
        const data: UserProfileInfo | null = await response.json();

        if (!response.ok) {
          setError("Failed to load user profile");
          return;
        }
        setUserProfile(data); // moet zo weg
      } catch (err) {
        setError("Failed to load user profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {userProfile && (
        <div className="account-page">
          <div className="account-header">
            <h2 className="account-name">{userProfile.name}</h2>
            <p className="account-profile">{userProfile.student_profile}</p>
          </div>

          <section className="chosen-modules">
            <h3>Gekozen modules</h3>
            {userProfile.chosen_modules &&
            userProfile.chosen_modules.length > 0 ? (
              <div className="mini-grid">
                {userProfile.chosen_modules.map((module: ModuleMinimal) => (
                  <MiniModuleCard key={module.module_id} module={module} />
                ))}
              </div>
            ) : (
              <p className="empty">Nog geen gekozen modules.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
