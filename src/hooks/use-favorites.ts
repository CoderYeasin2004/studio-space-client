"use client";

import * as React from "react";

const STORAGE_KEY = "studiospace-favorites";
const DEFAULTS: string[] = ["st-02", "st-04", "st-10", "st-05"];

/**
 * Favourites live in a tiny external store (not component state) so reading
 * localStorage never becomes a setState-in-effect cascade. Swap the store's
 * internals for your API later without touching call sites.
 */
let ids: Set<string> = new Set(DEFAULTS);
const listeners = new Set<() => void>();
let loaded = false;

const load = () => {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) ids = new Set(parsed as string[]);
    }
  } catch {
    /* ignore corrupt storage */
  }
};

const persist = () => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    /* storage unavailable */
  }
};

const subscribe = (listener: () => void) => {
  load();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => {
  load();
  return ids;
};

const toggleId = (id: string) => {
  load();
  const next = new Set(ids);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  ids = next;
  persist();
  listeners.forEach((l) => l());
};

/** Client-side favourites backed by localStorage. */
export const useFavorites = () => {
  const current = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => ids,
  );

  const toggle = React.useCallback((id: string) => toggleId(id), []);
  const isFavorite = React.useCallback(
    (id: string) => current.has(id),
    [current],
  );

  return { ids: current, isFavorite, toggle, count: current.size };
};
