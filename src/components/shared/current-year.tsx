/**
 * Copyright year. The clock is read once inside a cached function so the
 * prerendered shell holds a frozen value — `cacheComponents` rejects a bare
 * `new Date()` while statically rendering the page.
 */
async function readYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function CurrentYear() {
  const year = await readYear();
  return <>{year}</>;
}
