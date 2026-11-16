"use client";

import { useMemo, useState } from "react";
import { CrowdBadge } from "@/components/crowd-badge";
import {
  formatDateLabel,
  formatTime,
  slotFillPercent,
} from "@/lib/format";
import type { HeritageTimeSlot } from "@/lib/types";

type SlotPickerProps = {
  dates: string[];
  initialDate: string;
  slotsByDate: Record<string, HeritageTimeSlot[]>;
};

export function SlotPicker({
  dates,
  initialDate,
  slotsByDate,
}: SlotPickerProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const slots = useMemo(
    () => slotsByDate[selectedDate] ?? [],
    [selectedDate, slotsByDate],
  );

  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId) ?? null;

  return (
    <section className="rounded-[var(--radius-lg)] border border-line bg-surface p-5 shadow-[var(--shadow-soft)]">
      <h2 className="text-lg font-semibold text-ink">Choose a time slot</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Expected crowd is estimated from booked capacity for each window.
      </p>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {dates.map((date) => {
          const active = date === selectedDate;
          return (
            <button
              key={date}
              type="button"
              onClick={() => {
                setSelectedDate(date);
                setSelectedSlotId(null);
              }}
              className={`min-w-[5.5rem] rounded-[var(--radius-sm)] border px-3 py-2 text-left transition-colors ${
                active
                  ? "border-accent bg-accent-soft text-ink"
                  : "border-line bg-paper text-ink-soft hover:border-ink-muted"
              }`}
            >
              <span className="block text-xs uppercase tracking-[0.08em] text-ink-muted">
                {formatDateLabel(date).split(",")[0]}
              </span>
              <span className="mt-1 block text-sm font-semibold">
                {formatDateLabel(date).split(", ").slice(1).join(" ")}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-2">
        {slots.length === 0 ? (
          <p className="text-sm text-ink-muted">
            No timed entry windows for this date.
          </p>
        ) : (
          slots.map((slot) => {
            const fill = slotFillPercent(slot.booked, slot.capacity);
            const remaining = Math.max(slot.capacity - slot.booked, 0);
            const soldOut = remaining === 0;
            const active = selectedSlotId === slot.id;

            return (
              <button
                key={slot.id}
                type="button"
                disabled={soldOut}
                onClick={() => setSelectedSlotId(slot.id)}
                className={`grid gap-2 rounded-[var(--radius-md)] border px-3 py-3 text-left transition-colors sm:grid-cols-[1fr_auto] sm:items-center ${
                  active
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:border-ink-muted"
                } ${soldOut ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <div>
                  <p className="font-semibold text-ink">
                    {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {soldOut
                      ? "Sold out"
                      : `${remaining.toLocaleString("en-IN")} spots left · ${fill}% full`}
                  </p>
                </div>
                <CrowdBadge level={slot.expected_crowd} />
              </button>
            );
          })
        )}
      </div>

      <div className="mt-5 border-t border-line pt-4">
        {selectedSlot ? (
          <p className="text-sm text-ink-soft">
            Selected{" "}
            <strong>
              {formatTime(selectedSlot.start_time)} –{" "}
              {formatTime(selectedSlot.end_time)}
            </strong>{" "}
            on {formatDateLabel(selectedDate)}. Expected crowd:{" "}
            {selectedSlot.expected_crowd}.
          </p>
        ) : (
          <p className="text-sm text-ink-muted">
            Select a slot to hold your preferred entry window.
          </p>
        )}
        <button
          type="button"
          className="btn btn-primary mt-4 w-full"
          disabled={!selectedSlot}
        >
          Reserve slot
        </button>
      </div>
    </section>
  );
}
