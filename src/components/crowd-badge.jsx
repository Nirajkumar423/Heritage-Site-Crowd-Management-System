import { crowdLabel, crowdTone } from "@/lib/format";

export function CrowdBadge({ level, className = "" }) {
  return (
    <span
      className={`crowd-pill ${className}`}
      style={{ "--crowd-color": crowdTone(level) }}
    >
      {crowdLabel(level)}
    </span>
  );
}
