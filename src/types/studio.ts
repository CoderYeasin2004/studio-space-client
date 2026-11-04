export type StudioCategory =
  | "photography"
  | "film-sound"
  | "podcast"
  | "music"
  | "art";

export type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";

export type ListingStatus = "live" | "draft" | "paused";

export interface StudioAmenity {
  name: string;
  icon: string;
}

export interface StudioHost {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  since: string;
}

export interface Studio {
   _id?: string;
  id: string;
  slug: string;
  name: string;
  location: string;
  city: string;
  country: string;
  category: StudioCategory;
  description: string;
  longDescription: string;
  hourlyPrice: number;
  rating: number;
  reviewCount: number;
  capacity: number;
  size: number;
  featured: boolean;
  status: ListingStatus;
  images: string[];
  amenities: StudioAmenity[];
  host: StudioHost;
  tags: string[];
  
}

export interface Category {
  id: StudioCategory;
  name: string;
  tagline: string;
  image: string;
  count: number;
}

export interface Booking {
  id: string;
  studioId: string;
  studioName: string;
  studioImage: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  total: number;
  status: BookingStatus;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  location: string;
  avatar: string;
  joined: string;
  bio: string;
}

export interface ActivityEvent {
  id: string;
  label: string;
  detail: string;
  timestamp: string;
  icon: string;
}

export interface DashboardStat {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "neutral";
  icon: string;
}
