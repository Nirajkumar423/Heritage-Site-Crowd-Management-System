import { cacheLife } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import {
  calculateLiveStats,
  generateDynamicTimeSlots,
  getIstParts,
} from "./live-stats";

export { calculateLiveStats, generateDynamicTimeSlots, getIstParts };

function applyHeritageCache() {
  cacheLife("minutes");
}

function asGallery(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string");
  }
  return [];
}

function mapDestination(row) {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    site_type: row.site_type,
    city: String(row.city),
    state: String(row.state),
    country: String(row.country || "India"),
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

// Built-in seed catalog for resilient offline/sandbox operation
export const FALLBACK_DESTINATIONS = [
  {
    id: "7a45cdad-924c-4a44-9e0d-e91bee37a965",
    slug: "taj-mahal",
    name: "Taj Mahal",
    site_type: "monument",
    city: "Agra",
    state: "Uttar Pradesh",
    country: "India",
    short_description:
      "A white marble mausoleum on the Yamuna, built by Shah Jahan for Mumtaz Mahal.",
    history:
      "Commissioned in 1631 by Mughal emperor Shah Jahan after the death of his wife Mumtaz Mahal, the Taj Mahal took about 22 years and some 20,000 artisans to complete. The complex includes the main tomb, a mosque, a guest house, and formal gardens laid out in the Persian charbagh plan. In 1983 UNESCO listed it as a World Heritage Site.",
    year_built: "1632–1653",
    unesco: true,
    image_url: "/destinations/taj-mahal.jpg",
    gallery: ["/destinations/taj-mahal-2.jpg", "/destinations/agra-fort.jpg"],
    open_time: "06:00",
    close_time: "18:30",
    closed_days: ["Friday"],
    latitude: 27.1751,
    longitude: 78.0421,
    daily_capacity: 40000,
  },
  {
    id: "3b2f9e9e-514c-46d1-9695-aca4c011a0ca",
    slug: "red-fort",
    name: "Red Fort",
    site_type: "fort",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    short_description:
      "The sandstone seat of Mughal power and the site of India's Independence Day address.",
    history:
      "Shah Jahan moved the Mughal capital from Agra to Shahjahanabad in 1639 and raised the Red Fort as the imperial palace. From 1947 the Prime Minister has addressed the nation from its ramparts every Independence Day. UNESCO inscribed the fort in 2007.",
    year_built: "1639–1648",
    unesco: true,
    image_url: "/destinations/red-fort.jpg",
    gallery: ["/destinations/humayun-tomb.jpg"],
    open_time: "09:30",
    close_time: "16:30",
    closed_days: ["Monday"],
    latitude: 28.6562,
    longitude: 77.241,
    daily_capacity: 25000,
  },
  {
    id: "10f2b8e9-9033-4ddb-bd73-e648162ad09d",
    slug: "qutub-minar",
    name: "Qutub Minar",
    site_type: "monument",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    short_description:
      "A soaring victory tower of red sandstone and marble at Mehrauli.",
    history:
      "Begun by Qutb-ud-din Aibak around 1199 and completed by Iltutmish, Qutub Minar rises 72.5 metres. The complex also holds the Quwwat-ul-Islam mosque and the Iron Pillar. UNESCO listed the Qutb complex in 1993.",
    year_built: "1199–1220",
    unesco: true,
    image_url: "/destinations/qutub-minar.jpg",
    gallery: ["/destinations/humayun-tomb.jpg"],
    open_time: "07:00",
    close_time: "17:00",
    closed_days: [],
    latitude: 28.5245,
    longitude: 77.1855,
    daily_capacity: 15000,
  },
  {
    id: "7a1e56fd-adeb-42ff-b276-937aa04df9ba",
    slug: "india-gate",
    name: "India Gate",
    site_type: "monument",
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    short_description:
      "A war memorial arch on Rajpath honouring soldiers of the First World War.",
    history:
      "Designed by Edwin Lutyens and completed in 1931, India Gate commemorates 74,187 soldiers of the British Indian Army who died in the First World War and the Third Anglo-Afghan War. The Amar Jawan Jyoti flame burns beneath the arch.",
    year_built: "1921–1931",
    unesco: false,
    image_url: "/destinations/india-gate.jpg",
    gallery: ["/destinations/red-fort.jpg"],
    open_time: "00:00",
    close_time: "23:59",
    closed_days: [],
    latitude: 28.6129,
    longitude: 77.2295,
    daily_capacity: 50000,
  },
  {
    id: "1caf35b4-a165-4b52-8687-717f4afae468",
    slug: "national-museum-delhi",
    name: "National Museum",
    site_type: "museum",
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    short_description:
      "India's premier museum of archaeology, manuscripts, and decorative arts.",
    history:
      "Opened in 1949 and housed on Janpath since 1960, the National Museum holds over 200,000 objects spanning 5,000 years. Collections cover Indus Valley archaeology, Buddhist art, numismatics, arms, and textiles.",
    year_built: "1949",
    unesco: false,
    image_url: "/destinations/museum.jpg",
    gallery: ["/destinations/sarnath.jpg"],
    open_time: "10:00",
    close_time: "18:00",
    closed_days: ["Monday"],
    latitude: 28.6118,
    longitude: 77.2194,
    daily_capacity: 8000,
  },
  {
    id: "b43316f4-58d7-434b-bb5c-6f9f5de36d9e",
    slug: "agra-fort",
    name: "Agra Fort",
    site_type: "fort",
    city: "Agra",
    state: "Uttar Pradesh",
    country: "India",
    short_description:
      "A riverside fortress of red sandstone that housed Mughal emperors for generations.",
    history:
      "Akbar began the present fort in 1565. Later emperors added marble palaces, mosques, and audience halls. Shah Jahan was confined here by Aurangzeb and could see the Taj Mahal across the Yamuna. UNESCO listed Agra Fort in 1983.",
    year_built: "1565–1573",
    unesco: true,
    image_url: "/destinations/agra-fort.jpg",
    gallery: ["/destinations/taj-mahal-2.jpg"],
    open_time: "06:00",
    close_time: "18:00",
    closed_days: [],
    latitude: 27.1795,
    longitude: 78.0211,
    daily_capacity: 20000,
  },
  {
    id: "899aad66-a9f6-4474-9144-69213e769e12",
    slug: "humauns-tomb",
    name: "Humayun's Tomb",
    site_type: "heritage_site",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    short_description:
      "An early Mughal garden tomb that set the pattern later perfected at the Taj Mahal.",
    history:
      "Built in the 1560s by Empress Bega Begum for Humayun, the tomb sits in a charbagh garden. Persian and Indian craftsmen worked the red sandstone and white marble. UNESCO inscribed it in 1993.",
    year_built: "1565–1572",
    unesco: true,
    image_url: "/destinations/humayun-tomb.jpg",
    gallery: ["/destinations/red-fort.jpg"],
    open_time: "06:00",
    close_time: "18:00",
    closed_days: [],
    latitude: 28.5933,
    longitude: 77.2507,
    daily_capacity: 12000,
  },
  {
    id: "4cf34f09-81fb-418d-9c66-dc0b5d86b1c8",
    slug: "sarnath-museum",
    name: "Sarnath Museum",
    site_type: "museum",
    city: "Sarnath",
    state: "Uttar Pradesh",
    country: "India",
    short_description:
      "The oldest site museum of the Archaeological Survey of India, beside the deer park where the Buddha taught.",
    history:
      "Opened in 1910, the museum holds finds from Sarnath excavations including the Ashokan Lion Capital, now India's national emblem. Galleries cover Buddhist sculpture from the Mauryan to medieval periods.",
    year_built: "1910",
    unesco: false,
    image_url: "/destinations/sarnath.jpg",
    gallery: [],
    open_time: "09:00",
    close_time: "17:00",
    closed_days: ["Friday"],
    latitude: 25.3811,
    longitude: 83.0224,
    daily_capacity: 5000,
  },
];

export const FALLBACK_TICKETS = {
  "7a45cdad-924c-4a44-9e0d-e91bee37a965": [
    {
      id: "t1",
      destination_id: "7a45cdad-924c-4a44-9e0d-e91bee37a965",
      name: "General entry (Indian)",
      audience: "indian",
      price_inr: 50,
      description: "Entry to the complex gardens and viewing platforms.",
      includes: ["Gardens", "Museum"],
      sort_order: 1,
    },
    {
      id: "t2",
      destination_id: "7a45cdad-924c-4a44-9e0d-e91bee37a965",
      name: "General entry (Foreign)",
      audience: "foreign",
      price_inr: 1100,
      description: "Entry for international visitors including ASI museum.",
      includes: ["Gardens", "Museum", "Audio guide option"],
      sort_order: 2,
    },
    {
      id: "t3",
      destination_id: "7a45cdad-924c-4a44-9e0d-e91bee37a965",
      name: "Student entry",
      audience: "student",
      price_inr: 20,
      description: "Valid student ID required at the gate.",
      includes: ["Gardens"],
      sort_order: 3,
    },
  ],
  "1caf35b4-a165-4b52-8687-717f4afae468": [
    {
      id: "tm1",
      destination_id: "1caf35b4-a165-4b52-8687-717f4afae468",
      name: "General entry (Indian)",
      audience: "indian",
      price_inr: 20,
      description: "Access to permanent galleries.",
      includes: ["Permanent galleries"],
      sort_order: 1,
    },
    {
      id: "tm2",
      destination_id: "1caf35b4-a165-4b52-8687-717f4afae468",
      name: "General entry (Foreign)",
      audience: "foreign",
      price_inr: 650,
      description: "International visitor ticket.",
      includes: ["Permanent galleries", "Temporary shows"],
      sort_order: 2,
    },
    {
      id: "tm3",
      destination_id: "1caf35b4-a165-4b52-8687-717f4afae468",
      name: "Student entry",
      audience: "student",
      price_inr: 5,
      description: "Valid student ID required.",
      includes: ["Permanent galleries"],
      sort_order: 3,
    },
  ],
};

export async function getDestinations(siteType) {
  "use cache";
  applyHeritageCache();

  let destinations = [];
  try {
    const supabase = createPublicClient();
    let query = supabase
      .from("heritage_destinations")
      .select("*")
      .order("name", { ascending: true });

    if (siteType && siteType !== "all") {
      query = query.eq("site_type", siteType);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      destinations = data.map(mapDestination);
    }
  } catch (err) {
    console.warn("Database query failed, using fallback catalog:", err);
  }

  // Fallback if database is unavailable or empty
  if (destinations.length === 0) {
    destinations = FALLBACK_DESTINATIONS.filter(
      (d) => !siteType || siteType === "all" || d.site_type === siteType,
    );
  }

  const ids = destinations.map((item) => item.id);
  const lowestPrice = new Map();

  try {
    const supabase = createPublicClient();
    const { data: tickets } = await supabase
      .from("heritage_ticket_types")
      .select("destination_id, price_inr")
      .in("destination_id", ids);

    for (const ticket of tickets ?? []) {
      const current = lowestPrice.get(ticket.destination_id);
      if (current === undefined || ticket.price_inr < current) {
        lowestPrice.set(ticket.destination_id, ticket.price_inr);
      }
    }
  } catch {
    // Ignore ticket fetch errors
  }

  // Default fallback ticket minimums if not fetched
  for (const dest of destinations) {
    if (!lowestPrice.has(dest.id)) {
      lowestPrice.set(
        dest.id,
        dest.slug === "india-gate" ? 0 : dest.slug === "taj-mahal" ? 50 : 20,
      );
    }
  }

  const now = new Date();
  return destinations.map((destination) => ({
    ...destination,
    latest_stats: calculateLiveStats(destination, now),
    lowest_price: lowestPrice.get(destination.id) ?? 20,
  }));
}

export async function getDestinationBySlug(slug) {
  "use cache";
  applyHeritageCache();

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("heritage_destinations")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      return mapDestination(data);
    }
  } catch (err) {
    console.warn("Database query failed for slug, checking fallback:", err);
  }

  const fallback = FALLBACK_DESTINATIONS.find((d) => d.slug === slug);
  return fallback || null;
}

