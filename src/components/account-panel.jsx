"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AccountPanel({ email, fullName: initialName }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialName || "");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSave(event) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: fullName.trim(),
      },
    });

    if (updateError) {
      setError(updateError.message);
      setIsSaving(false);
      return;
    }

    setMessage("Profile saved.");
    setIsSaving(false);
    router.refresh();
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    setError(null);
    const supabase = createClient();
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
      setIsSigningOut(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSave}
        className="rounded-[var(--radius-lg)] border border-line bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-6"
      >
        <div className="border-b border-line pb-4">
          <h2 className="text-lg font-semibold text-ink">Your profile</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Update how your name appears on visit bookings.
          </p>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <label htmlFor="account-name" className="field-label">
              Full name
            </label>
            <input
              id="account-name"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="field-input"
            />
          </div>

          <div>
            <label htmlFor="account-email" className="field-label">
              Email
            </label>
            <input
              id="account-email"
              name="email"
              type="email"
              value={email}
              readOnly
              className="field-input bg-paper-deep/40 text-ink-soft"
            />
            <p className="mt-1.5 text-xs text-ink-muted">
              Email is used to sign in and cannot be changed here.
            </p>
          </div>
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-4 rounded-[var(--radius-sm)] border border-crowd-peak/30 bg-accent-soft px-3 py-2 text-sm text-accent-deep"
          >
            {error}
          </p>
        ) : null}

        {message ? (
          <p
            role="status"
            className="mt-4 rounded-[var(--radius-sm)] border border-line bg-paper px-3 py-2 text-sm text-ink-soft"
          >
            {message}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? "Saving…" : "Save profile"}
          </button>
          <Link href="/destinations" className="btn btn-secondary">
            Browse destinations
          </Link>
        </div>
      </form>

      <section className="rounded-[var(--radius-lg)] border border-line bg-surface p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-ink">Sign out</h2>
        <p className="mt-1 text-sm text-ink-muted">
          End your session on this device.
        </p>
        <button
          type="button"
          onClick={handleSignOut}
          className="btn btn-secondary mt-5"
          disabled={isSigningOut}
        >
          {isSigningOut ? "Signing out…" : "Sign out"}
        </button>
      </section>
    </div>
  );
}
