export type SiteType = "monument" | "museum" | "heritage_site" | "fort";
export type CrowdLevel = "low" | "moderate" | "high" | "peak";
export type TicketAudience = "indian" | "foreign" | "student" | "child";

export type HeritageDestination = {
  id: string;
  slug: string;
  name: string;
  site_type: SiteType;
  city: string;
  state: string;
  country: string;
  short_description: string;
  history: string;
  year_built: string | null;
  unesco: boolean;
  image_url: string;
  gallery: string[];
  open_time: string;
  close_time: string;
  closed_days: string[];
  latitude: number | null;
  longitude: number | null;
  daily_capacity: number;
};

export type HeritageTicketType = {
  id: string;
  destination_id: string;
  name: string;
  audience: TicketAudience;
  price_inr: number;
  description: string;
  includes: string[];
  sort_order: number;
};

export type HeritageTimeSlot = {
  id: string;
  destination_id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  booked: number;
  expected_crowd: CrowdLevel;
};

export type HeritageEntryStats = {
  id: string;
  destination_id: string;
  recorded_at: string;
  entries_today: number;
  exits_today: number;
  current_inside: number;
  queue_minutes: number;
  crowd_level: CrowdLevel;
};

export type DestinationCard = HeritageDestination & {
  latest_stats: HeritageEntryStats | null;
  lowest_price: number | null;
};