export async function getDestinationById(id) {
  "use cache";
  applyHeritageCache();

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("heritage_destinations")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      return mapDestination(data);
    }
  } catch {
    // Ignore error
  }

  return FALLBACK_DESTINATIONS.find((d) => d.id === id) || null;
}

export async function getTickets(destinationId) {
  "use cache";
  applyHeritageCache();

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("heritage_ticket_types")
      .select("*")
      .eq("destination_id", destinationId)
      .order("sort_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch {
    // Ignore error
  }

  return FALLBACK_TICKETS[destinationId] || [
    {
      id: "gen-ind",
      destination_id: destinationId,
      name: "General entry (Indian)",
      audience: "indian",
      price_inr: 25,
      description: "Standard daytime monument entry.",
      includes: ["Monument grounds"],
      sort_order: 1,
    },
    {
      id: "gen-for",
      destination_id: destinationId,
      name: "General entry (Foreign)",
      audience: "foreign",
      price_inr: 500,
      description: "International visitor ticket.",
      includes: ["Monument grounds", "Express queue"],
      sort_order: 2,
    },
  ];
}

export async function getTimeSlots(destinationId, slotDate, destination) {
  "use cache";
  applyHeritageCache();

  let slots = [];
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("heritage_time_slots")
      .select("*")
      .eq("destination_id", destinationId)
      .eq("slot_date", slotDate)
      .order("start_time", { ascending: true });

    if (!error && data && data.length > 0) {
      slots = data;
    }
  } catch {
    // Ignore query error
  }

  // If database contains active slots for this specific date, return them
  if (slots.length > 0) {
    return slots;
  }

  // If database has no slots for this date, dynamically generate them based on destination operating hours
  const dest = destination || (await getDestinationById(destinationId));
  if (!dest) return [];

  return generateDynamicTimeSlots(dest, slotDate);
}

