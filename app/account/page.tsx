"use client";

import { UserProfileInfo } from "@/domain/entities/User";
import { ModuleMinimal } from "@/domain";
import { useEffect, useState } from "react";
import { MiniModuleCard } from "@/components/MiniModuleCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/lib/services/auth";
import { useRouter } from "next/navigation";

import "./styles.css";

export default function Account() {
  const [userProfile, setUserProfile] = useState<UserProfileInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await fetch("/api/account");
        const data: UserProfileInfo | null = await response.json();

        if (!response.ok) {
          setError("Failed to load user profile");
          return;
        }
        setUserProfile(data);
        if (data) {
          setEditedName(data.name);
          const user = authService.getUser();
          if (user) {
            setEditedEmail(user.email);
          }
        }
      } catch (err) {
        setError("Failed to load user profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, []);

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const token = authService.getToken();
      if (token) {
        await authService.deleteAccount(token);
        authService.logout();
        router.push("/login");
      }
    } catch (err) {
      setError("Failed to delete account");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (userProfile) {
      setEditedName(userProfile.name);
      const user = authService.getUser();
      if (user) {
        setEditedEmail(user.email);
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedUser = await authService.updateUser({
        name: editedName,
        email: editedEmail,
      });

      // Update the profile state with the new name
      setUserProfile({
        ...userProfile!,
        name: updatedUser.name,
      });
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {userProfile && (
        <div className="account-page">
          <Card className="mb-6 py-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Profile Information</CardTitle>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={handleEdit}>
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    disabled={isSaving}
                  />
                ) : (
                  <p className="text-lg font-medium">{userProfile.name}</p>
                )}
              </div>
                <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                  id="email"
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  disabled={isSaving}
                  />
                ) : (
                  <p className="text-muted-foreground">{authService.getUser()?.email}</p>
                )}
                </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50 py-8">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that will affect your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <div className="font-medium">Logout</div>
                  <div className="text-sm text-muted-foreground">
                    Sign out of your account on this device
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="ml-4"
                >
                  Logout
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4 bg-destructive/5">
                <div className="space-y-0.5">
                  <div className="font-medium text-destructive">Delete Account</div>
                  <div className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </div>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="ml-4"
                >
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </Button>
              </div>
            </CardContent>
          </Card>

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
