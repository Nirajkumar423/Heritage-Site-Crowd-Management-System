import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AccountPanel } from "@/components/account-panel";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Account",
  description: "Manage your Darshan visitor account.",
};

async function AccountContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/account");
  }

  const fullName =
    user.user_metadata?.full_name || user.user_metadata?.name || "";

  return <AccountPanel email={user.email || ""} fullName={fullName} />;
}

function AccountFallback() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-sm">
      <div className="h-6 w-48 animate-pulse rounded bg-paper-deep" />
      <div className="mt-4 h-10 w-full animate-pulse rounded bg-paper-deep" />
      <div className="mt-4 h-10 w-full animate-pulse rounded bg-paper-deep" />
    </div>
  );
}

export default function AccountPage() {
  return (
    <section className="section !py-10 md:!py-14">
      <div className="container max-w-2xl">
        <p className="eyebrow">Account</p>
        <h1 className="display mt-3 text-3xl text-ink sm:text-4xl">
          Your visitor profile
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
          Keep your details current for bookings and e-pass contact.
        </p>
        <div className="mt-8">
          <Suspense fallback={<AccountFallback />}>
            <AccountContent />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

