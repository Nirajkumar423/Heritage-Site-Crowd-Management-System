import Link from "next/link";
import { DestinationCard } from "@/components/destination-card";
import { SiteImage } from "@/components/site-image";
import { getFeaturedDestinations } from "@/lib/heritage";

export default async function HomePage() {
  const featured = await getFeaturedDestinations();
  const hero = featured.find((item) => item.slug === "taj-mahal") ?? featured[0];

  return (
    <>
      <section className="relative isolate min-h-[88vh] overflow-hidden bg-hero text-surface">
        {hero ? (
          <SiteImage
            src={hero.image_url}
            alt={hero.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,36,32,0.55)_0%,rgba(27,36,32,0.72)_48%,rgba(27,36,32,0.9)_100%)] md:bg-[linear-gradient(110deg,rgba(27,36,32,0.88)_8%,rgba(27,36,32,0.55)_48%,rgba(27,36,32,0.28)_100%)]" />
        <div className="container relative flex min-h-[88vh] w-full flex-col justify-end pb-12 pt-24 sm:pb-16 sm:pt-28">
          <p className="eyebrow rise-in text-surface/70">Darshan</p>
          <h1 className="display rise-in mt-4 max-w-3xl text-4xl text-surface sm:text-6xl md:text-7xl">
            Arrive when the gates are calm.
          </h1>
          <p className="rise-in-delay mt-5 max-w-xl text-base leading-relaxed text-surface/80 sm:text-lg">
            Timed entry, live crowd levels, and history for monuments,
            museums, and heritage sites across India.
          </p>
          <div className="rise-in-delay mt-8 flex flex-wrap gap-3">
            <Link href="/destinations" className="btn btn-primary">
              Browse destinations
            </Link>
            <Link href="/destinations/taj-mahal" className="btn btn-ghost">
              Open Taj Mahal
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="max-w-2xl">
            <p className="eyebrow">How it works</p>
            <h2 className="display mt-3 text-3xl text-ink md:text-4xl">
              One place for history, tickets, and gate pressure.
            </h2>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Read the site",
                copy: "Short history, open hours, and ticket bands before you travel.",
              },
              {
                title: "Watch the crowd",
                copy: "Live entries, queue wait, and expected fill for each time window.",
              },
              {
                title: "Pick a quieter slot",
                copy: "Compare same day windows and reserve when capacity remains.",
              },
            ].map((item) => (
              <article key={item.title} className="border-t border-line pt-5">
                <h3 className="text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {item.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-line bg-surface">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Featured sites</p>
              <h2 className="display mt-3 text-3xl text-ink md:text-4xl">
                Start with the landmarks
              </h2>
            </div>
            <Link
              href="/destinations"
              className="text-sm font-semibold text-accent hover:text-accent-deep"
            >
              View all destinations →
            </Link>
          </div>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            {featured.map((destination, index) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                featured={index === 0}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
