
"use client";

import * as React from "react";
import Image from "next/image";
import { CameraIcon, CheckIcon, UserRoundIcon } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ProfileUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

const isValidImageUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

export const ProfileForm = () => {
  const { data: session, isPending, refetch } = useSession();
if (isPending) {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Profile Skeleton */}
      <Card className="gap-5">
        <CardHeader className="gap-3">
          <div className="h-6 w-24 rounded-md bg-muted" />
          <div className="h-4 w-64 max-w-full rounded-md bg-muted" />
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* Avatar Skeleton */}
          <div className="flex items-center gap-4">
            <div className="size-20 shrink-0 rounded-full bg-muted" />

            <div className="flex flex-col gap-2">
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="h-3 w-48 max-w-full rounded bg-muted" />
            </div>
          </div>

          <Separator />

          {/* Form Fields Skeleton */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-10 w-full rounded-lg bg-muted" />
              </div>
            ))}

            <div className="flex flex-col gap-2 sm:col-span-2">
              <div className="h-4 w-36 rounded bg-muted" />
              <div className="h-10 w-full rounded-lg bg-muted" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Buttons Skeleton */}
      <div className="flex justify-end gap-3">
        <div className="h-11 w-24 rounded-full bg-muted" />
        <div className="h-11 w-36 rounded-full bg-muted" />
      </div>
    </div>
  );
}

  if (!session?.user) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Please login to view your profile.
      </div>
    );
  }

  return (
    <ProfileEditor
      key={session.user.id}
      user={session.user}
      onRefresh={refetch}
    />
  );
};

const ProfileEditor = ({
  user,
  onRefresh,
}: {
  user: ProfileUser;
  onRefresh: () => Promise<unknown>;
}) => {
  const [name, setName] = React.useState(user.name || "");
  const [imageUrl, setImageUrl] = React.useState(user.image || "");
  const [saving, setSaving] = React.useState(false);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (name.trim().length < 2) {
      toast.add({
        type: "warning",
        title: "Name is too short",
        description: "Your name must contain at least 2 characters.",
      });
      return;
    }

    const photo = imageUrl.trim();

    if (photo && !isValidImageUrl(photo)) {
      toast.add({
        type: "warning",
        title: "Invalid image URL",
        description: "Please enter a valid HTTP or HTTPS image URL.",
      });
      return;
    }

    setSaving(true);

    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: photo || null,
      });

      if (error) {
        throw new Error(error.message);
      }

      await onRefresh();

      toast.add({
        type: "success",
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
    } catch (error) {
      console.error("Profile update failed:", error);

      toast.add({
        type: "error",
        title: "Update failed",
        description: "Could not update your profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setName(user.name || "");
    setImageUrl(user.image || "");

    toast.add({
      type: "info",
      title: "Changes discarded",
      description: "Your profile form has been reset.",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="gap-5">
        <CardHeader>
          <CardTitle className="font-heading text-lg tracking-[-0.01em]">
            Profile
          </CardTitle>
          <CardDescription>
            Manage your profile information and appearance.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* Profile Photo */}
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
              {imageUrl && isValidImageUrl(imageUrl) ? (
                <Image
                  src={imageUrl}
                  alt={name || "Profile"}
                  width={80}
                  height={80}
                  unoptimized
                  className="size-full object-cover"
                />
              ) : (
                <span className="text-2xl font-semibold text-primary">
                  {name.trim().charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>

            <div className="flex min-w-0 flex-col gap-1">
              <p className="font-heading font-semibold">
                {name || "Your profile"}
              </p>

              <p className="text-sm text-muted-foreground">
                Add an image URL to update your profile photo.
              </p>
            </div>
          </div>

          <Separator />

          <form
            id="profile-form"
            onSubmit={handleSave}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-name">Full name</Label>

              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                maxLength={100}
                required
                className="h-10 bg-card"
              />
            </div>

            {/* Email - Read Only */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-email">Email address</Label>

              <Input
                id="profile-email"
                type="email"
                value={user.email}
                readOnly
                className="h-10 cursor-not-allowed bg-muted"
              />

              <p className="text-xs text-muted-foreground">
                Email address cannot be changed.
              </p>
            </div>

            {/* Image URL */}
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="profile-image">Profile image URL</Label>

              <div className="relative">
                <CameraIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="profile-image"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/profile.jpg"
                  className="h-10 bg-card pl-9"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Paste a direct image URL. Leave empty to remove your photo.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Save Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={handleDiscard}
          disabled={saving}
          className="h-11 w-full rounded-full px-6 text-muted-foreground sm:w-auto"
        >
          Discard
        </Button>

        <Button
          type="submit"
          form="profile-form"
          disabled={saving}
          className="h-11 w-full rounded-full px-7 sm:w-auto"
        >
          <CheckIcon className="size-4" />
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
};
