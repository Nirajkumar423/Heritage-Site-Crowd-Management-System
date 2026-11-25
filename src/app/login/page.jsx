import { Suspense } from "react";
import { AuthPanel } from "@/components/auth-panel";
import { LoginForm } from "@/components/login-form";

export const metadata = {
  title: "Sign in",
  description: "Sign in to your Darshan visitor account.",
};

export default function LoginPage() {
  return (
    <AuthPanel
      title="Welcome back"
      subtitle="Sign in to manage your visitor profile and keep booking details ready."
    >
      <Suspense
        fallback={
          <p className="text-sm text-ink-muted">Loading sign in form…</p>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthPanel>
  );
}
