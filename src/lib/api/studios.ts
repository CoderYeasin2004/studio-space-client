/**
 * Thin fetch helpers for the StudioSpace backend API.
 * Centralises the base URL and cache behaviour so every surface reads from
 * the same place.
 */

export async function fetchStudios(): Promise<unknown[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  if (!baseUrl) {
    console.error("NEXT_PUBLIC_SERVER_BASE_URL is not defined");
    return [];
  }

  try {
    const response = await fetch(`${baseUrl}/studios`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Studios request failed (${response.status})`);
      return [];
    }

    const data: unknown = await response.json();
    if (!Array.isArray(data)) {
      console.error("Studios response was not a list");
      return [];
    }

    return data;
  } catch (error) {
    console.error("Failed to load studios:", error);
    return [];
  }
}
