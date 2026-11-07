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

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface SubmitReviewPayload {
  author: string;
  rating: number;
  text: string;
}

export async function fetchStudioReviews(
  studioId: string,
): Promise<Review[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  if (!baseUrl) {
    console.error("NEXT_PUBLIC_SERVER_BASE_URL is not defined");
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

    return data as Review[];
  } catch (error) {
    console.error("Failed to load reviews:", error);
    return [];
  }
}

export async function submitStudioReview(
  studioId: string,
  payload: SubmitReviewPayload,
): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  if (!baseUrl) {
    console.error("NEXT_PUBLIC_SERVER_BASE_URL is not defined");
    return false;
  }

  try {
    const response = await fetch(
      `${baseUrl}/studios/${encodeURIComponent(studioId)}/reviews`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      console.error(
        `Submit review failed (${response.status})`,
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to submit review:", error);
    return false;
  }
}

export interface ReviewEligibility {
  canReview: boolean;
  reason?: string;
}

export async function checkReviewEligibility(
  studioId: string,
): Promise<ReviewEligibility> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  if (!baseUrl) {
    console.error("NEXT_PUBLIC_SERVER_BASE_URL is not defined");
    return { canReview: false, reason: "Server not configured" };
  }

  try {
    const response = await fetch(
      `${baseUrl}/studios/${encodeURIComponent(studioId)}/reviews/eligibility`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      console.error(
        `Review eligibility check failed (${response.status})`,
      );
      return { canReview: false, reason: "Eligibility check failed" };
    }

    const data: unknown = await response.json();
    return data as ReviewEligibility;
  } catch (error) {
    console.error("Failed to check review eligibility:", error);
    return { canReview: false, reason: "Eligibility check failed" };
  }
}
