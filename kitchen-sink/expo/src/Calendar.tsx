import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";
import { useState } from "react";
import { Text } from "react-native";

const today = toDateId(new Date());

export function CalendarDemo() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  return (
    <Calendar.VStack spacing={12}>
      <Text>Selected date: {selectedDate ?? "?"}</Text>
      <Calendar
        calendarActiveDateRanges={[
          {
            startId: selectedDate ?? undefined,
            endId: selectedDate ?? undefined,
          },
        ]}
        calendarMonthId={today}
        onCalendarDayPress={setSelectedDate}
      />
    </Calendar.VStack>
  );
}
