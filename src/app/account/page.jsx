import { redirect } from "next/navigation";
import { AccountPanel } from "@/components/account-panel";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Account",
  description: "Manage your Darshan visitor account.",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/account");
  }

  const fullName =
    user.user_metadata?.full_name || user.user_metadata?.name || "";

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
          <AccountPanel email={user.email || ""} fullName={fullName} />
        </div>
      </div>
    </section>
  );
}
