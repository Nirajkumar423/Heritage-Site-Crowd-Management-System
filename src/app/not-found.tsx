import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container max-w-xl">
        <p className="eyebrow">404</p>
        <h1 className="display mt-3 text-4xl text-ink">Site not found</h1>
        <p className="mt-4 text-ink-muted">
          That destination is missing or the link is out of date.
        </p>
        <Link href="/destinations" className="btn btn-primary mt-8">
          Browse destinations
        </Link>
      </div>
    </section>
  );
}
