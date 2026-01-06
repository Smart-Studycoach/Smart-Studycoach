"use client";

import { UserProfileDTO } from "@/domain/entities/User";
import { useEffect, useState } from "react";

export default function Account() {
  const [userProfile, setUserProfile] = useState<UserProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await fetch("/api/account");
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to load user profile");
          return;
        }
        console.log(data.profile);
        setUserProfile(data.profile);
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
      <h1>Account</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {userProfile && (
        <div>
          <p>
            <strong>Name:</strong> {userProfile.name}
          </p>
          <p>
            <strong>Student Profile:</strong> {userProfile.studentProfile}
          </p>
          <p>
            <strong>Favorite Modules:</strong>{" "}
            {userProfile.favoriteModules?.join(", ") || "None"}
          </p>
          <p>
            <strong>Chosen Modules:</strong>{" "}
            {userProfile.chosenModules?.join(", ") || "None"}
          </p>
        </div>
      )}
    </div>
  );
}
