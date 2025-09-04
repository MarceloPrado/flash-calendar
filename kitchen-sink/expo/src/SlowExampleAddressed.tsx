import type { CalendarOnDayPress } from "@marceloterreiro/flash-calendar";
import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";
import { addMonths } from "date-fns";
import { useCallback, useState } from "react";
import { View, Text } from "react-native";

const todayId = toDateId(new Date());
const maxDateId = toDateId(addMonths(new Date(), 12));

export const SlowExampleAddressed = () => {
  const [dateIds, setDateIds] = useState<string[]>([]);
  const dateRanges = dateIds.map((dateId) => ({
    startId: dateId,
    endId: dateId,
  }));

  const handleCalendarDayPress = useCallback<CalendarOnDayPress>(
    (dateId: string) => {
      setDateIds((dateIds) => {
        if (dateIds.includes(dateId)) {
          return dateIds.filter((id) => id !== dateId);
        } else {
          return [...dateIds, dateId];
        }
      });
    },
    [],
  );

  return (
    <View style={{ paddingTop: 80, flex: 1, width: "100%" }}>
      <Calendar.VStack alignItems="stretch" grow spacing={12}>
        <Text>✅ This is safe to copy, perf issues addressed</Text>

        <Calendar.List
          calendarActiveDateRanges={dateRanges}
          calendarInitialMonthId={todayId}
          calendarMaxDateId={maxDateId}
          calendarMinDateId={todayId}
          onCalendarDayPress={handleCalendarDayPress}
        />
      </Calendar.VStack>
    </View>
  );
};
