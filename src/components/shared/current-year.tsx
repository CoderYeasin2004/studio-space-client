"use client";

/**
 * Copyright year. Reads the clock on the client so the static prerendered
 * shell never depends on the current time (`cacheComponents` rejects
 * `new Date()` inside prerendered Server Components).
 */
export function CurrentYear() {
  return <>{new Date().getFullYear()}</>;
}
