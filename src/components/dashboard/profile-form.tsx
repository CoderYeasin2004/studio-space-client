"use client";

import * as React from "react";
import Image from "next/image";
import { CameraIcon, CheckIcon, MapPinIcon, ShieldCheckIcon } from "lucide-react";
import { img } from "@/lib/images";
import { userProfile } from "@/data/bookings";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Preferences {
  bookingEmails: boolean;
  marketingEmails: boolean;
  newStudioAlerts: boolean;
  hostAlerts: boolean;
}

const defaultPreferences: Preferences = {
  bookingEmails: true,
  marketingEmails: false,
  newStudioAlerts: true,
  hostAlerts: true,
};

/**
 * Profile settings form. Reads the mock `userProfile` as its initial state,
 * keeps every change local and confirms with a toast — no API is involved.
 */
export function ProfileForm() {
  const [form, setForm] = React.useState({
    name: userProfile.name,
    email: userProfile.email,
    role: userProfile.role,
    location: userProfile.location,
    bio: userProfile.bio,
  });
  const [prefs, setPrefs] = React.useState<Preferences>(defaultPreferences);
  const [saving, setSaving] = React.useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggle<K extends keyof Preferences>(key: K) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.name.trim().length < 2) {
      toast.add({
        type: "warning",
        title: "Name is too short",
        description: "Add at least two characters so hosts know who you are.",
      });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast.add({
        type: "warning",
        title: "Check your email",
        description: "Enter a valid address before saving.",
      });
      return;
    }

    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      toast.add({
        type: "success",
        title: "Profile updated",
        description: "Your changes were saved to this demo session.",
      });
    }, 450);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ---------- Identity ---------- */}
      <Card className="gap-5">
        <CardHeader>
          <CardTitle className="font-heading text-lg tracking-[-0.01em]">
            Profile
          </CardTitle>
          <CardDescription>
            How you appear to hosts and other creators.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-full bg-muted ring-4 ring-background">
              <Image
                src={img(userProfile.avatar, "avatar")}
                alt={userProfile.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-heading font-semibold">{userProfile.name}</p>
              <p className="text-sm text-muted-foreground">
                Member since {userProfile.joined}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-fit rounded-full"
                onClick={() =>
                  toast.add({
                    type: "info",
                    title: "Photo upload is demo-only",
                    description: "File uploads aren't wired up in this build.",
                  })
                }
              >
                <CameraIcon className="size-3.5" />
                Change photo
              </Button>
            </div>
          </div>

          <Separator />

          {/* Fields */}
          <form
            id="profile-form"
            onSubmit={handleSave}
            noValidate
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-name">Full name</Label>
              <Input
                id="profile-name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                autoComplete="name"
                className="h-10 bg-card"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-email">Email address</Label>
              <Input
                id="profile-email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                autoComplete="email"
                className="h-10 bg-card"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-role">What you do</Label>
              <Input
                id="profile-role"
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
                className="h-10 bg-card"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-location">Based in</Label>
              <div className="relative">
                <MapPinIcon
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="profile-location"
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  autoComplete="address-level2"
                  className="h-10 bg-card pl-9"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="profile-bio">Bio</Label>
              <Textarea
                id="profile-bio"
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
                rows={4}
                maxLength={320}
                className="min-h-28 bg-card text-[15px] leading-relaxed"
              />
              <p className="text-xs text-muted-foreground tabular-nums">
                {form.bio.length}/320
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ---------- Notifications ---------- */}
      <Card className="gap-5">
        <CardHeader>
          <CardTitle className="font-heading text-lg tracking-[-0.01em]">
            Notifications
          </CardTitle>
          <CardDescription>
            Decide what lands in your inbox. Everything is off by default
            except the essentials.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <PreferenceRow
            id="pref-bookings"
            label="Booking updates"
            description="Confirmations, reminders and changes to your sessions."
            checked={prefs.bookingEmails}
            onChange={() => toggle("bookingEmails")}
          />
          <PreferenceRow
            id="pref-alerts"
            label="New studios in your city"
            description="A short note when a matching space goes live."
            checked={prefs.newStudioAlerts}
            onChange={() => toggle("newStudioAlerts")}
          />
          <PreferenceRow
            id="pref-host"
            label="Host activity"
            description="Messages, requests and payouts on your listings."
            checked={prefs.hostAlerts}
            onChange={() => toggle("hostAlerts")}
          />
          <PreferenceRow
            id="pref-marketing"
            label="Product news & offers"
            description="Occasional updates from the StudioSpace team."
            checked={prefs.marketingEmails}
            onChange={() => toggle("marketingEmails")}
          />
        </CardContent>
      </Card>

      {/* ---------- Security ---------- */}
      <Card className="gap-5">
        <CardHeader>
          <CardTitle className="font-heading text-lg tracking-[-0.01em]">
            Security
          </CardTitle>
          <CardDescription>
            This build stores no credentials — these controls are visual only.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheckIcon className="size-4" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm font-medium">Password</p>
              <p className="text-sm text-muted-foreground">
                Last changed {userProfile.joined}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full rounded-full sm:w-auto"
            onClick={() =>
              toast.add({
                type: "info",
                title: "Password change is demo-only",
                description: "No credentials are stored by this frontend.",
              })
            }
          >
            Change password
          </Button>
        </CardContent>
      </Card>

      {/* ---------- Save bar ---------- */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button
          variant="ghost"
          className="h-11 w-full rounded-full px-6 text-muted-foreground sm:w-auto"
          onClick={() => {
            setForm({
              name: userProfile.name,
              email: userProfile.email,
              role: userProfile.role,
              location: userProfile.location,
              bio: userProfile.bio,
            });
            setPrefs(defaultPreferences);
            toast.add({
              type: "info",
              title: "Changes discarded",
              description: "The form was reset to your saved profile.",
            });
          }}
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
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}

function PreferenceRow({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg px-1 py-3 transition-colors hover:bg-muted/40">
      <div className="min-w-0">
        <label
          htmlFor={id}
          className="cursor-pointer text-sm font-medium select-none"
        >
          {label}
        </label>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
