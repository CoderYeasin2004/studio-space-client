export interface IReview {
  id: string;
  studioId: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface IApiReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface ISubmitReviewPayload {
  bookingId: string;
  author: string;
  rating: number;
  text: string;
}

export interface IReviewEligibility {
  canReview: boolean;
  bookingId?: string | null;
  reason?: string;
}