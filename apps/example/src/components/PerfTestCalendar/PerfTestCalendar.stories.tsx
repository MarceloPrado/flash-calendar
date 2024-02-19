import { toDateId, useDateRange } from "@marceloterreiro/flash-calendar";
import type { Meta } from "@storybook/react";
import { addDays, startOfMonth } from "date-fns";
import { useState } from "react";

import { paddingDecorator } from "@/developer/decorators";

import { PerfTestCalendar } from "./PerfTestCalendar";

const PerfTestCalendarMeta: Meta<typeof PerfTestCalendar> = {
  title: "Performance Test/Calendar",
  component: PerfTestCalendar,
  decorators: [paddingDecorator],
};

export default PerfTestCalendarMeta;

const startOfThisMonth = startOfMonth(new Date());

export const DatePicker = () => {
  const [activeDateId, setActiveDateId] = useState(
    toDateId(addDays(startOfThisMonth, 3))
  );

  return (
    <PerfTestCalendar
      calendarActiveDateRanges={[
        { startId: activeDateId, endId: activeDateId },
      ]}
      calendarMonthId={toDateId(startOfThisMonth)}
      onCalendarDayPress={setActiveDateId}
    />
  );
};

export const DateRangePicker = () => {
  const { calendarActiveDateRanges, onCalendarDayPress } = useDateRange({
    startId: toDateId(addDays(startOfThisMonth, 3)),
    endId: toDateId(addDays(startOfThisMonth, 8)),
  });

  return (
    <PerfTestCalendar
      calendarActiveDateRanges={calendarActiveDateRanges}
      calendarMonthId={toDateId(startOfThisMonth)}
      onCalendarDayPress={onCalendarDayPress}
    />
  );
};
