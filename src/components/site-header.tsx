import Link from "next/link";

const links = [
  { href: "/destinations", label: "Destinations" },
  { href: "/destinations?type=monument", label: "Monuments" },
  { href: "/destinations?type=museum", label: "Museums" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/90 backdrop-blur-md">
      <div className="container flex h-[var(--nav-height)] items-center justify-between gap-4">
        <Link href="/" className="display text-[1.55rem] text-ink">
          Darshan
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/destinations" className="btn btn-primary text-sm">
          Browse sites
        </Link>
      </div>
    </header>
  );
}
