/**
 * Thin fetch helpers for the StudioSpace backend API.
 * Centralises the base URL and cache behaviour so every surface reads from
 * the same place.
 */

import type {
  IApiReview,
  IReviewEligibility,
  ISubmitReviewPayload,
} from "@/types/review";

export async function fetchStudios(): Promise<unknown[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
  if (!baseUrl) {
    console.error("NEXT_PUBLIC_SERVER_API_URL is not defined");
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

export async function fetchStudioReviews(
  studioId: string,
): Promise<IApiReview[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
  if (!baseUrl) {
    console.error("NEXT_PUBLIC_SERVER_API_URL is not defined");
    return [];
  }

  try {
    const response = await fetch(
      `${baseUrl}/studios/${encodeURIComponent(studioId)}/reviews`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      console.error(
        `Reviews request failed (${response.status})`,
      );
      return [];
    }

    const data: unknown = await response.json();
    if (!Array.isArray(data)) {
      console.error("Reviews response was not a list");
      return [];
    }

    return data as IApiReview[];
  } catch (error) {
    console.error("Failed to load reviews:", error);
    return [];
  }
}

export async function submitStudioReview(
  studioId: string,
  payload: ISubmitReviewPayload,
  token?: string,
): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
  if (!baseUrl) {
    console.error("NEXT_PUBLIC_SERVER_API_URL is not defined");
    return false;
  }

  try {
    const response = await fetch(
      `${baseUrl}/studios/${encodeURIComponent(studioId)}/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      },
    );

   if (!response.ok) {
  const errorData = await response.json();
  console.error("Review API error:", response.status, errorData);
  return false;
}
    return true;
  } catch (error) {
    console.error("Failed to submit review:", error);
    return false;
  }
}

export async function checkReviewEligibility(
  studioId: string,
  token?: string,
): Promise<IReviewEligibility> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
  if (!baseUrl) {
    console.error("NEXT_PUBLIC_SERVER_API_URL is not defined");
    return { canReview: false, reason: "Server not configured" };
  }

  try {
    const response = await fetch(
      `${baseUrl}/studios/${encodeURIComponent(studioId)}/review-eligibility`,
      {
        cache: "no-store",
        ...(token ? { headers: { authorization: `Bearer ${token}` } } : {}),
      },
    );

    if (!response.ok) {
      // A 404 means the eligibility endpoint is not implemented for this
      // studio — treat the user as ineligible rather than surfacing an error.
      return {
        canReview: false,
        reason:
          response.status === 404
            ? "Review eligibility endpoint unavailable"
            : "Eligibility check failed",
      };
    }

    const data: unknown = await response.json();
    return data as IReviewEligibility;
  } catch {
    return { canReview: false, reason: "Eligibility check failed" };
  }
}
