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

export default function Account() {
  const [userProfile, setUserProfile] = useState<UserProfileInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await fetch("/api/users/me/account");
        const data: UserProfileInfo | null = await response.json();

        if (!response.ok) {
          setError("Failed to load user profile");
          return;
        }
        setUserProfile(data);
        if (data) {
          setEditedName(data.name);
          // Fetch full user data including email
          const user = await authService.getUser();
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

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = "/login";
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Weet je zeker dat je je account wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await authService.deleteAccount();
      window.location.href = "/login";
    } catch (err) {
      setError("Kan account niet verwijderen");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = async () => {
    setIsEditing(false);
    if (userProfile) {
      setEditedName(userProfile.name);
      const user = await authService.getUser();
      if (user) {
        setEditedEmail(user.email);
      }
    }
  };

  const handleSave = async () => {
    // Client-side email validation before sending to API
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedEmail)) {
      setError("Ongeldig e-mailformaat");
      return;
    }

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
      setError("Kan profiel niet bijwerken");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Wachtwoorden komen niet overeen");
      return;
    }

    if (newPassword.length < 12) {
      setPasswordError("Wachtwoord moet minstens 12 karakters lang zijn");
      return;
    }

    // 12 characters
    if (newPassword.length < 12) {
      setPasswordError("Wachtwoord moet minstens 12 karakters lang zijn");
      return;
    }
    
    // Capital letter
    if (!/[A-Z]/.test(newPassword)) {
      setPasswordError("Wachtwoord moet minstens één hoofdletter bevatten");
      return;
    }
    
    // Number
    if (!/[0-9]/.test(newPassword)) {
      setPasswordError("Wachtwoord moet minstens één cijfer bevatten");
      return;
    }
    
    // Special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setPasswordError("Wachtwoord moet minstens één speciaal teken bevatten");
      return;
    }

    setIsChangingPassword(true);
    try {
      await authService.updatePassword(oldPassword, newPassword);
      setPasswordSuccess("Wachtwoord succesvol bijgewerkt");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsEditingPassword(false);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Kan wachtwoord niet bijwerken");
      console.error(err);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleEditPassword = () => {
    setIsEditingPassword(true);
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handleCancelPassword = () => {
    setIsEditingPassword(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPasswordSuccess("");
  };

  return (
    <div>
      {loading && <p>Laden...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {userProfile && (
        <div className="account-page">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="py-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Profielinformatie</CardTitle>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={handleEdit}>
                      Bewerk Profiel
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
                        Annuleren
                      </Button>
                      <Button size="sm" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Opslaan..." : "Opslaan"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Naam</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      disabled={isSaving}
                    />
                  ) : (
                    <Input
                      id="name"
                      value={userProfile.name}
                      disabled={true}
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      disabled={isSaving}
                    />
                  ) : (
                    <Input
                      id="email"
                      type="email"
                      value={editedEmail || ""}
                      disabled={true}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="py-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Wachtwoord wijzigen</CardTitle>
                {!isEditingPassword ? (
                  <Button variant="outline" size="sm" onClick={handleEditPassword}>
                    Bewerk Wachtwoord
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancelPassword} disabled={isChangingPassword}>
                      Annuleren
                    </Button>
                    <Button size="sm" onClick={handleChangePassword} disabled={isChangingPassword || !oldPassword || !newPassword || !confirmPassword}>
                      {isChangingPassword ? "Opslaan..." : "Opslaan"}
                    </Button>
                  </div>
                )}
              </div>
              {!isEditingPassword && (
                <CardDescription>
                  Wijzig je wachtwoord om je account veilig te houden
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}
              {passwordSuccess && (
                <p className="text-sm text-green-600">{passwordSuccess}</p>
              )}
              {isEditingPassword ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword">Huidig Wachtwoord</Label>
                    <Input
                      id="oldPassword"
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      disabled={isChangingPassword}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nieuw Wachtwoord</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isChangingPassword}
                    />
                    <p className="text-xs text-muted-foreground">
                      Moet minstens 12 karakters zijn met minimaal één hoofdletter, één cijfer en één speciaal teken
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Bevestig Nieuw Wachtwoord</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isChangingPassword}
                    />
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">
                  ••••••••••••
                </p>
              )}
            </CardContent>
          </Card>
          </div>

          <Card className="py-8">
            <CardHeader>
              <CardTitle className="text-2xl">Gekozen modules</CardTitle>
              <CardDescription>
                Modules die je hebt gekozen voor je studie
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userProfile.chosen_modules &&
              userProfile.chosen_modules.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userProfile.chosen_modules.map((module: ModuleMinimal) => (
                  <MiniModuleCard key={module.module_id} module={module} />
                  ))}
                </div>
                ) : (
                <p className="text-muted-foreground text-center py-8">Nog geen gekozen modules.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-destructive/50 py-8 mt-6">
            <CardHeader>
              <CardTitle className="text-destructive text-2xl">Gevarenzone</CardTitle>
              <CardDescription>
                Onomkeerbare acties die je account beïnvloeden
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <div className="font-medium">Uitloggen</div>
                  <div className="text-sm text-muted-foreground">
                    Meld je af van je account op dit apparaat
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="ml-4"
                >
                  Uitloggen
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4 bg-destructive/5">
                <div className="space-y-0.5">
                  <div className="font-medium text-destructive">Account Verwijderen</div>
                  <div className="text-sm text-muted-foreground">
                    Verwijder permanent je account en alle bijbehorende gegevens
                  </div>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="ml-4"
                >
                  {isDeleting ? "Verwijderen..." : "Account Verwijderen"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
