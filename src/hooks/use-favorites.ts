"use client";

import * as React from "react";
import { useSession } from "@/lib/auth-client";

export interface FavoriteItem {
  studioId: string;
  addedAt: string; // ISO 8601 timestamp
}

interface StoreSnapshot {
  initialized: boolean;
  items: Map<string, FavoriteItem>;
}

const GUEST_STORAGE_KEY = "studiospace-favorites-guest";

function userStorageKey(email: string) {
  return `studiospace-favorites-${email}`;
}

/**
 * Centralized favorite store shared by every component on the site.
 *
 * Two modes:
 *  • Guest — persisted to localStorage under `studiospace-favorites-guest`
 *  • Auth  — persisted per-authenticated-user (localStorage keyed by email;
 *            API calls are structured below and ready to wire up once the
 *            backend favourite endpoints exist).
 *
 * Mode switches automatically when the session changes. On login, guest
 * favourites are merged into the authenticated user's store without
 * duplicating entries.
 *
 * Initialization status (`initialized`) is part of the stable snapshot so
 * that `useSyncExternalStore` can detect when persisted data is ready and
 * trigger a single re-render — no cascading setState-in-effect.
 */
let mode: "guest" | "auth" = "guest";
let userEmail: string | null = null;
let items: Map<string, FavoriteItem> = new Map();
let initialized = false;
let cachedSnapshot: StoreSnapshot = {
  initialized: false,
  items: new Map(),
};
const listeners = new Set<() => void>();
let hydrated = false;

function storageKey() {
  return mode === "auth" && userEmail ? userStorageKey(userEmail) : GUEST_STORAGE_KEY;
}

function load() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(storageKey());
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const next = new Map<string, FavoriteItem>();
        for (const item of parsed) {
          if (
            item &&
            typeof item === "object" &&
            "studioId" in item &&
            typeof (item as FavoriteItem).studioId === "string"
          ) {
            next.set((item as FavoriteItem).studioId, item as FavoriteItem);
          }
        }
        items = next;
      }
    }
  } catch {
    /* ignore corrupt storage */
  }
}

function refreshSnapshot() {
  cachedSnapshot = { initialized, items: new Map(items) };
}

function save() {
  try {
    window.localStorage.setItem(storageKey(), JSON.stringify([...items.values()]));
  } catch {
    /* storage unavailable */
  }
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): StoreSnapshot {
  load();
  return cachedSnapshot;
}

function getServerSnapshot(): StoreSnapshot {
  return cachedSnapshot;
}

/** Switch between guest and auth storage, merging guest into auth on login. */
function setMode(newMode: "guest" | "auth", email: string | null) {
  // Persist current mode's data before switching.
  save();

  const wasGuest = mode === "guest";
  const guestItems = new Map(items);

  mode = newMode;
  userEmail = email;
  hydrated = false;
  load();

  if (wasGuest && newMode === "auth" && email && guestItems.size > 0) {
    // Merge guest favourites into the authenticated store without duplicates.
    let merged = false;
    for (const [studioId, item] of guestItems) {
      if (!items.has(studioId)) {
        items.set(studioId, item);
        merged = true;
      }
    }
    if (merged) {
      save();
    }
  }

  initialized = true;
  refreshSnapshot();
  listeners.forEach((l) => l());
}

function toggle(studioId: string) {
  load();
  const existing = items.get(studioId);
  if (existing) {
    items.delete(studioId);
  } else {
    items.set(studioId, { studioId, addedAt: new Date().toISOString() });
  }
  save();
  refreshSnapshot();
  listeners.forEach((l) => l());
}

/** Backend-ready favourite API helpers. These are structured so the fetch
 * calls can be connected once the corresponding Express routes exist.
 */
async function apiFetchFavorites(token: string): Promise<FavoriteItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  if (!baseUrl) return [];
  try {
    const res = await fetch(`${baseUrl}/api/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map((d: unknown) => ({
        studioId: String((d as { studioId?: string }).studioId ?? ""),
        addedAt: String((d as { addedAt?: string }).addedAt ?? new Date().toISOString()),
      }));
    }
  } catch {
    /* fall back to local storage */
  }
  return [];
}

async function apiAddFavorite(token: string, studioId: string, addedAt: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  if (!baseUrl) return;
  try {
    await fetch(`${baseUrl}/api/favorites`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studioId, addedAt }),
    });
  } catch {
    /* fall back to local storage */
  }
}

async function apiRemoveFavorite(token: string, studioId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  if (!baseUrl) return;
  try {
    await fetch(`${baseUrl}/api/favorites/${encodeURIComponent(studioId)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    /* fall back to local storage */
  }
}

/** BetterAuth session token accessor. */
function getSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("better-auth-token");
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.token ?? null;
    }
  } catch {
    /* ignore */
  }
  return null;
}

/** Client-side favourite store. */
export function useFavorites() {
  const { data: session, isPending = false } = useSession();
  const email = session?.user?.email ?? null;
  // Only treat as authenticated once the session has resolved (not pending).
  const isAuth = !isPending && !!email;

  const current: StoreSnapshot = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // Sync store mode when the session has resolved (not pending).
  // Waiting for `isPending === false` ensures we don't incorrectly treat an
  // unresolved session as a guest and load the wrong storage.
  React.useEffect(() => {
    if (isPending) return;
    setMode(isAuth ? "auth" : "guest", email);
  }, [isAuth, email, isPending]);

  const toggleFavorite = React.useCallback(
    (studioId: string) => {
      // Optimistic local update first.
      toggle(studioId);

      // Also attempt backend persistence for authenticated users.
      if (isAuth && email) {
        const token = getSessionToken();
        if (token) {
          const existing = current.items.get(studioId);
          if (existing) {
            apiRemoveFavorite(token, studioId);
          } else {
            apiAddFavorite(token, studioId, new Date().toISOString());
          }
        }
      }
    },
    [isAuth, email, current],
  );

  const isFavorited = React.useCallback(
    (studioId: string) => current.items.has(studioId),
    [current],
  );

  const getItem = React.useCallback(
    (studioId: string) => current.items.get(studioId) ?? null,
    [current],
  );

  return {
    ids: new Set(current.items.keys()),
    items: current.items,
    isFavorite: isFavorited,
    getItem,
    toggle: toggleFavorite,
    count: current.items.size,
    isAuthenticated: isAuth,
    initialized: current.initialized,
  };
}
