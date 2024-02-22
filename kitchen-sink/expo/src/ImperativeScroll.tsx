import { addMonths, subMonths, startOfMonth } from "date-fns";
import type { CalendarListRef } from "@marceloterreiro/flash-calendar";
import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";
import { useRef, useState } from "react";
import { Button, Text, View } from "react-native";

export function ImperativeScrolling() {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  const ref = useRef<CalendarListRef>(null);

  return (
    <View style={{ paddingTop: 20, flex: 1 }}>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Button
          onPress={() => {
            const pastMonth = subMonths(currentMonth, 1);
            setCurrentMonth(pastMonth);
            ref.current?.scrollToDate(pastMonth, true);
          }}
          title="Past month"
        />
        <Text>Current: {toDateId(currentMonth)}</Text>
        <Button
          onPress={() => {
            const nextMonth = addMonths(currentMonth, 1);
            setCurrentMonth(nextMonth);
            ref.current?.scrollToDate(nextMonth, true);
          }}
          title="Next month"
        />
      </View>
      <View style={{ flex: 1, width: "100%" }}>
        <Calendar.List
          calendarInitialMonthId={toDateId(currentMonth)}
          onCalendarDayPress={(dateId) => console.log(`Pressed ${dateId}`)}
          ref={ref}
        />
      </View>
    </View>
  );
}
