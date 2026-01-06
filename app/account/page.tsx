"use client";

import { UserProfileDTO } from "@/domain/entities/User";
import { useEffect, useState } from "react";

interface ModuleMinimal {
  module_id: string;
  name: string;
}

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
interface UserProfileInfo {
  _id: string;
  name: string;
  student_profile: string;
  favorite_modules: ModuleMinimal[];
  chosen_modules: ModuleMinimal[];
}

export default function Account() {
  const [userProfile, setUserProfile] = useState<UserProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await fetch("/api/account");
        const data: UserProfileDTO | null = await response.json();

        if (!response.ok) {
          setError("Failed to load user profile");
          return;
        }
        setUserProfile(data); // moet zo weg

        // if (data != null) {
        //   if (data.chosenModules != undefined) {

        //   }
        // }

        // let profile: UserProfileInfo = {
        //   _id: data._id,
        //   name: data.name,
        // };
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
