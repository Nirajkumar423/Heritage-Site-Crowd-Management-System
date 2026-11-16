import { cacheLife } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type {
  DestinationCard,
  HeritageDestination,
  HeritageEntryStats,
  HeritageTicketType,
  HeritageTimeSlot,
} from "@/lib/types";

function useHeritageCache() {
  cacheLife("minutes");
}

function asGallery(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
}

function mapDestination(row: Record<string, unknown>): HeritageDestination {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    site_type: row.site_type as HeritageDestination["site_type"],
    city: String(row.city),
    state: String(row.state),
    country: String(row.country),
    short_description: String(row.short_description),
    history: String(row.history),
    year_built: row.year_built ? String(row.year_built) : null,
    unesco: Boolean(row.unesco),
    image_url: String(row.image_url),
    gallery: asGallery(row.gallery),
    open_time: String(row.open_time),
    close_time: String(row.close_time),
    closed_days: Array.isArray(row.closed_days)
      ? row.closed_days.map(String)
      : [],
    latitude: row.latitude == null ? null : Number(row.latitude),
    longitude: row.longitude == null ? null : Number(row.longitude),
    daily_capacity: Number(row.daily_capacity),
  };
}

export async function getDestinations(
  siteType?: string,
): Promise<DestinationCard[]> {
  "use cache";
  useHeritageCache();

  const supabase = createPublicClient();

  let query = supabase
    .from("heritage_destinations")
    .select("*")
    .order("name", { ascending: true });

  if (siteType && siteType !== "all") {
    query = query.eq("site_type", siteType);
  }

  const { data: destinations, error } = await query;
  if (error || !destinations) {
    console.error(error);
    return [];
  }

  const ids = destinations.map((item) => item.id);

  const [{ data: stats }, { data: tickets }] = await Promise.all([
    supabase
      .from("heritage_entry_stats")
      .select("*")
      .in("destination_id", ids)
      .order("recorded_at", { ascending: false }),
    supabase
      .from("heritage_ticket_types")
      .select("destination_id, price_inr")
      .in("destination_id", ids),
  ]);

  const latestByDestination = new Map<string, HeritageEntryStats>();
  for (const row of stats ?? []) {
    if (!latestByDestination.has(row.destination_id)) {
      latestByDestination.set(
        row.destination_id,
        row as HeritageEntryStats,
      );
    }
  }

  const lowestPrice = new Map<string, number>();
  for (const ticket of tickets ?? []) {
    const current = lowestPrice.get(ticket.destination_id);
    if (current === undefined || ticket.price_inr < current) {
      lowestPrice.set(ticket.destination_id, ticket.price_inr);
    }
  }

  return destinations.map((row) => {
    const destination = mapDestination(row);
    return {
      ...destination,
      latest_stats: latestByDestination.get(destination.id) ?? null,
      lowest_price: lowestPrice.get(destination.id) ?? null,
    };
  });
}

export async function getDestinationBySlug(slug: string) {
  "use cache";
  useHeritageCache();

  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("heritage_destinations")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    console.error(error);
    return null;
  }

  return mapDestination(data);
}

export async function getTickets(
  destinationId: string,
): Promise<HeritageTicketType[]> {
  "use cache";
  useHeritageCache();

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("heritage_ticket_types")
    .select("*")
    .eq("destination_id", destinationId)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    console.error(error);
    return [];
  }

  return data as HeritageTicketType[];
}

export async function getTimeSlots(
  destinationId: string,
  slotDate: string,
): Promise<HeritageTimeSlot[]> {
  "use cache";
  useHeritageCache();

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("heritage_time_slots")
    .select("*")
    .eq("destination_id", destinationId)
    .eq("slot_date", slotDate)
    .order("start_time", { ascending: true });

  if (error || !data) {
    console.error(error);
    return [];
  }

  return data as HeritageTimeSlot[];
}

export async function getLatestEntryStats(
  destinationId: string,
): Promise<HeritageEntryStats | null> {
  "use cache";
  useHeritageCache();

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("heritage_entry_stats")
    .select("*")
    .eq("destination_id", destinationId)
    .order("recorded_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    console.error(error);
    return null;
  }

  return data as HeritageEntryStats;
}

export async function getFeaturedDestinations() {
  "use cache";
  useHeritageCache();
  const all = await getDestinations();
  const priority = [
    "taj-mahal",
    "red-fort",
    "agra-fort",
    "national-museum-delhi",
  ];
  const featured = priority
    .map((slug) => all.find((item) => item.slug === slug))
    .filter((item): item is DestinationCard => Boolean(item));

  if (featured.length >= 4) {
    return featured.slice(0, 4);
  }

  const extras = all.filter(
    (item) => !featured.some((picked) => picked.id === item.id),
  );
  return [...featured, ...extras].slice(0, 4);
}

export function availableSlotDates(days = 7, from = new Date()) {
  const dates: string[] = [];
  for (let i = 0; i < days; i += 1) {
    const date = new Date(
      Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate() + i),
    );
    dates.push(date.toISOString().slice(0, 10));
  }
  return dates;
}
