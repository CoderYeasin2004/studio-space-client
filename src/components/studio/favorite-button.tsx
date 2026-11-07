"use client";

import * as React from "react";
import { HeartIcon } from "lucide-react";
import { cn } from "cn";
import { useFavorites } from "@/hooks/use-favorites";
import { toast } from "@/components/ui/toast";

/**
 * Heart toggle used on cards, galleries and detail pages.
 * Visual state only — backed by local storage.
 *
 * Adds a delightful particle burst animation when a favorite is added
 * and a subtle scale-down when removed. Respects prefers-reduced-motion.
 */
export const FavoriteButton = ({
  studioId,
  studioName,
  className,
  size = "md",
  showLabel = false,
}: {
  studioId: string;
  studioName: string;
  className?: string;
  size?: "sm" | "md";
  showLabel?: boolean;
}) => {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(studioId);
  const [animating, setAnimating] = React.useState(false);
  const [particles, setParticles] = React.useState<{ x: number; y: number }[]>([]);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const wasActiveRef = React.useRef(active);

  React.useEffect(() => {
    // Detect transition from not-favorited to favorited (adding)
    if (!wasActiveRef.current && active && !prefersReducedMotion) {
      // Generate particles in a circle around the heart
      const newParticles = Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const distance = 20 + Math.random() * 15;
        return {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
        };
      });
      setParticles(newParticles);

      // Particles render at center first, then animate outward on next frame
      const raf = requestAnimationFrame(() => {
        setAnimating(true);
      });

      const timer = setTimeout(() => {
        setAnimating(false);
        setParticles([]);
      }, 500);

      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
      };
    }

    // Detect transition from favorited to not-favorited (removing)
    if (wasActiveRef.current && !active && !prefersReducedMotion) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }

    wasActiveRef.current = active;
  }, [active, prefersReducedMotion]);

  // Toast notification
  React.useEffect(() => {
    if (!wasActiveRef.current && active) {
      toast.add({
        type: "success",
        title: "Saved to favourites",
        description: studioName,
      });
    }
    wasActiveRef.current = active;
  }, [active, studioName]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(studioId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={
        active ? `Remove ${studioName} from favourites` : `Save ${studioName}`
      }
      className={cn(
        "relative inline-flex items-center justify-center gap-1.5 rounded-full border border-background/60 bg-background/85 text-foreground shadow-sm backdrop-blur-md outline-none transition-all duration-200 hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-95",
        active && "border-primary/50 text-primary",
        className,
      )}
    >
      {/* Particle burst (only when adding) */}
      {!prefersReducedMotion && particles.length > 0 && (
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            width: size === "md" ? "24px" : "20px",
            height: size === "md" ? "24px" : "20px",
          }}
        >
          {particles.map((p, i) => (
            <span
              key={i}
              className="absolute top-1/2 left-1/2 size-1.5 bg-rose-500 rounded-full shadow-[0_0_4px_rgba(225,29,72,0.8)]"
              style={{
                transform: animating
                  ? `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`
                  : "translate(-50%, -50%)",
                opacity: animating ? 0 : 1,
                transition:
                  "transform 400ms cubic-bezier(0.25, 1, 0.5, 1), opacity 400ms ease-out",
              }}
            />
          ))}
        </span>
      )}

      <HeartIcon
        className={cn(
          size === "md" ? "size-4" : "size-3.5",
          active && "fill-current",
        )}
        style={{
          transition:
            active || animating
              ? "all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)"
              : "all 200ms ease",
          transform: animating && !active ? "scale(1.2)" : undefined,
          color: active
            ? undefined
            : animating && !active
              ? "text-rose-500"
              : undefined,
        }}
      />
      {showLabel && (
        <span className="pr-1 text-xs font-medium">
          {active ? "Saved" : "Save"}
        </span>
      )}
    </button>
  );
};
