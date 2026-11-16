import { formatInr } from "@/lib/format";
import type { HeritageTicketType } from "@/lib/types";

type TicketListProps = {
  tickets: HeritageTicketType[];
};

export function TicketList({ tickets }: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        Ticket details will appear here when published.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-line border-y border-line">
      {tickets.map((ticket) => (
        <li
          key={ticket.id}
          className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-start"
        >
          <div>
            <p className="font-semibold text-ink">{ticket.name}</p>
            <p className="mt-1 text-sm text-ink-muted">{ticket.description}</p>
            {ticket.includes.length > 0 ? (
              <p className="mt-2 text-xs uppercase tracking-[0.08em] text-ink-soft">
                Includes {ticket.includes.join(" · ")}
              </p>
            ) : null}
          </div>
          <p className="text-lg font-semibold text-ink">
            {formatInr(ticket.price_inr)}
          </p>
        </li>
      ))}
    </ul>
  );
}
