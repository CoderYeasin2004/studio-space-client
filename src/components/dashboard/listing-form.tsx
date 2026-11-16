"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, CheckIcon, FileTextIcon, InfoIcon, XIcon } from "lucide-react";
import { cn } from "cn";
import { categories, categoryLabels } from "@/data/categories";
import { formatCurrency } from "@/lib/currency";
import type { TListingStatus, IStudio, IStudioAmenity } from "@/types/studio";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { authClient, useSession } from "@/lib/auth-client";
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


const AMENITY_OPTIONS: IStudioAmenity[] = [
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

const statusItems: Record<TListingStatus, string> = {
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
  securityDeposit: string;
  status: TListingStatus;
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
  securityDeposit: "0",
  status: "draft",
};

const stateFrom = (studio: IStudio): ListingFormState => {
  return {
    name: studio.name ?? "",
    category: studio.category ?? emptyState.category,
    city: studio.city ?? "",
    location: studio.location ?? "",
    description: studio.description ?? "",
    longDescription: studio.longDescription ?? "",
    capacity: String(studio.capacity ?? 8),
    size: String(studio.size ?? 60),
    price: String(studio.hourlyPrice ?? 75),
    securityDeposit: String(
      (studio as unknown as Record<string, unknown>).securityDeposit ?? 0,
    ),
    status: studio.status ?? "draft",
  };
};

export const ListingForm = ({
  initial,
  listingId,
}: {
  initial?: IStudio;
  listingId?: string;
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const isEdit = Boolean(initial);

  const [form, setForm] = React.useState<ListingFormState>(
    initial ? stateFrom(initial) : emptyState,
  );
  const [imageUrl, setImageUrl] = React.useState("");

  const [imageUrls, setImageUrls] = React.useState<string[]>(
    initial?.images ?? [],
  );
 const [amenities, setAmenities] = React.useState<IStudioAmenity[]>(
  initial?.amenities ?? [],
);

  const [saving, setSaving] = React.useState(false);

  const setName = (value: string) => {
    setForm((prev) => ({ ...prev, name: value }));
  };

  const setCategory = (value: string) => {
    setForm((prev) => ({ ...prev, category: value }));
  };

  const setStatus = (value: TListingStatus) => {
    setForm((prev) => ({ ...prev, status: value }));
  };

  const setCity = (value: string) => {
    setForm((prev) => ({ ...prev, city: value }));
  };

  const setLocation = (value: string) => {
    setForm((prev) => ({ ...prev, location: value }));
  };

  const setDescription = (value: string) => {
    setForm((prev) => ({ ...prev, description: value }));
  };

  const setLongDescription = (value: string) => {
    setForm((prev) => ({ ...prev, longDescription: value }));
  };

  const setCapacity = (value: string) => {
    setForm((prev) => ({ ...prev, capacity: value }));
  };

  const setSize = (value: string) => {
    setForm((prev) => ({ ...prev, size: value }));
  };

  const setPrice = (value: string) => {
    setForm((prev) => ({ ...prev, price: value }));
  };

  const setSecurityDeposit = (value: string) => {
    setForm((prev) => ({ ...prev, securityDeposit: value }));
  };

  const toggleAmenity = (option: IStudioAmenity) => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { getTokenFromClient } = await import("@/lib/getTokenFromClient");
    const token = await getTokenFromClient();
    if (!user) {
  toast.add({
    type: "warning",
    title: "Please login first",
    description: "You need to login before creating a listing.",
  });
  return;
}

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
    const securityDeposit = Number(form.securityDeposit);

    if (!Number.isFinite(price) || price <= 0) {
      toast.add({
        type: "warning",
        title: "Set a valid hourly price",
      });
      return;
    }

    if (!Number.isFinite(securityDeposit) || securityDeposit < 0) {
      toast.add({
        type: "warning",
        title: "Set a valid security deposit",
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
    const status: TListingStatus =
      intent === "publish" ? "live" : intent === "draft" ? "draft" : form.status;

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
      securityDeposit,
      status,
      amenities,
      images: imageUrls,
      rating: initial?.rating ?? 0,
      reviewCount: initial?.reviewCount ?? 0,
      featured: initial?.featured ?? false,
      tags: initial?.tags ?? [],
      ...(initial?.host && { host: initial.host }),
    };
       if (isEdit && !listingId) {
      toast.add({
        type: "error",
        title: "Listing ID missing",
      });
      return;
    }

    try {
      setSaving(true);

      if (!token) {
        toast.add({
          type: "error",
          title: "Authentication required",
          description: "Please log in to save your studio listing.",
        });
        return;
      }

      const endpoint =
        isEdit && listingId
          ? `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios/${encodeURIComponent(listingId)}`
          : `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios`;
     
      const response = await fetch(endpoint, {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          isEdit
            ? newStudio
            : {
                ...newStudio,
                creatorId: user.id,
                creatorEmail: user.email,
              },
        ),
      });

      if (!response.ok) {
        throw new Error("Failed to save studio");
      }

      const data = await response.json();

      if (!data.acknowledged || (isEdit && data.matchedCount === 0)) {
        throw new Error("Studio was not saved");
      }

      toast.add({
        type: "success",
        title: isEdit
          ? "Studio updated successfully!"
          : "Studio added successfully!",
        description: `${form.name} has been ${isEdit ? "updated" : "saved"}.`,
      });

      router.push("/dashboard/my-listings");
    } catch {
      toast.add({
        type: "error",
        title: "Something went wrong",
        description: isEdit
          ? "Could not update your studio. Please try again."
          : "Could not save your studio. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <Link
        href="/dashboard/my-listings"
        className="group inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-0.5" />
        Back to listings
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-6 lg:col-span-8">
          <Card className="gap-5">
            <CardHeader>
              <CardTitle className="font-heading text-lg tracking-[-0.01em]">
                Account
              </CardTitle>
              <CardDescription>
                Listings are created under your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="listing-user-name">Name</Label>
                <Input
                  id="listing-user-name"
                  type="text"
                  value={user?.name ?? ""}
                  readOnly
                  className="h-10 bg-muted cursor-not-allowed"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="listing-user-email">Email</Label>
                <Input
                  id="listing-user-email"
                  type="email"
                  value={user?.email ?? ""}
                  readOnly
                  className="h-10 bg-muted cursor-not-allowed"
                />
              </div>
            </CardContent>
          </Card>

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
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lumen Daylight Loft"
                  className="h-10 bg-card"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="listing-category">Discipline</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setCategory(v ?? emptyState.category)
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
                    setStatus(v ?? "draft")
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
                    {(Object.keys(statusItems) as TListingStatus[]).map((s) => (
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
                  onChange={(e) => setCity(e.target.value)}
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
                  onChange={(e) => setLocation(e.target.value)}
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
                  onChange={(e) => setDescription(e.target.value)}
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
                  onChange={(e) => setLongDescription(e.target.value)}
                  rows={5}
                  placeholder="Everything a booker needs: light, access, kit on site, house rules."
                  className="min-h-36 bg-card text-[15px] leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>

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
                        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium cursor-pointer outline-none transition-all focus-visible:ring-3 focus-visible:ring-ring/50",
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
                      className="absolute right-1.5 top-1.5 rounded-full bg-black/70 px-2 py-1 text-xs text-white cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

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
                  onChange={(e) => setCapacity(e.target.value)}
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
                  onChange={(e) => setSize(e.target.value)}
                  className="h-10 bg-card tabular-nums"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="listing-price">Hourly price (BDT)</Label>
                <Input
                  id="listing-price"
                  type="number"
                  name="price"
                  min={1}
                  step={5}
                  value={form.price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="h-10 bg-card tabular-nums"
                />
                <p className="text-xs text-muted-foreground">
                  Guests also pay an 8% service fee at checkout.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="listing-security-deposit">
                  Security deposit (BDT)
                </Label>
                <Input
                  id="listing-security-deposit"
                  type="number"
                  name="securityDeposit"
                  min={0}
                  step={50}
                  value={form.securityDeposit}
                  onChange={(e) => setSecurityDeposit(e.target.value)}
                  className="h-10 bg-card tabular-nums"
                />
                <p className="text-xs text-muted-foreground">
                  Refundable deposit held at booking.
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
                    {formatCurrency(form.price || 0)}/hr
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
                  name="intent"
                  value="publish"
                  size="lg"
                  disabled={saving}
                  className="h-11 w-full rounded-full"
                >
                  <CheckIcon className="size-4" />

                  {saving ? "Saving…" : isEdit ? "Publish Changes" : "Publish Listing"}
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

                  {saving ? "Saving…" : isEdit ? "Save Changes as Draft" : "Save as Draft"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-11 w-full rounded-full"
                  onClick={() => router.push("/dashboard/my-listings")}
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
