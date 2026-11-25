import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-hero text-surface">
      <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="display text-3xl">Darshan</p>
          <p className="mt-2 max-w-md text-sm text-surface/70">
            Live crowd guidance and timed entry for India&apos;s monuments,
            museums, and heritage sites.
          </p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-surface/80">
          <Link href="/destinations" className="hover:text-surface">
            Destinations
          </Link>
          <Link href="/destinations/taj-mahal" className="hover:text-surface">
            Taj Mahal
          </Link>
          <Link href="/destinations?type=museum" className="hover:text-surface">
            Museums
          </Link>
          <Link href="/account" className="hover:text-surface">
            Account
          </Link>
          <Link href="/login" className="hover:text-surface">
            Sign in
          </Link>
        </div>
      </div>
    </footer>
  );
}
