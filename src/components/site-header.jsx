import Link from "next/link";
import { SiteHeaderAuth } from "@/components/site-header-auth";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/90 backdrop-blur-md">
      <div className="container flex h-[var(--nav-height)] items-center justify-between gap-4">
        <Link href="/" className="display text-[1.55rem] text-ink">
          Darshan
        </Link>
        <SiteHeaderAuth />
      </div>
    </header>
  );
}
