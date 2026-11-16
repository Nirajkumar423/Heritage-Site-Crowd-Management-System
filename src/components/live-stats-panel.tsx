import { CrowdBadge } from "@/components/crowd-badge";
import type { HeritageDestination, HeritageEntryStats } from "@/lib/types";

type LiveStatsPanelProps = {
  destination: HeritageDestination;
  stats: HeritageEntryStats | null;
};

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-t border-line pt-3">
      <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}

export function LiveStatsPanel({ destination, stats }: LiveStatsPanelProps) {
  const occupancy = stats
    ? Math.min(
        100,
        Math.round((stats.current_inside / destination.daily_capacity) * 100),
      )
    : 0;

  return (
    <section className="rounded-[var(--radius-lg)] border border-line bg-surface p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="live-dot" aria-hidden />
          <h2 className="text-lg font-semibold text-ink">Live entry</h2>
        </div>
        {stats ? <CrowdBadge level={stats.crowd_level} /> : null}
      </div>
      <p className="mt-2 text-sm text-ink-muted">
        Gate counts refresh through the day for planning quieter visits.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Stat
          label="Inside now"
          value={stats ? stats.current_inside.toLocaleString("en-IN") : "—"}
        />
        <Stat
          label="Entries today"
          value={stats ? stats.entries_today.toLocaleString("en-IN") : "—"}
        />
        <Stat
          label="Queue wait"
          value={stats ? `${stats.queue_minutes} min` : "—"}
        />
        <Stat label="Site fill" value={`${occupancy}%`} />
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-ink-muted">
          <span>Capacity</span>
          <span>
            {stats?.current_inside.toLocaleString("en-IN") ?? 0} /{" "}
            {destination.daily_capacity.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-paper-deep">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-500"
            style={{ width: `${occupancy}%` }}
          />
        </div>
      </div>
    </section>
  );
}
