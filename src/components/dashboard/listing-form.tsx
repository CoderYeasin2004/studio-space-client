"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  CheckIcon,
  ImagePlusIcon,
  InfoIcon,
  XIcon,
} from "lucide-react";
import { cn } from "cn";
import { img } from "@/lib/images";
import { categories, categoryLabels } from "@/data/categories";
import type { ListingStatus, Studio, StudioAmenity } from "@/types/studio";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AmenityIcon } from "@/components/studios/amenity-icon";

/** Amenities offered as toggle chips — a representative subset of the catalogue. */
const AMENITY_OPTIONS: StudioAmenity[] = [
  { name: "Fast Wi-Fi", icon: "wifi" },
  { name: "Blackout blinds", icon: "moon" },
  { name: "Client lounge", icon: "sofa" },
  { name: "Coffee bar", icon: "coffee" },
  { name: "Natural light", icon: "sun" },
  { name: "Acoustic treatment", icon: "waves" },
  { name: "Cyclorama", icon: "wall" },
  { name: "Parking", icon: "car" },
  { name: "Freight lift", icon: "arrow-up-down" },
  { name: "Green room", icon: "armchair" },
  { name: "24/7 access", icon: "clock" },
  { name: "Editing suite", icon: "monitor" },
];

const statusItems: Record<ListingStatus, string> = {
  live: "Live — visible in Explore",
  draft: "Draft — only you can see it",
  paused: "Paused — hidden until resumed",
};

interface ListingFormState {
  name: string;
  category: string;
  city: string;
  location: string;
  description: string;
  longDescription: string;
  capacity: string;
  size: string;
  price: string;
  status: ListingStatus;
}

const emptyState: ListingFormState = {
  name: "",
  category: "photography",
  city: "",
  location: "",
  description: "",
  longDescription: "",
  capacity: "8",
  size: "60",
  price: "75",
  status: "draft",
};

function stateFrom(studio: Studio): ListingFormState {
  return {
    name: studio.name,
    category: studio.category,
    city: studio.city,
    location: studio.location,
    description: studio.description,
    longDescription: studio.longDescription,
    capacity: String(studio.capacity),
    size: String(studio.size),
    price: String(studio.hourlyPrice),
    status: studio.status,
  };
}

/**
 * Create / edit listing form. Used by both `/dashboard/listings/new` (no
 * initial value) and `/dashboard/listings/[id]/edit` (prefilled). Submit is
 * mock: it validates, toasts and returns to the listings index.
 */
