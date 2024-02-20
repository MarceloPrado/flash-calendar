import {
  Calendar,
  toDateId,
  useDateRange,
} from "@marceloterreiro/flash-calendar";
import type { Meta } from "@storybook/react";
import { addDays, startOfMonth } from "date-fns";
import { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { paddingDecorator } from "@/developer/decorators";

import { PerfTestCalendar } from "./PerfTestCalendar";

const PerfTestCalendarMeta: Meta<typeof PerfTestCalendar> = {
  title: "Performance Test/Calendar.List",
  component: PerfTestCalendar,
  decorators: [paddingDecorator],
};

export default PerfTestCalendarMeta;

const startOfThisMonth = startOfMonth(new Date());

export const DatePicker = () => {
  const [activeDateId, setActiveDateId] = useState<string | undefined>(
    toDateId(addDays(startOfThisMonth, 3))
  );

  return (
    <Calendar.List
      calendarActiveDateRanges={[
        { startId: activeDateId, endId: activeDateId },
      ]}
      calendarDayHeight={48}
      calendarInitialMonthId={toDateId(startOfThisMonth)}
      calendarSpacing={20}
      onCalendarDayPress={setActiveDateId}
      renderItem={({ item }) => (
        <View style={{ paddingBottom: 20 }}>
          <PerfTestCalendar calendarMonthId={item.id} {...item.calendarProps} />
        </View>
      )}
    />
  );
};

export const DateRangePicker = () => {
  const { calendarActiveDateRanges, onCalendarDayPress } = useDateRange({
    startId: toDateId(addDays(startOfThisMonth, 3)),
    endId: toDateId(addDays(startOfThisMonth, 8)),
  });

  return (
    <Calendar.List
      calendarActiveDateRanges={calendarActiveDateRanges}
      calendarDayHeight={48}
      calendarInitialMonthId={toDateId(startOfThisMonth)}
      calendarSpacing={20}
      onCalendarDayPress={onCalendarDayPress}
      renderItem={({ item }) => (
        <View style={{ paddingBottom: 20 }}>
          <PerfTestCalendar calendarMonthId={item.id} {...item.calendarProps} />
        </View>
      )}
    />
  );
};

export const LenghtyDateRangePicker = () => {
  const { calendarActiveDateRanges, onCalendarDayPress } = useDateRange({
    startId: toDateId(addDays(startOfThisMonth, 3)),
    endId: toDateId(addDays(startOfThisMonth, 8)),
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        This renders a list of 2.000 calendars at once, to stress-test
        Calendar.List's performance.
      </Text>
      <View style={{ flex: 1, width: "100%" }}>
        <Calendar.List
          calendarActiveDateRanges={calendarActiveDateRanges}
          calendarDayHeight={48}
          calendarFutureScrollRangeInMonths={999}
          calendarInitialMonthId={toDateId(startOfThisMonth)}
          calendarPastScrollRangeInMonths={1000}
          calendarSpacing={20}
          onCalendarDayPress={onCalendarDayPress}
          renderItem={({ item }) => (
            <View style={{ paddingBottom: 20 }}>
              <PerfTestCalendar
                calendarMonthId={item.id}
                {...item.calendarProps}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "bold",
  },
});
