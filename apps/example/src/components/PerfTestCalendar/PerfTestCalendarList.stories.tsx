import {
  Calendar,
  toDateId,
  useDateRange,
} from "@marceloterreiro/flash-calendar";
import type { Meta } from "@storybook/react";
import { addDays, startOfMonth } from "date-fns";
import { useState } from "react";
import { View } from "react-native";
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
