import { Suspense } from "react";
import { DestinationCard } from "@/components/destination-card";
import { TypeFilter } from "@/components/type-filter";
import { getDestinations } from "@/lib/heritage";

type DestinationsPageProps = {
  searchParams: Promise<{ type?: string }>;
};

export const metadata = {
  title: "Destinations",
  description:
    "Browse monuments, forts, museums, and heritage sites with live crowd levels and ticket prices.",
};

async function DestinationResults({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const type = params.type ?? "all";
  const destinations = await getDestinations(type);

  return (
    <>
      <div className="mt-8">
        <TypeFilter active={type} />
      </div>

      <p className="mt-8 text-sm text-ink-muted">
        {destinations.length} site{destinations.length === 1 ? "" : "s"}
      </p>

      {destinations.length === 0 ? (
        <p className="mt-10 text-ink-soft">
          No destinations match this filter yet.
        </p>
      ) : (
        <div className="mt-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      )}
    </>
  );
}

function ResultsFallback() {
  return (
    <div className="mt-8 space-y-6">
      <div className="h-10 w-full max-w-xl animate-pulse rounded bg-paper-deep" />
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="aspect-[4/3] animate-pulse bg-paper-deep" />
            <div className="h-6 w-2/3 animate-pulse rounded bg-paper-deep" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-paper-deep" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DestinationsPage({
  searchParams,
}: DestinationsPageProps) {
  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">Destinations</p>
        <h1 className="display mt-3 max-w-3xl text-4xl text-ink md:text-5xl">
          Heritage sites with live entry context
        </h1>
        <p className="mt-4 max-w-2xl text-base text-ink-muted">
          Filter by site type. Each listing shows crowd status and the lowest
          published ticket price.
        </p>

        <Suspense fallback={<ResultsFallback />}>
          <DestinationResults searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}
