import type { CalendarListProps } from "@marceloterreiro/flash-calendar";
import {
  Calendar,
  toDateId,
  useDateRange,
} from "@marceloterreiro/flash-calendar";
import { useMemo } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export function CalendarListDemo() {
  const calendarListProps = useMemo<Partial<CalendarListProps>>(() => {
    const today = new Date();
    return {
      calendarInitialMonthId: toDateId(today),
    };
  }, []);

  const {
    isDateRangeValid,
    onClearDateRange,
    calendarActiveDateRanges,
    dateRange,
    onCalendarDayPress,
  } = useDateRange();

  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold" }}>
        This shows how to build a date range picker bounded by the current year
      </Text>
      <View style={{ flex: 1, width: "100%" }}>
        <Calendar.List
          {...calendarListProps}
          calendarActiveDateRanges={calendarActiveDateRanges}
          onCalendarDayPress={onCalendarDayPress}
        />
      </View>
      <Calendar.HStack
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Button onPress={onClearDateRange} title="Clear range" />
        <View style={styles.vStack}>
          <Text>Start: {dateRange.startId ?? "?"}</Text>
          <Text>End: {dateRange.endId ?? "?"}</Text>
        </View>
        <View style={styles.vStack}>
          <Text>Is range valid?</Text>
          <Text>{isDateRangeValid ? "✅" : "❌"}</Text>
        </View>
      </Calendar.HStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    justifyContent: "space-between",
  },
  vStack: {
    gap: 4,
  },
});
