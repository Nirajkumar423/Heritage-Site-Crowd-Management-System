import { connection } from "next/server";
import { SlotPicker } from "@/components/slot-picker";
import { availableSlotDates, getTimeSlots } from "@/lib/heritage";
import type { HeritageTimeSlot } from "@/lib/types";

type DestinationBookingProps = {
  destinationId: string;
  destinationName?: string;
};

export async function DestinationBooking({
  destinationId,
  destinationName,
}: DestinationBookingProps) {
  await connection();

  const dates = availableSlotDates(7);
  const slotGroups = await Promise.all(
    dates.map((date) => getTimeSlots(destinationId, date)),
  );

  const slotsByDate: Record<string, HeritageTimeSlot[]> = {};
  dates.forEach((date, index) => {
    slotsByDate[date] = slotGroups[index] ?? [];
  });

  return (
    <SlotPicker
      dates={dates}
      initialDate={dates[0]}
      slotsByDate={slotsByDate}
      destinationName={destinationName}
    />
  );
}
