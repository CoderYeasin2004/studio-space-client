export type TStudioCategory =
  | "photography"
  | "film-sound"
  | "podcast"
  | "music"
  | "art";

export type TListingStatus = "live" | "draft" | "paused";

export interface IStudioAmenity {
  name: string;
  icon: string;
}

export interface IStudioHost {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  since: string;
}


export interface IStudio {
  _id?: string;
  id?: string;
  slug: string;
  name: string;
  location: string;
  city: string;
  country: string;
  category: TStudioCategory;
  description: string;
  longDescription: string;
  hourlyPrice: number;
  rating: number;
  reviewCount: number;
  capacity: number;
  size: number;
  featured: boolean;
  status: TListingStatus;
  images: string[];
  amenities: IStudioAmenity[];
  host?: IStudioHost;
  tags: string[];
  creatorEmail?: string;
}

export interface ICategory {
  id: TStudioCategory;
  name: string;
  tagline: string;
  image: string;
  count: number;
}

// Re-exports from feature-specific type modules for backwards compatibility
export type { TBookingStatus, IBooking } from "@/types/booking";
export type { IDashboardStat, IActivityEvent } from "@/types/dashboard";
export type {
  IReview,
  IApiReview,
  ISubmitReviewPayload,
  IReviewEligibility,
} from "@/types/review";
export type { IUserProfile } from "@/types/user";
export type { IFavoriteItem } from "@/types/favorite";
export type { TTheme } from "@/types/theme";
