"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, CheckIcon, FileTextIcon, InfoIcon, XIcon } from "lucide-react";
import { cn } from "cn";
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

const stateFrom = (studio: Studio): ListingFormState => {
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
};

export const ListingForm = ({
  initial,
  listingId,
}: {
  initial?: Studio;
  listingId?: string;
}) => {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [form, setForm] = React.useState<ListingFormState>(
    initial ? stateFrom(initial) : emptyState,
  );
  const [imageUrl, setImageUrl] = React.useState("");

  const [imageUrls, setImageUrls] = React.useState<string[]>(
    initial?.images ?? [],
  );
  const [amenities, setAmenities] = React.useState<StudioAmenity[]>(
    initial ? initial.amenities : [],
  );

  const [saving, setSaving] = React.useState(false);

  const update = <K extends keyof ListingFormState>(
    key: K,
    value: ListingFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (option: StudioAmenity) => {
    setAmenities((prev) =>
      prev.some((a) => a.name === option.name)
        ? prev.filter((a) => a.name !== option.name)
        : [...prev, option],
    );
  };
 const handleAddImage = () => {
  const value = imageUrl.trim();


  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Invalid URL");
    }

    if (imageUrls.includes(value)) {
      toast.add({
        type: "warning",
        title: "Image already added",
      });
      return;
    }

    setImageUrls((prev) => {
      const updatedImages = [...prev, value];

      console.log("Updated image URLs:", updatedImages);

      return updatedImages;
    });

    setImageUrl("");
  } catch {
    toast.add({
      type: "error",
      title: "Invalid image URL",
      description: "Please enter a valid image URL.",
    });
  }
};

  // ---------- Submit Form ----------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate before sending anything to MongoDB
    if (form.name.trim().length < 3) {
      toast.add({
        type: "warning",
        title: "Give the studio a name",
      });
      return;
    }

    if (form.city.trim().length < 2 || form.location.trim().length < 3) {
      toast.add({
        type: "warning",
        title: "Add a location",
        description: "City and area are both required.",
      });
      return;
    }

    if (form.description.trim().length < 20) {
      toast.add({
        type: "warning",
        title: "Describe the space",
        description: "Write at least 20 characters.",
      });
      return;
    }

    const price = Number(form.price);
    const capacity = Number(form.capacity);
    const size = Number(form.size);

    if (!Number.isFinite(price) || price <= 0) {
      toast.add({
        type: "warning",
        title: "Set a valid hourly price",
      });
      return;
    }

    if (
      !Number.isFinite(capacity) ||
      capacity < 1 ||
      !Number.isFinite(size) ||
      size < 1
    ) {
      toast.add({
        type: "warning",
        title: "Check capacity and floor area",
      });
      return;
    }

    // Submission intent — the clicked submit button decides the saved status;
    // pressing Enter falls back to the Visibility select above.
    const submitter = (e.nativeEvent as SubmitEvent).submitter;
    const intent =
      submitter instanceof HTMLButtonElement ? submitter.value : "";
    const status: ListingStatus =
      intent === "publish" ? "live" : intent === "draft" ? "draft" : form.status;

    // Build the MongoDB document
    const newStudio = {
      name: form.name.trim(),
      slug: form.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      category: form.category,
      city: form.city.trim(),
      location: form.location.trim(),
      country: initial?.country ?? "",
      description: form.description.trim(),
      longDescription: form.longDescription.trim(),
      capacity,
      size,
      hourlyPrice: price,
      status,
      amenities,
      images: imageUrls,
      rating: initial?.rating ?? 0,
      reviewCount: initial?.reviewCount ?? 0,
      featured: initial?.featured ?? false,
      tags: initial?.tags ?? [],
      ...(initial?.host && { host: initial.host }),
    };
    try {
      setSaving(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newStudio),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to save studio");
      }

      const data = await response.json();

      if (!data.acknowledged) {
        throw new Error("Studio was not saved");
      }

      toast.add({
        type: "success",
        title: "Studio added successfully!",
        description: `${form.name} has been saved.`,
      });

      router.push("/dashboard/listings");
    } catch (error) {
      console.error("Studio submission error:", error);

      toast.add({
        type: "error",
        title: "Something went wrong",
        description: "Could not save your studio. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

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
                  name="name"
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
                  <SelectTrigger
                    id="listing-category"
                    className="h-10 w-full bg-card"
                  >
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
                  <SelectTrigger
                    id="listing-status"
                    className="h-10 w-full bg-card"
                  >
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
                  name="city"
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
                  name="location"
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
                  name="description"
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
                  name="longDescription"
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
                Add image URLs for your studio gallery.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* Image URL Input */}
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="Paste image URL here..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddImage();
                    }
                  }}
                />

                <Button type="button" onClick={handleAddImage}>
                  Add
                </Button>
              </div>

              {/* Image Preview */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {imageUrls.map((image, index) => (
                  <div
                    key={image}
                    className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted"
                  >
                    <Image
                      src={image}
                      alt={`Studio photo ${index + 1}`}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 50vw, 160px"
                      className="object-cover"
                    />

                    <span className="absolute top-1.5 left-1.5 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-medium">
                      {index === 0 ? "Cover" : `#${index + 1}`}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setImageUrls((prev) =>
                          prev.filter((_, i) => i !== index),
                        )
                      }
                      className="absolute right-1.5 top-1.5 rounded-full bg-black/70 px-2 py-1 text-xs text-white"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
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
              <CardDescription>The numbers guests filter by.</CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="listing-capacity">Capacity (people)</Label>
                <Input
                  id="listing-capacity"
                  type="number"
                  name="capacity"
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
                  name="size"
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
                  name="price"
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

              {/* Preview */}
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

              {/* Buttons */}
              <div className="flex flex-col gap-2.5">
                <Button
                  type="submit"
                  name="intent"
                  value="publish"
                  size="lg"
                  disabled={saving}
                  className="h-11 w-full rounded-full"
                >
                  <CheckIcon className="size-4" />

                  {saving ? "Saving…" : "Publish Listing"}
                </Button>

                <Button
                  type="submit"
                  name="intent"
                  value="draft"
                  variant="outline"
                  size="lg"
                  disabled={saving}
                  className="h-11 w-full rounded-full"
                >
                  <FileTextIcon className="size-4" />

                  {saving ? "Saving…" : "Save as Draft"}
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
};
