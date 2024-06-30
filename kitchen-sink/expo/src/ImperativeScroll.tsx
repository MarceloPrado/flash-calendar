import { addMonths, subMonths, startOfMonth } from "date-fns";
import type { CalendarListRef } from "@marceloterreiro/flash-calendar";
import {
  Calendar,
  toDateId,
  fromDateId,
} from "@marceloterreiro/flash-calendar";
import { useCallback, useRef, useState } from "react";
import { Button, Text, View } from "react-native";

export function ImperativeScrolling() {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const ref = useRef<CalendarListRef>(null);

  const onCalendarDayPress = useCallback((dateId: string) => {
    ref.current?.scrollToDate(fromDateId(dateId), true);
  }, []);

  return (
    <View style={{ paddingTop: 20, flex: 1 }}>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Button
          onPress={() => {
            const pastMonth = subMonths(currentMonth, 1);
            setCurrentMonth(pastMonth);
            ref.current?.scrollToMonth(pastMonth, true);
          }}
          title="Past month"
        />
        <Text>Current: {toDateId(currentMonth)}</Text>
        <Button
          onPress={() => {
            const nextMonth = addMonths(currentMonth, 1);
            setCurrentMonth(nextMonth);
            ref.current?.scrollToMonth(nextMonth, true);
          }}
          title="Next month"
        />
      </View>
      <View style={{ flex: 1, width: "100%" }}>
        <Calendar.List
          calendarInitialMonthId={toDateId(currentMonth)}
          onCalendarDayPress={onCalendarDayPress}
          ref={ref}
        />
      </View>
    </View>
  );
}
