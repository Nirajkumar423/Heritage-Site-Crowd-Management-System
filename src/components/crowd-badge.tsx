import { crowdLabel, crowdTone } from "@/lib/format";
import type { CrowdLevel } from "@/lib/types";

type CrowdBadgeProps = {
  level: CrowdLevel;
  className?: string;
};

export function CrowdBadge({ level, className = "" }: CrowdBadgeProps) {
  return (
    <span
      className={`crowd-pill ${className}`}
      style={{ ["--crowd-color" as string]: crowdTone(level) }}
    >
      {crowdLabel(level)}
    </span>
  );
}
