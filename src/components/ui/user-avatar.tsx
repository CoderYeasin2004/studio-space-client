"use client";

import { useState } from "react";
import { UserRoundIcon } from "lucide-react";
import { cn } from "cn";

/**
 * Validates that a value is a loadable HTTP/HTTPS URL.
 * Returns false for undefined, null, empty strings, or malformed URLs.
 */
const isValidImageUrl = (value?: string | null): boolean => {
  if (!value || typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

interface UserAvatarProps {
  /** Profile image URL from the authenticated session */
  image?: string | null;
  /** User's display name, used for initials fallback and alt text */
  name?: string | null;
  /** Avatar size variant */
  size?: "default" | "sm" | "lg";
  /** Additional Tailwind classes */
  className?: string;
}

/**
 * Reliable user profile avatar with loading skeleton and error fallback.
 *
 * Uses a plain `` element instead of Base UI Avatar primitives because
 * the Base UI AvatarPrimitive.Root manages fallback visibility internally
 * via data attributes. Manually swapping children caused the fallback to
 * never mount, leaving a blank dark circle (the Avatar's `after:`
 * pseudo-element with mix-blend-darken was the only visible layer).
 *
 * Behavior:
 * - Shows a skeleton while a valid image URL loads.
 * - Shows the actual profile photo on successful load.
 * - Shows user initials on image load failure or invalid/missing URL.
 * - Shows a generic user icon if the name is missing.
 * - Never leaves a blank black circle.
 */
export const UserAvatar = ({
  image,
  name,
  size = "default",
  className,
}: UserAvatarProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const isValid = isValidImageUrl(image);
  const initials = name?.charAt(0).toUpperCase() || "?";
  const showFallback = !isValid || hasError;

  const sizeClasses: Record<string, string> = {
    default: "h-8 w-8",
    sm: "h-6 w-6",
    lg: "h-10 w-10",
  };

  return (
    <div
      className={cn(
        "relative flex shrink-0 rounded-full border border-border",
        sizeClasses[size],
        className,
      )}
    >
      {/* Skeleton while loading a valid image URL */}
      {isValid && isLoading && !hasError && (
        <div className="absolute inset-0 rounded-full bg-muted animate-pulse" />
      )}

      {/* Profile image — rendered whenever the URL is valid and not in error
         state. It must mount immediately (not be gated behind !isLoading) so
         its onLoad/onError handlers can fire and resolve the loading state.
         Gating it behind !isLoading while isLoading starts true created a
         chicken-and-egg: the image element never mounted, onLoad/onError never fired,
         isLoading stayed true forever, and a permanent skeleton was shown
         instead of the photo or the fallback initials. */}
      {isValid && !hasError ? (
        <img
          src={image!}
          alt={name || "Profile"}
          className="size-full rounded-full object-cover"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      ) : null}

      {/* Fallback: user initials or generic user icon */}
      {showFallback ? (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-muted">
          {!name ? (
            <UserRoundIcon className="size-4 text-muted-foreground" />
          ) : (
            <span className="text-sm font-medium text-muted-foreground">
              {initials}
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
};
