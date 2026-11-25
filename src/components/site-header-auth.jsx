"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/destinations", label: "Destinations" },
  { href: "/destinations?type=monument", label: "Monuments" },
  { href: "/destinations?type=museum", label: "Museums" },
];

export function SiteHeaderAuth() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (active) setIsSignedIn(Boolean(data.user));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(Boolean(session?.user));
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4 md:gap-6">
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
        {isSignedIn ? (
          <Link
            href="/account"
            className="text-sm font-medium text-ink-soft transition-colors hover:text-accent"
          >
            Account
          </Link>
        ) : null}
      </nav>
      <div className="flex items-center gap-2 sm:gap-3">
        {isSignedIn ? (
          <Link href="/account" className="btn btn-primary text-sm">
            Account
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="hidden text-sm font-semibold text-ink-soft transition-colors hover:text-accent sm:inline"
            >
              Sign in
            </Link>
            <Link href="/signup" className="btn btn-primary text-sm">
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
