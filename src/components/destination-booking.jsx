import { connection } from "next/server";
import { SlotPicker } from "@/components/slot-picker";
import { availableSlotDates, getTimeSlots } from "@/lib/heritage";

export async function DestinationBooking({
  destinationId,
  destinationName,
  destination,
}) {
  await connection();

  const dates = availableSlotDates(7);
  const slotGroups = await Promise.all(
    dates.map((date) => getTimeSlots(destinationId, date, destination)),
  );

  const slotsByDate = {};
  dates.forEach((date, index) => {
    slotsByDate[date] = slotGroups[index] ?? [];
  });

  return (
    <SlotPicker
      dates={dates}
      initialDate={dates[0]}
      slotsByDate={slotsByDate}
      destinationName={destinationName}
      destination={destination}
    />
  );
}
