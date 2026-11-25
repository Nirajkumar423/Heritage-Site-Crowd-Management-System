export function formatInr(amount) {
  if (amount === 0) return "Free";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTime(value) {
  const [hoursRaw, minutesRaw] = value.slice(0, 5).split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function formatDateLabel(value) {
  const [year, month, day] = value.split("-").map(Number);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const weekday = weekdays[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  return `${weekday}, ${day} ${months[month - 1]}`;
}

export function siteTypeLabel(type) {
  switch (type) {
    case "heritage_site":
      return "Heritage site";
    case "monument":
      return "Monument";
    case "museum":
      return "Museum";
    case "fort":
      return "Fort";
    default:
      return type;
  }
}

export function crowdLabel(level) {
  switch (level) {
    case "low":
      return "Quiet";
    case "moderate":
      return "Steady";
    case "high":
      return "Busy";
    case "peak":
      return "Peak";
    default:
      return level;
  }
}

export function crowdTone(level) {
  switch (level) {
    case "low":
      return "var(--crowd-low)";
    case "moderate":
      return "var(--crowd-moderate)";
    case "high":
      return "var(--crowd-high)";
    case "peak":
      return "var(--crowd-peak)";
    default:
      return "var(--ink-muted)";
  }
}

export function slotFillPercent(booked, capacity) {
  if (capacity <= 0) return 0;
  return Math.min(100, Math.round((booked / capacity) * 100));
}
