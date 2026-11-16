import Link from "next/link";
import { CrowdBadge } from "@/components/crowd-badge";
import { SiteImage } from "@/components/site-image";
import { formatInr, siteTypeLabel } from "@/lib/format";
import type { DestinationCard as DestinationCardType } from "@/lib/types";

type DestinationCardProps = {
  destination: DestinationCardType;
  featured?: boolean;
};

export function DestinationCard({
  destination,
  featured = false,
}: DestinationCardProps) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <article
        className={
          featured
            ? "grid gap-4 md:grid-cols-[1.2fr_0.8fr] md:items-end"
            : "grid gap-3"
        }
      >
        <div
          className={`relative overflow-hidden bg-paper-deep ${
            featured ? "aspect-[16/11] md:aspect-[5/4]" : "aspect-[4/3]"
          }`}
        >
          <SiteImage
            src={destination.image_url}
            alt={destination.name}
            fill
            sizes={
              featured
                ? "(max-width: 768px) 100vw, 60vw"
                : "(max-width: 768px) 100vw, 33vw"
            }
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="eyebrow">{siteTypeLabel(destination.site_type)}</p>
            {destination.latest_stats ? (
              <CrowdBadge level={destination.latest_stats.crowd_level} />
            ) : null}
          </div>
          <div className="flex items-start justify-between gap-3">
            <h3
              className={`display text-ink transition-colors group-hover:text-accent ${
                featured ? "text-3xl md:text-4xl" : "text-2xl"
              }`}
            >
              {destination.name}
            </h3>
            <span
              aria-hidden
              className="mt-1 text-lg text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              ↗
            </span>
          </div>
          <p className="text-sm text-ink-muted">
            {destination.city}, {destination.state}
          </p>
          {featured ? (
            <p className="max-w-md text-sm leading-relaxed text-ink-soft">
              {destination.short_description}
            </p>
          ) : null}
          <p className="text-sm font-semibold text-ink">
            {destination.lowest_price == null
              ? "Tickets vary"
              : `From ${formatInr(destination.lowest_price)}`}
          </p>
        </div>
      </article>
    </Link>
  );
}
