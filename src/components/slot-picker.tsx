"use client";

import { useMemo, useState } from "react";
import { CrowdBadge } from "@/components/crowd-badge";
import {
  formatDateLabel,
  formatTime,
  slotFillPercent,
} from "@/lib/format";
import type { HeritageTimeSlot } from "@/lib/types";

export type FakeReservation = {
  bookingId: string;
  destinationName: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  expectedCrowd: string;
  visitorName: string;
  contact: string;
  guestCount: number;
  category: string;
  bookedAt: string;
};

type SlotPickerProps = {
  dates: string[];
  initialDate: string;
  slotsByDate: Record<string, HeritageTimeSlot[]>;
  destinationName?: string;
};

export function SlotPicker({
  dates,
  initialDate,
  slotsByDate,
  destinationName = "Heritage Destination",
}: SlotPickerProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  // Reservation Form State
  const [guestCount, setGuestCount] = useState<number>(2);
  const [visitorName, setVisitorName] = useState<string>("Aarav Sharma");
  const [contact, setContact] = useState<string>("aarav.sharma@example.com");
  const [category, setCategory] = useState<string>("Domestic / Resident");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Status message for notification / toast banner
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "info" | "warning";
    text: string;
  } | null>(null);

  // Active reservation store
  const [reservation, setReservation] = useState<FakeReservation | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const slots = useMemo(
    () => slotsByDate[selectedDate] ?? [],
    [selectedDate, slotsByDate],
  );

  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId) ?? null;

  // Handle reserve submission
  const handleReserve = () => {
    if (!selectedSlot) return;

    if (!visitorName.trim()) {
      setErrorMessage("Please enter the primary visitor's full name.");
      return;
    }

    if (!contact.trim()) {
      setErrorMessage("Please enter an email or phone number for the e-pass.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const randomCode = Math.floor(100000 + Math.random() * 900000);
      const bookingId = `STP-${randomCode}`;

      const newReservation: FakeReservation = {
        bookingId,
        destinationName,
        slotId: selectedSlot.id,
        date: selectedDate,
        startTime: selectedSlot.start_time,
        endTime: selectedSlot.end_time,
        expectedCrowd: selectedSlot.expected_crowd,
        visitorName: visitorName.trim(),
        contact: contact.trim(),
        guestCount,
        category,
        bookedAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setReservation(newReservation);
      setIsSubmitting(false);
      setStatusMessage({
        type: "success",
        text: `🎉 Reservation confirmed! Booking reference #${bookingId} has been held for ${newReservation.visitorName}.`,
      });
    }, 650);
  };

  // Handle cancellation
  const handleCancelReservation = () => {
    if (!reservation) return;
    const cancelledId = reservation.bookingId;
    setReservation(null);
    setStatusMessage({
      type: "warning",
      text: `Reservation #${cancelledId} was successfully cancelled. Your reserved spots have been released.`,
    });
  };

  // Handle copy booking code
  const handleCopyCode = () => {
    if (!reservation) return;
    navigator.clipboard?.writeText(reservation.bookingId);
    setCopiedCode(true);
    setStatusMessage({
      type: "info",
      text: `📋 Booking code #${reservation.bookingId} copied to clipboard!`,
    });
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Handle fake download PDF
  const handleDownloadPass = () => {
    if (!reservation) return;
    setDownloadSuccess(true);
    setStatusMessage({
      type: "info",
      text: `📥 Digital e-Pass PDF (${reservation.bookingId}.pdf) downloaded successfully!`,
    });
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const isSelectedSlotReserved =
    Boolean(reservation && selectedSlot && reservation.slotId === selectedSlot.id);

  return (
    <section className="rounded-[var(--radius-lg)] border border-line bg-surface p-5 shadow-[var(--shadow-soft)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">Choose a time slot</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Expected crowd is estimated from booked capacity for each window.
          </p>
        </div>
        {reservation && (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Active Pass
          </span>
        )}
      </div>

      {/* Global Status Notification Message */}
      {statusMessage && (
        <div
          role="status"
          className={`rise-in mt-4 flex items-start justify-between gap-2 rounded-[var(--radius-sm)] border p-3 text-sm transition-all ${
            statusMessage.type === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-900"
              : statusMessage.type === "warning"
              ? "border-amber-300 bg-amber-50 text-amber-900"
              : "border-blue-300 bg-blue-50 text-blue-900"
          }`}
        >
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-base leading-none">
              {statusMessage.type === "success"
                ? "✓"
                : statusMessage.type === "warning"
                ? "⚠"
                : "ℹ"}
            </span>
            <p className="font-medium leading-snug">{statusMessage.text}</p>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-xs font-bold opacity-60 hover:opacity-100"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* Date Tabs */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {dates.map((date) => {
          const active = date === selectedDate;
          const hasBookingOnDate = reservation && reservation.date === date;

          return (
            <button
              key={date}
              type="button"
              onClick={() => {
                setSelectedDate(date);
                setSelectedSlotId(null);
              }}
              className={`relative min-w-[5.5rem] rounded-[var(--radius-sm)] border px-3 py-2 text-left transition-colors ${
                active
                  ? "border-accent bg-accent-soft text-ink"
                  : "border-line bg-paper text-ink-soft hover:border-ink-muted"
              }`}
            >
              {hasBookingOnDate && (
                <span
                  title="Active booking on this date"
                  className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-600"
                />
              )}
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

      {/* Slots List */}
      <div className="mt-5 grid gap-2">
        {slots.length === 0 ? (
          <p className="text-sm text-ink-muted">
            No timed entry windows for this date.
          </p>
        ) : (
          slots.map((slot) => {
            const isReservedSlot = reservation?.slotId === slot.id;
            const extraBooked = isReservedSlot ? reservation.guestCount : 0;
            const effectiveBooked = slot.booked + extraBooked;
            const fill = slotFillPercent(effectiveBooked, slot.capacity);
            const remaining = Math.max(slot.capacity - effectiveBooked, 0);
            const soldOut = remaining === 0;
            const active = selectedSlotId === slot.id;

            return (
              <button
                key={slot.id}
                type="button"
                disabled={soldOut}
                onClick={() => setSelectedSlotId(slot.id)}
                className={`grid gap-2 rounded-[var(--radius-md)] border px-3 py-3 text-left transition-colors sm:grid-cols-[1fr_auto] sm:items-center ${
                  isReservedSlot
                    ? "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-400/40"
                    : active
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:border-ink-muted"
                } ${soldOut ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-ink">
                      {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                    </p>
                    {isReservedSlot && (
                      <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                        Your Slot
                      </span>
                    )}
                  </div>
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

      {/* Reservation Management & Booking Flow */}
      <div className="mt-5 border-t border-line pt-4">
        {isSelectedSlotReserved && reservation ? (
          /* CONFIRMED RESERVATION CARD & DIGITAL PASS */
          <div className="space-y-4 rounded-[var(--radius-md)] border border-emerald-200 bg-emerald-50/40 p-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  Reservation Confirmed
                </span>
                <h3 className="mt-1 font-serif text-lg font-bold text-ink">
                  Timed Entry Pass
                </h3>
              </div>
              <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-mono font-semibold text-emerald-800">
                Guaranteed
              </span>
            </div>

            {/* Reference Number Box */}
            <div className="flex items-center justify-between rounded border border-emerald-200 bg-white px-3 py-2">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-ink-muted">
                  Booking Reference
                </p>
                <p className="font-mono text-base font-bold text-ink">
                  {reservation.bookingId}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="text-xs font-semibold text-accent hover:text-accent-deep"
              >
                {copiedCode ? "✓ Copied" : "Copy Code"}
              </button>
            </div>

            {/* Pass Summary Details */}
            <div className="grid grid-cols-2 gap-2 text-xs text-ink-soft">
              <div>
                <span className="text-ink-muted">Monument:</span>
                <p className="font-semibold">{reservation.destinationName}</p>
              </div>
              <div>
                <span className="text-ink-muted">Date:</span>
                <p className="font-semibold">{formatDateLabel(reservation.date)}</p>
              </div>
              <div>
                <span className="text-ink-muted">Entry Window:</span>
                <p className="font-semibold">
                  {formatTime(reservation.startTime)} –{" "}
                  {formatTime(reservation.endTime)}
                </p>
              </div>
              <div>
                <span className="text-ink-muted">Visitors:</span>
                <p className="font-semibold">
                  {reservation.guestCount} ({reservation.category})
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-ink-muted">Lead Guest:</span>
                <p className="font-semibold">
                  {reservation.visitorName} · {reservation.contact}
                </p>
              </div>
            </div>

            {/* Simulated QR Pass Graphic */}
            <div className="rounded-lg border border-dashed border-emerald-300 bg-white p-3 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded border border-line bg-paper-deep/30 p-2">
                <svg
                  className="h-full w-full text-ink"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M2 2h7v7H2V2zm2 2v3h3V4H4zm11-2h7v7h-7V2zm2 2v3h3V4h-3zM2 15h7v7H2v-7zm2 2v3h3v-3H4zm14 0h3v3h-3v-3zm-3-2h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 4h3v3h-3v-3zm-6-2h2v4h-2v-4zm8-4h2v2h-2v-2zm-4-4h2v2h-2v-2zm2-2h2v2h-2V7zm-4 0h2v4h-2V7z" />
                </svg>
              </div>
              <p className="mt-2 text-[11px] font-semibold text-ink-muted">
                Scan at Turnstile Gate A on arrival
              </p>
              <p className="text-[10px] text-ink-muted">
                Please carry a valid government photo ID for each visitor.
              </p>
            </div>

            {/* Reservation Action Buttons */}
            <div className="grid gap-2 pt-1">
              <button
                type="button"
                onClick={handleDownloadPass}
                className="btn btn-primary w-full text-sm"
              >
                {downloadSuccess ? "✓ Pass Saved" : "Download Digital Pass (PDF)"}
              </button>
              <button
                type="button"
                onClick={handleCancelReservation}
                className="rounded border border-red-200 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors"
              >
                Cancel this reservation
              </button>
            </div>
          </div>
        ) : selectedSlot ? (
          /* NEW RESERVATION FORM */
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-ink">
                Hold slot:{" "}
                <strong>
                  {formatTime(selectedSlot.start_time)} –{" "}
                  {formatTime(selectedSlot.end_time)}
                </strong>
              </p>
              <p className="text-xs text-ink-muted">
                {formatDateLabel(selectedDate)} · Expected crowd:{" "}
                <span className="font-semibold text-ink capitalize">
                  {selectedSlot.expected_crowd}
                </span>
              </p>
            </div>

            {errorMessage && (
              <p className="rounded border border-red-300 bg-red-50 p-2 text-xs font-medium text-red-800">
                {errorMessage}
              </p>
            )}

            {/* Guest Count Counter */}
            <div className="flex items-center justify-between rounded border border-line bg-paper px-3 py-2">
              <div>
                <p className="text-xs font-semibold text-ink">Number of Visitors</p>
                <p className="text-[11px] text-ink-muted">Max 6 per reservation</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setGuestCount((c) => Math.max(1, c - 1))}
                  className="flex h-7 w-7 items-center justify-center rounded border border-line bg-surface font-bold text-ink hover:bg-paper-deep"
                  aria-label="Decrease visitors"
                >
                  −
                </button>
                <span className="w-5 text-center text-sm font-bold text-ink">
                  {guestCount}
                </span>
                <button
                  type="button"
                  onClick={() => setGuestCount((c) => Math.min(6, c + 1))}
                  className="flex h-7 w-7 items-center justify-center rounded border border-line bg-surface font-bold text-ink hover:bg-paper-deep"
                  aria-label="Increase visitors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Lead Visitor Name */}
            <div>
              <label
                htmlFor="lead-visitor-name"
                className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted"
              >
                Lead Visitor Name
              </label>
              <input
                id="lead-visitor-name"
                type="text"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="mt-1 w-full rounded border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent"
              />
            </div>

            {/* Contact Email / Mobile */}
            <div>
              <label
                htmlFor="visitor-contact"
                className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted"
              >
                Email or Mobile (for e-Pass)
              </label>
              <input
                id="visitor-contact"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="aarav@example.com or +91 98765 43210"
                className="mt-1 w-full rounded border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent"
              />
            </div>

            {/* Category selection */}
            <div>
              <label
                htmlFor="visitor-category"
                className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted"
              >
                Visitor Category
              </label>
              <select
                id="visitor-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent"
              >
                <option value="Domestic / Resident">Domestic / Resident (Aadhaar / ID)</option>
                <option value="Foreign National">Foreign National (Passport)</option>
                <option value="Student (with ID)">Student (Valid Student ID)</option>
              </select>
            </div>

            {/* Guarantees note */}
            <div className="rounded bg-paper p-2.5 text-[11px] text-ink-muted leading-relaxed">
              ✓ Instant digital reservation · Free cancellation · Present e-pass at entry turnstile
            </div>

            {/* Reserve Action Button */}
            <button
              type="button"
              onClick={handleReserve}
              disabled={isSubmitting}
              className="btn btn-primary w-full font-semibold"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Holding spot...
                </span>
              ) : (
                `Confirm Reservation (${guestCount} ${
                  guestCount > 1 ? "spots" : "spot"
                })`
              )}
            </button>
          </div>
        ) : (
          /* NO SLOT SELECTED */
          <div>
            <p className="text-sm text-ink-muted">
              Select a slot to hold your preferred entry window.
            </p>
            {reservation && (
              <div className="mt-3 rounded border border-emerald-200 bg-emerald-50/70 p-2.5 text-xs text-emerald-900">
                You have a confirmed reservation for{" "}
                <strong>
                  {formatTime(reservation.startTime)} –{" "}
                  {formatTime(reservation.endTime)}
                </strong>{" "}
                on {formatDateLabel(reservation.date)}.
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate(reservation.date);
                    setSelectedSlotId(reservation.slotId);
                  }}
                  className="ml-2 font-bold underline hover:text-emerald-950"
                >
                  View Pass
                </button>
              </div>
            )}
            <button
              type="button"
              className="btn btn-primary mt-4 w-full opacity-60 cursor-not-allowed"
              disabled
            >
              Reserve slot
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
