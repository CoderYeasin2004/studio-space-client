import * as React from "react"

const MOBILE_BREAKPOINT = 768

const subscribe = (callback: () => void) => {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
};

const getSnapshot = () => {
  return window.innerWidth < MOBILE_BREAKPOINT
};

const getServerSnapshot = () => {
  return false
};

/**
 * Reads the viewport width through `useSyncExternalStore` so no setState
 * ever runs inside an effect — the media query *is* the external system.
 */
export const useIsMobile = () => {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
};