export async function getLatestEntryStats(destinationId, destination) {
  "use cache";
  applyHeritageCache();

  const dest = destination || (await getDestinationById(destinationId));
  if (!dest) return null;

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("heritage_entry_stats")
      .select("*")
      .eq("destination_id", destinationId)
      .order("recorded_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Check if the DB record was recorded TODAY in IST
    if (!error && data && data.recorded_at) {
      const recordedIst = getIstParts(new Date(data.recorded_at));
      const currentIst = getIstParts(new Date());
      if (recordedIst.dateString === currentIst.dateString) {
        return {
          ...data,
          is_open: true,
          gate_status: "Gates active",
          status_detail: "Turnstiles recording live entry",
          occupancy_pct: Math.min(
            100,
            Math.round((data.current_inside / dest.daily_capacity) * 100),
          ),
        };
      }
    }
  } catch {
    // Ignore error
  }

  // If DB record is outdated (e.g. from previous weeks) or absent, compute real-time live metrics
  return calculateLiveStats(dest, new Date());
}

export async function getFeaturedDestinations() {
  "use cache";
  applyHeritageCache();
  const all = await getDestinations();
  const priority = [
    "taj-mahal",
    "red-fort",
    "agra-fort",
    "national-museum-delhi",
  ];
  const featured = priority
    .map((slug) => all.find((item) => item.slug === slug))
    .filter(Boolean);

  if (featured.length >= 4) {
    return featured.slice(0, 4);
  }

  const extras = all.filter(
    (item) => !featured.some((picked) => picked.id === item.id),
  );
  return [...featured, ...extras].slice(0, 4);
}

export function availableSlotDates(days = 7, from = new Date()) {
  const dates = [];
  const ist = getIstParts(from);
  for (let i = 0; i < days; i += 1) {
    const date = new Date(Date.UTC(ist.year, ist.month - 1, ist.day + i));
    dates.push(date.toISOString().slice(0, 10));
  }
  return dates;
}
