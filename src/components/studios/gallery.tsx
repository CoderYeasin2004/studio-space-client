"use client";

import * as React from "react";
import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Maximize2Icon,
  XIcon,
} from "lucide-react";
import { cn } from "cn";
import { img } from "@/lib/images";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Studio gallery: cinematic main frame with arrows, a thumbnail rail and a
 * keyboard-navigable lightbox.
 */
export const Gallery = ({ images, name }: { images: string[]; name: string }) => {
  const [active, setActive] = React.useState(0);
  const [lightbox, setLightbox] = React.useState(false);
  const count = images.length;

  const go = React.useCallback(
    (direction: 1 | -1) =>
      setActive((i) => (i + direction + count) % count),
    [count],
  );

  React.useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, go]);

  return (
    <div>
      {/* Main frame */}
      <div className="group relative aspect-[16/11] overflow-hidden rounded-2xl bg-muted sm:aspect-[16/9] lg:aspect-[2/1]">
        <Image
          src={img(images[active], "gallery")}
          alt={`${name} — photo ${active + 1} of ${count}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="zoom-media object-cover"
        />

        <button
          type="button"
          onClick={() => setLightbox(true)}
          aria-label="Expand photo"
          className="absolute top-4 right-4 inline-flex size-9 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm outline-none transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-white/60"
        >
          <Maximize2Icon className="size-4" />
        </button>

        {count > 1 && (
          <>
            <NavButton
              side="left"
              onClick={() => go(-1)}
              label="Previous photo"
            />
            <NavButton
              side="right"
              onClick={() => go(1)}
              label="Next photo"
            />
          </>
        )}

        <span className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium tabular-nums text-white backdrop-blur-sm">
          {active + 1} / {count}
        </span>
      </div>

      {/* Thumbnail rail */}
      {count > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-current={index === active}
              className={cn(
                "relative aspect-[3/2] overflow-hidden rounded-lg bg-muted outline-none transition-all focus-visible:ring-3 focus-visible:ring-ring/50",
                index === active
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={img(image, "thumb")}
                alt=""
                fill
                sizes="(max-width: 640px) 25vw, 16vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={lightbox} onOpenChange={setLightbox}>
        <DialogContent
          showCloseButton={false}
          className="max-w-5xl gap-0 overflow-hidden border-0 bg-black p-0 shadow-none ring-0 sm:max-w-5xl"
        >
          <DialogTitle className="sr-only">{name} gallery</DialogTitle>
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={img(images[active], "hero")}
              alt={`${name} — photo ${active + 1} of ${count}`}
              fill
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-contain"
            />
          </div>
          <div className="flex items-center justify-between gap-4 px-4 py-3 text-sm text-white/80">
            <span className="tabular-nums">
              {active + 1} / {count}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous photo"
                className="inline-flex size-9 items-center justify-center rounded-full text-white outline-none transition-colors hover:bg-white/15 focus-visible:ring-3 focus-visible:ring-white/60"
              >
                <ChevronLeftIcon className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next photo"
                className="inline-flex size-9 items-center justify-center rounded-full text-white outline-none transition-colors hover:bg-white/15 focus-visible:ring-3 focus-visible:ring-white/60"
              >
                <ChevronRightIcon className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => setLightbox(false)}
                aria-label="Close gallery"
                className="inline-flex size-9 items-center justify-center rounded-full text-white outline-none transition-colors hover:bg-white/15 focus-visible:ring-3 focus-visible:ring-white/60"
              >
                <XIcon className="size-5" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const NavButton = ({
  side,
  onClick,
  label,
}: {
  side: "left" | "right";
  onClick: () => void;
  label: string;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "absolute top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm outline-none transition-all hover:bg-black/70 focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-white/60 group-hover:opacity-100",
        side === "left" ? "left-3" : "right-3",
      )}
    >
      {side === "left" ? (
        <ChevronLeftIcon className="size-5" />
      ) : (
        <ChevronRightIcon className="size-5" />
      )}
    </button>
  );
};
