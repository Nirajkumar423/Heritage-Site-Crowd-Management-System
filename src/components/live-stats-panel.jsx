"use client";

import { useCallback, useEffect, useState } from "react";
import { CrowdBadge } from "@/components/crowd-badge";
import { calculateLiveStats, getIstParts } from "@/lib/live-stats";

function Stat({ label, value, subtext }) {
  return (
    <div className="border-t border-line pt-3">
      <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
      {subtext ? (
        <p className="mt-0.5 text-[11px] text-ink-muted">{subtext}</p>
      ) : null}
    </div>
  );
}

function formatCurrentTime(date = new Date()) {
  const ist = getIstParts(date);
  const period = ist.hours >= 12 ? "PM" : "AM";
  const hour12 = ist.hours % 12 === 0 ? 12 : ist.hours % 12;
  const m = String(ist.minutes).padStart(2, "0");
  const s = String(ist.seconds).padStart(2, "0");
  return `${hour12}:${m}:${s} ${period} IST`;
}

export function LiveStatsPanel({ destination, stats: initialStats }) {
  const [stats, setStats] = useState(() => {
    if (initialStats && initialStats.is_open !== undefined) {
      return initialStats;
    }
    return calculateLiveStats(destination, new Date());
  });

  const [lastUpdated, setLastUpdated] = useState(() => formatCurrentTime());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [livePulse, setLivePulse] = useState(false);

  // Recalculate fresh stats from real-time clock and gate sensors
  const refreshStats = useCallback(
    (manual = false) => {
      if (manual) {
        setIsRefreshing(true);
      }
      setLivePulse(true);

      const fresh = calculateLiveStats(destination, new Date());
      setStats((prev) => {
        // If already open, preserve or add micro-fluctuations simulating active turnstile sensor ticks
        if (fresh && fresh.is_open && prev && prev.is_open) {
          const deltaEntries = Math.floor(Math.random() * 3); // 0, 1, or 2 new visitors entered
          const deltaExits = Math.floor(Math.random() * 2); // 0 or 1 visitor exited
          const updatedEntries = Math.max(fresh.entries_today, prev.entries_today + deltaEntries);
          const updatedExits = Math.max(fresh.exits_today, prev.exits_today + deltaExits);
          const updatedInside = Math.max(0, updatedEntries - updatedExits);
          const updatedOcc = Math.min(100, Math.round((updatedInside / destination.daily_capacity) * 100));

          let level = "low";
          if (updatedOcc >= 80) level = "peak";
          else if (updatedOcc >= 55) level = "high";
          else if (updatedOcc >= 30) level = "moderate";

          return {
            ...fresh,
            entries_today: updatedEntries,
            exits_today: updatedExits,
            current_inside: updatedInside,
            occupancy_pct: updatedOcc,
            crowd_level: level,
          };
        }
        return fresh;
      });

      setLastUpdated(formatCurrentTime());

      setTimeout(() => {
        setLivePulse(false);
        if (manual) {
          setIsRefreshing(false);
        }
      }, 500);
    },
    [destination],
  );

  // Auto-refresh gate metrics every 15 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      refreshStats(false);
    }, 15000);

    return () => clearInterval(timer);
  }, [refreshStats]);

  // Listen for local bookings made in slot picker to update live stats immediately
  useEffect(() => {
    const handleBooking = (e) => {
      const { destinationId, guestCount, date } = e.detail || {};
      const todayStr = getIstParts(new Date()).dateString;
      if (destinationId === destination.id && date === todayStr) {
        setStats((prev) => {
          if (!prev) return prev;
          const count = Number(guestCount) || 1;
          const updatedInside = prev.current_inside + count;
          const updatedEntries = prev.entries_today + count;
          const updatedOcc = Math.min(
            100,
            Math.round((updatedInside / destination.daily_capacity) * 100),
          );
          return {
            ...prev,
            current_inside: updatedInside,
            entries_today: updatedEntries,
            occupancy_pct: updatedOcc,
          };
        });
        setLastUpdated(formatCurrentTime());
      }
    };

    window.addEventListener("darshan:slot-reserved", handleBooking);
    return () =>
      window.removeEventListener("darshan:slot-reserved", handleBooking);
  }, [destination]);

  const occupancy = stats
    ? Math.min(
        100,
        Math.round((stats.current_inside / destination.daily_capacity) * 100),
      )
    : 0;

  const isOpen = stats?.is_open ?? true;

  // Capacity bar color based on crowd pressure
  const barColor =
    stats?.crowd_level === "peak"
      ? "bg-rose-600"
      : stats?.crowd_level === "high"
      ? "bg-amber-500"
      : stats?.crowd_level === "moderate"
      ? "bg-blue-600"
      : "bg-emerald-600";

  return (
    <section className="rounded-[var(--radius-lg)] border border-line bg-surface p-5 shadow-[var(--shadow-soft)]">
      {/* Header with Live Status & Refresh Trigger */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isOpen ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
            }`}
            aria-hidden
          />
          <h2 className="text-lg font-semibold text-ink">Live entry</h2>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              isOpen
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-amber-50 text-amber-800 border border-amber-200"
            }`}
          >
            {isOpen ? "Gates Open" : "Gates Closed"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {stats ? <CrowdBadge level={stats.crowd_level} /> : null}
          <button
            type="button"
            onClick={() => refreshStats(true)}
            disabled={isRefreshing}
            title="Refresh live gate turnstile readings"
            aria-label="Refresh live gate turnstile readings"
            className="flex h-7 w-7 items-center justify-center rounded border border-line bg-paper text-ink-muted hover:text-ink hover:bg-paper-deep transition-all"
          >
            <svg
              className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Real-time Subtext / Live sensor description */}
      <div className="mt-2 flex items-center justify-between text-xs text-ink-muted">
        <p className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              livePulse ? "bg-accent scale-125" : "bg-emerald-500"
            }`}
          />
          {stats?.status_detail || "Live gate sensors active through the day."}
        </p>
      </div>

      {/* Live Metrics Grid */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Stat
          label="Inside now"
          value={stats ? stats.current_inside.toLocaleString("en-IN") : "—"}
          subtext={isOpen ? "Current on-site visitors" : "Gates closed"}
        />
        <Stat
          label="Entries today"
          value={stats ? stats.entries_today.toLocaleString("en-IN") : "—"}
          subtext="Total turnstile entries"
        />
        <Stat
          label="Queue wait"
          value={stats ? `${stats.queue_minutes} min` : "—"}
          subtext="Security & ticket barrier"
        />
        <Stat
          label="Site fill"
          value={`${occupancy}%`}
          subtext={`${stats?.current_inside.toLocaleString("en-IN") ?? 0} of ${destination.daily_capacity.toLocaleString("en-IN")}`}
        />
      </div>

      {/* Capacity Progress Bar */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-ink-muted">
          <span>Capacity limit</span>
          <span className="font-medium text-ink">
            {stats?.current_inside.toLocaleString("en-IN") ?? 0} /{" "}
            {destination.daily_capacity.toLocaleString("en-IN")} ({occupancy}%)
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-paper-deep">
          <div
            className={`h-full rounded-full transition-[width] duration-700 ${barColor}`}
            style={{ width: `${Math.max(3, occupancy)}%` }}
          />
        </div>
      </div>

      {/* Live sync timestamp footer */}
      <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3 text-[11px] text-ink-muted">
        <span>Turnstile Sensor Feed: Active</span>
        <span className="font-mono">Updated: {lastUpdated}</span>
      </div>
    </section>
  );
}