export function ListingForm({
  initial,
  listingId,
}: {
  initial?: Studio;
  listingId?: string;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [form, setForm] = React.useState<ListingFormState>(
    initial ? stateFrom(initial) : emptyState,
  );
  const [amenities, setAmenities] = React.useState<StudioAmenity[]>(
    initial ? initial.amenities : [],
  );
  const [saving, setSaving] = React.useState(false);

  function update<K extends keyof ListingFormState>(
    key: K,
    value: ListingFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleAmenity(option: StudioAmenity) {
    setAmenities((prev) =>
      prev.some((a) => a.name === option.name)
        ? prev.filter((a) => a.name !== option.name)
        : [...prev, option],
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.name.trim().length < 3) {
      toast.add({
        type: "warning",
        title: "Give the studio a name",
        description: "Three characters or more, so people can find it.",
      });
      return;
    }
    if (form.city.trim().length < 2 || form.location.trim().length < 3) {
      toast.add({
        type: "warning",
        title: "Add a location",
        description: "City and street or area are both required.",
      });
      return;
    }
    if (form.description.trim().length < 20) {
      toast.add({
        type: "warning",
        title: "Describe the space",
        description: "Write at least a couple of sentences about the studio.",
      });
      return;
    }
    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) {
      toast.add({
        type: "warning",
        title: "Set an hourly price",
        description: "Enter a number greater than zero.",
      });
      return;
    }

    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      toast.add({
        type: "success",
        title: isEdit ? "Listing updated" : "Listing created",
        description: isEdit
          ? `${form.name} was saved.`
          : `${form.name} was saved as a ${form.status === "live" ? "live listing" : form.status}.`,
      });
      router.push("/dashboard/listings");
    }, 500);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* ---------- Back link ---------- */}
      <Link
        href="/dashboard/listings"
        className="group inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-0.5" />
        Back to listings
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        {/* ---------- Main column ---------- */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          {/* Basics */}
          <Card className="gap-5">
            <CardHeader>
              <CardTitle className="font-heading text-lg tracking-[-0.01em]">
                The basics
              </CardTitle>
              <CardDescription>
                What the space is called, where it is and what it&apos;s for.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="listing-name">Studio name</Label>
                <Input
                  id="listing-name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. Lumen Daylight Loft"
                  className="h-10 bg-card"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="listing-category">Discipline</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    update("category", v ?? emptyState.category)
                  }
                  items={Object.fromEntries(
                    categories.map((c) => [c.id, c.name]),
                  )}
                >
                  <SelectTrigger id="listing-category" className="h-10 w-full bg-card">
                    <SelectValue placeholder="Choose a discipline" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="listing-status">Visibility</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    update("status", (v ?? "draft") as ListingStatus)
                  }
                  items={statusItems}
                >
                  <SelectTrigger id="listing-status" className="h-10 w-full bg-card">
                    <SelectValue placeholder="Draft" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(statusItems) as ListingStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {statusItems[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="listing-city">City</Label>
                <Input
                  id="listing-city"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="London"
                  className="h-10 bg-card"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="listing-location">Area / street</Label>
                <Input
                  id="listing-location"
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  placeholder="Shoreditch, London"
                  className="h-10 bg-card"
                />
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="listing-description">Short description</Label>
                <Textarea
                  id="listing-description"
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={3}
                  placeholder="One or two sentences shown on the card and at the top of the page."
                  className="min-h-24 bg-card text-[15px] leading-relaxed"
                />
                <p className="text-xs text-muted-foreground tabular-nums">
                  {form.description.length}/240
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="listing-long">About this space</Label>
                <Textarea
                  id="listing-long"
                  value={form.longDescription}
                  onChange={(e) => update("longDescription", e.target.value)}
                  rows={5}
                  placeholder="Everything a booker needs: light, access, kit on site, house rules."
                  className="min-h-36 bg-card text-[15px] leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card className="gap-5">
            <CardHeader>
              <CardTitle className="font-heading text-lg tracking-[-0.01em]">
                What&apos;s included
              </CardTitle>
              <CardDescription>
                Pick everything guests can expect when they arrive.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {AMENITY_OPTIONS.map((option) => {
                  const selected = amenities.some(
                    (a) => a.name === option.name,
                  );
                  return (
                    <button
                      key={option.name}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleAmenity(option)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium outline-none transition-all focus-visible:ring-3 focus-visible:ring-ring/50",
                        selected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                      )}
                    >
                      <AmenityIcon name={option.icon} className="size-4" />
                      {option.name}
                      {selected && <CheckIcon className="size-3.5" />}
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                <InfoIcon className="size-3.5" />
                {amenities.length} selected
              </p>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card className="gap-5">
            <CardHeader>
              <CardTitle className="font-heading text-lg tracking-[-0.01em]">
                Photos
              </CardTitle>
              <CardDescription>
                {initial
                  ? "Your current gallery. Uploading is demo-only in this build."
                  : "Uploading is demo-only — a gallery appears once a backend is connected."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {initial ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {initial.images.map((image, index) => (
                    <div
                      key={image}
                      className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted"
                    >
                      <Image
                        src={img(image, "thumb")}
                        alt={`${initial.name} photo ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 50vw, 160px"
                        className="object-cover"
                      />
                      <span className="absolute top-1.5 left-1.5 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-medium backdrop-blur">
                        {index === 0 ? "Cover" : `#${index + 1}`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
                  <span className="inline-flex size-12 items-center justify-center rounded-full border border-border bg-card text-primary">
                    <ImagePlusIcon className="size-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-sm font-medium">No photos yet</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Aim for six to ten: wide room shots, details, and the
                      light at different times of day.
                    </p>
                  </div>
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                className="w-full rounded-full"
                onClick={() =>
                  toast.add({
                    type: "info",
                    title: "Uploads are demo-only",
                    description: "File storage isn't connected in this build.",
                  })
                }
              >
                <ImagePlusIcon className="size-4" />
                {initial ? "Add more photos" : "Upload photos"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ---------- Sidebar ---------- */}
        <aside className="flex flex-col gap-6 lg:col-span-4">
          <Card className="gap-5 lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle className="font-heading text-lg tracking-[-0.01em]">
                Space &amp; pricing
              </CardTitle>
              <CardDescription>
                The numbers guests filter by.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="listing-capacity">Capacity (people)</Label>
                <Input
                  id="listing-capacity"
                  type="number"
                  min={1}
                  max={500}
                  value={form.capacity}
                  onChange={(e) => update("capacity", e.target.value)}
                  className="h-10 bg-card tabular-nums"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="listing-size">Floor area (m²)</Label>
                <Input
                  id="listing-size"
                  type="number"
                  min={4}
                  max={5000}
                  value={form.size}
                  onChange={(e) => update("size", e.target.value)}
                  className="h-10 bg-card tabular-nums"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="listing-price">Hourly price (£)</Label>
                <Input
                  id="listing-price"
                  type="number"
                  min={1}
                  step={5}
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                  className="h-10 bg-card tabular-nums"
                />
                <p className="text-xs text-muted-foreground">
                  Guests also pay an 8% service fee at checkout.
                </p>
              </div>

              <Separator />

              <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/40 p-3.5 text-sm">
                <p className="font-medium">Preview</p>
                <p className="line-clamp-2 text-muted-foreground">
                  {form.name.trim() || "Untitled studio"}
                </p>
                <p className="text-muted-foreground">
                  {form.city.trim() || "City"} · {form.capacity || "0"} people ·{" "}
                  <span className="font-medium text-foreground">
                    £{form.price || "0"}/hr
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {categoryLabels[
                    form.category as keyof typeof categoryLabels
                  ] ?? "Uncategorised"}
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                <Button
                  type="submit"
                  size="lg"
                  disabled={saving}
                  className="h-11 w-full rounded-full"
                >
                  <CheckIcon className="size-4" />
                  {saving
                    ? "Saving…"
                    : isEdit
                      ? "Save changes"
                      : form.status === "live"
                        ? "Publish listing"
                        : "Save listing"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-11 w-full rounded-full"
                  onClick={() => router.push("/dashboard/listings")}
                >
                  <XIcon className="size-4" />
                  Cancel
                </Button>
              </div>

              {isEdit && listingId && (
                <p className="text-center text-xs text-muted-foreground">
                  Editing listing {listingId}
                </p>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </form>
  );
}
