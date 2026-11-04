"use client";

import * as React from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "studiospace-theme";
const listeners = new Set<() => void>();

const readTheme = (): Theme => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    /* storage unavailable */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
};

/**
 * External store so theme reads subscribe instead of triggering
 * setState-in-effect cascades. The inline script in the root layout applies
 * the persisted theme before first paint; this hydrates React's view of it.
 */
const subscribe = (listener: () => void) => {
  listeners.add(listener);

  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) listener();
  };
  const onMedia = () => listener();

  window.addEventListener("storage", onStorage);
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", onMedia);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .removeEventListener("change", onMedia);
  };
};

const notify = () => {
  listeners.forEach((l) => l());
};

const ThemeContext = React.createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = React.useSyncExternalStore(
    subscribe,
    readTheme,
    () => "light" as Theme,
  );

  // Keep the DOM class in sync whenever the resolved theme changes.
  React.useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = React.useCallback((next: Theme) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
    applyTheme(next);
    notify();
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme(readTheme() === "dark" ? "light" : "dark");
  }, [setTheme]);

  const value = React.useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return React.useContext(ThemeContext);
};
