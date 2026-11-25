import { AuthPanel } from "@/components/auth-panel";
import { SignupForm } from "@/components/signup-form";

export const metadata = {
  title: "Create account",
  description: "Create a Darshan visitor account for timed entry planning.",
};

export default function SignupPage() {
  return (
    <AuthPanel
      title="Create your account"
      subtitle="Save your name and email so return visits and e-passes stay easy to manage."
      sideTitle="One account for every site"
      sideCopy="Use the same profile across monuments and museums when you reserve quieter entry windows."
    >
      <SignupForm />
    </AuthPanel>
  );
}
