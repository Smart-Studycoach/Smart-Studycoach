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
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await authService.deleteAccount();
      window.location.href = "/login";
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
      setError("Invalid email format");
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
      setError("Failed to update profile");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (newPassword.length < 12) {
      setPasswordError("Password must be at least 12 characters long");
      return;
    }

    // 12 characters
    if (newPassword.length < 12) {
      setPasswordError("Password must be at least 12 characters long");
      return;
    }
    
    // Capital letter
    if (!/[A-Z]/.test(newPassword)) {
      setPasswordError("Password must contain at least one uppercase letter");
      return;
    }
    
    // Number
    if (!/[0-9]/.test(newPassword)) {
      setPasswordError("Password must contain at least one number");
      return;
    }
    
    // Special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setPasswordError("Password must contain at least one special character");
      return;
    }

    setIsChangingPassword(true);
    try {
      await authService.updatePassword(oldPassword, newPassword);
      setPasswordSuccess("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsEditingPassword(false);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Failed to update password");
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
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {userProfile && (
        <div className="account-page">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="py-8">
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
                    <Input
                      id="name"
                      value={userProfile.name}
                      disabled={true}
                    />
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
                <CardTitle className="text-2xl">Change Password</CardTitle>
                {!isEditingPassword ? (
                  <Button variant="outline" size="sm" onClick={handleEditPassword}>
                    Edit Password
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancelPassword} disabled={isChangingPassword}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleChangePassword} disabled={isChangingPassword || !oldPassword || !newPassword || !confirmPassword}>
                      {isChangingPassword ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </div>
              {!isEditingPassword && (
                <CardDescription>
                  Update your password to keep your account secure
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
                    <Label htmlFor="oldPassword">Current Password</Label>
                    <Input
                      id="oldPassword"
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      disabled={isChangingPassword}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isChangingPassword}
                    />
                    <p className="text-xs text-muted-foreground">
                      Must be at least 12 characters with at least one uppercase letter, one number, and one special character
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
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

          <Card className="border-destructive/50 py-8 mb-6">
            <CardHeader>
              <CardTitle className="text-destructive text-2xl">Danger Zone</CardTitle>
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
        </div>
      )}
    </div>
  );
}
