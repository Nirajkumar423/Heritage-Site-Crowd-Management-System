import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DestinationBooking } from "@/components/destination-booking";
import { LiveStatsPanel } from "@/components/live-stats-panel";
import { SiteImage } from "@/components/site-image";
import { TicketList } from "@/components/ticket-list";
import {
  getDestinationBySlug,
  getDestinations,
  getLatestEntryStats,
  getTickets,
} from "@/lib/heritage";
import { formatTime, siteTypeLabel } from "@/lib/format";

type DestinationDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const destinations = await getDestinations();
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata({
  params,
}: DestinationDetailPageProps) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) {
    return { title: "Destination" };
  }

  return {
    title: destination.name,
    description: destination.short_description,
  };
}

function BookingFallback() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-5">
      <div className="h-5 w-40 animate-pulse rounded bg-paper-deep" />
      <div className="mt-4 h-24 animate-pulse rounded bg-paper-deep" />
      <div className="mt-3 h-24 animate-pulse rounded bg-paper-deep" />
    </div>
  );
}

function PageFallback() {
  return (
    <section className="section">
      <div className="container space-y-6">
        <div className="aspect-[16/11] animate-pulse bg-paper-deep" />
        <div className="h-10 w-1/2 animate-pulse rounded bg-paper-deep" />
        <div className="h-24 w-2/3 animate-pulse rounded bg-paper-deep" />
      </div>
    </section>
  );
}

async function DestinationDetailContent({
  params,
}: DestinationDetailPageProps) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  const [tickets, stats] = await Promise.all([
    getTickets(destination.id),
    getLatestEntryStats(destination.id),
  ]);

  const gallery = [
    destination.image_url,
    ...destination.gallery.filter((url) => url !== destination.image_url),
  ].slice(0, 3);

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container py-6">
          <Link
            href="/destinations"
            className="text-sm font-medium text-ink-muted hover:text-accent"
          >
            ← All destinations
          </Link>
          <div className="mt-5 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <div className="relative aspect-[16/11] overflow-hidden bg-paper-deep">
              <SiteImage
                src={gallery[0]}
                alt={destination.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {gallery.slice(1).map((url, index) => (
                <div
                  key={url}
                  className="relative aspect-[16/10] overflow-hidden bg-paper-deep"
                >
                  <SiteImage
                    src={url}
                    alt={`${destination.name} gallery ${index + 2}`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 30vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-8">
        <div className="container grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <p className="eyebrow">{siteTypeLabel(destination.site_type)}</p>
            <h1 className="display mt-3 text-4xl text-ink md:text-5xl">
              {destination.name}
            </h1>
            <p className="mt-3 text-ink-muted">
              {destination.city}, {destination.state}
              {destination.unesco ? " · UNESCO World Heritage" : ""}
            </p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft">
              {destination.short_description}
            </p>

            <div className="mt-8 grid gap-4 border-y border-line py-5 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">
                  Hours
                </p>
                <p className="mt-1 font-semibold text-ink">
                  {formatTime(destination.open_time)} –{" "}
                  {formatTime(destination.close_time)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">
                  Built
                </p>
                <p className="mt-1 font-semibold text-ink">
                  {destination.year_built ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">
                  Closed
                </p>
                <p className="mt-1 font-semibold text-ink">
                  {destination.closed_days.length > 0
                    ? destination.closed_days.join(", ")
                    : "Open daily"}
                </p>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="display text-3xl text-ink">History</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-ink-soft">
                {destination.history}
              </p>
            </div>

            <div className="mt-10">
              <h2 className="display text-3xl text-ink">Ticket details</h2>
              <p className="mt-2 text-sm text-ink-muted">
                Published rates in INR. Carry ID for student and domestic
                categories.
              </p>
              <div className="mt-5">
                <TicketList tickets={tickets} />
              </div>
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-[calc(var(--nav-height)+1rem)] lg:self-start">
            <LiveStatsPanel destination={destination} stats={stats} />
            <Suspense fallback={<BookingFallback />}>
              <DestinationBooking destinationId={destination.id} />
            </Suspense>
          </aside>
        </div>
      </section>
    </>
  );
}

export default function DestinationDetailPage(
  props: DestinationDetailPageProps,
) {
  return (
    <Suspense fallback={<PageFallback />}>
      <DestinationDetailContent {...props} />
    </Suspense>
  );
}
