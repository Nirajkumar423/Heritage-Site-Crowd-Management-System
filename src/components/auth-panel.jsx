import Link from "next/link";

export function AuthPanel({
  title,
  subtitle,
  children,
  footer,
  sideTitle = "Plan quieter visits",
  sideCopy = "Save your details once. Return for timed entry and crowd levels across heritage sites.",
}) {
  return (
    <section className="section !py-10 md:!py-14">
      <div className="container">
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface shadow-[var(--shadow-soft)] md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
          <div className="p-6 sm:p-8 md:p-10">
            <p className="eyebrow">Darshan</p>
            <h1 className="display mt-3 text-3xl text-ink sm:text-4xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
                {subtitle}
              </p>
            ) : null}
            <div className="mt-8">{children}</div>
            {footer ? (
              <p className="mt-6 text-sm text-ink-muted">{footer}</p>
            ) : null}
          </div>
          <aside className="relative hidden min-h-[22rem] overflow-hidden bg-hero text-surface md:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(184,92,56,0.35),transparent_45%),linear-gradient(160deg,rgba(27,36,32,0.92),rgba(27,36,32,0.78))]" />
            <div className="relative flex h-full flex-col justify-end p-10">
              <p className="eyebrow text-surface/65">Visitor account</p>
              <h2 className="display mt-3 max-w-sm text-3xl text-surface">
                {sideTitle}
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-surface/75">
                {sideCopy}
              </p>
              <Link
                href="/destinations"
                className="mt-8 inline-flex text-sm font-semibold text-surface underline-offset-4 hover:underline"
              >
                Browse destinations
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
