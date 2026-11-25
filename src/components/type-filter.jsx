import Link from "next/link";

const filters = [
  { value: "all", label: "All sites" },
  { value: "monument", label: "Monuments" },
  { value: "fort", label: "Forts" },
  { value: "museum", label: "Museums" },
  { value: "heritage_site", label: "Heritage" },
];

export function TypeFilter({ active }) {
  return (
    <div className="flex flex-wrap gap-2" role="list" aria-label="Site type">
      {filters.map((filter) => {
        const href =
          filter.value === "all"
            ? "/destinations"
            : `/destinations?type=${filter.value}`;
        const isActive = active === filter.value;

        return (
          <Link
            key={filter.value}
            href={href}
            role="listitem"
            className={`rounded-[var(--radius-sm)] border px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--surface)]"
                : "border-[var(--line)] bg-[var(--surface)] text-[var(--ink-soft)] hover:border-[var(--ink-muted)]"
            }`}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
