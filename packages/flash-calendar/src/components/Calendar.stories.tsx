import type { Meta, StoryObj } from "@storybook/react";
import { addDays, subDays } from "date-fns";
import { format } from "date-fns/fp/format";
import { useRef, useState } from "react";
import { Text } from "react-native";

import { paddingDecorator } from "@/developer/decorators";
import { loggingHandler } from "@/developer/loggginHandler";
import { endOfMonth, startOfMonth, toDateId } from "@/helpers/dates";
import { useDateRange } from "@/hooks/useDateRange";
import { VStack } from "@/components/VStack";

import { Calendar } from "./Calendar";

const today = new Date();

const startOfThisMonth = startOfMonth(today);
const endOfThisMonth = endOfMonth(today);

const CalendarMeta: Meta<typeof Calendar> = {
  title: "Calendar",
  component: Calendar,
  argTypes: {
    calendarFirstDayOfWeek: {
      control: {
        type: "select",
      },
      options: ["monday", "sunday"],
    },
    onCalendarDayPress: { action: "onCalendarDayPress" },
    calendarFormatLocale: { type: "string" },
  },

  args: {
    calendarFirstDayOfWeek: "sunday",
    calendarMonthId: toDateId(startOfThisMonth),
    calendarFormatLocale: "en-US",
  },
  decorators: [paddingDecorator],
};

export default CalendarMeta;

/**
 * This serves as a kitchen-sink test. It shows most day states working together:
 * - Today
 * - Active ranges (single + multiple days)
 * - Disabled (min/max + specific dates)
 * - Idle
 */
export const KichenSink: StoryObj<typeof Calendar> = {
  args: {
    calendarFirstDayOfWeek: "sunday",
    calendarMonthId: toDateId(startOfThisMonth),
    calendarDisabledDateIds: [
      toDateId(addDays(today, 1)),
      toDateId(subDays(today, 1)),
    ],
    calendarMinDateId: toDateId(addDays(startOfThisMonth, 2)),
    calendarMaxDateId: toDateId(subDays(endOfThisMonth, 2)),
    calendarActiveDateRanges: [
      {
        startId: toDateId(addDays(startOfThisMonth, 3)),
        endId: toDateId(addDays(startOfThisMonth, 8)),
      },
      {
        startId: toDateId(addDays(startOfThisMonth, 15)),
        endId: toDateId(addDays(startOfThisMonth, 15)),
      },
    ],
  },
};

export const DisabledDates: StoryObj<typeof Calendar> = {
  args: {
    calendarDisabledDateIds: [
      "2024-01-01",
      "2024-01-02",
      "2024-01-03",
      "2024-01-16",
      "2024-01-17",
    ],
    calendarMonthId: "2024-01-01",
  },
};

export const MinAndMaxDates: StoryObj<typeof Calendar> = {
  args: {
    calendarMonthId: "2024-03-01",
    calendarMinDateId: "2024-03-10",
    calendarMaxDateId: "2024-03-20",
  },
};

export const ActiveDateRanges: StoryObj<typeof Calendar> = {
  args: {
    calendarActiveDateRanges: [
      { startId: "2024-01-04", endId: "2024-01-06" },
      { startId: "2024-01-10", endId: "2024-01-12" },
      //   Incomplete
      { startId: "2024-01-24" },
      { endId: "2024-01-29" },
    ],
    calendarMonthId: "2024-01-01",
  },
};

export const WithCustomLocale = (args: typeof KichenSink.args) => {
  return (
    <Calendar
      {...args}
      calendarFormatLocale="pt-BR"
      calendarMonthId={toDateId(startOfThisMonth)}
      onCalendarDayPress={loggingHandler("onCalendarDayPress")}
    />
  );
};

export const WithCustomFormatting = (args: typeof KichenSink.args) => {
  return (
    <Calendar
      {...args}
      calendarMonthId={toDateId(startOfThisMonth)}
      getCalendarDayFormat={format("dd")}
      getCalendarMonthFormat={format("MMMM yyyy (LL/yyyy)")}
      getCalendarWeekDayFormat={format("E")}
      onCalendarDayPress={loggingHandler("onCalendarDayPress")}
    />
  );
};

export const DatePicker = (args: typeof KichenSink.args) => {
  const [activeDateId, setActiveDateId] = useState(
    toDateId(addDays(startOfThisMonth, 3))
  );

  return (
    <Calendar
      {...args}
      calendarActiveDateRanges={[
        { startId: activeDateId, endId: activeDateId },
      ]}
      calendarMonthId={toDateId(startOfThisMonth)}
      onCalendarDayPress={setActiveDateId}
    />
  );
};

export const DateRangePicker = (args: typeof KichenSink.args) => {
  const { calendarActiveDateRanges, onCalendarDayPress } = useDateRange({
    startId: "2024-02-04",
    endId: "2024-02-09",
  });

  return (
    <Calendar
      {...args}
      calendarActiveDateRanges={calendarActiveDateRanges}
      calendarMonthId={toDateId(startOfThisMonth)}
      onCalendarDayPress={onCalendarDayPress}
    />
  );
};

export const ControlledColorScheme: StoryObj<typeof Calendar> = {
  args: {
    calendarColorScheme: "dark",
  },
};

export const LightModeOnly = () => {
  const { calendarActiveDateRanges, onCalendarDayPress } = useDateRange({
    startId: "2024-02-04",
    endId: "2024-02-09",
  });

  return (
    <Calendar
      calendarActiveDateRanges={calendarActiveDateRanges}
      calendarColorScheme="light"
      calendarMonthId={toDateId(startOfThisMonth)}
      onCalendarDayPress={onCalendarDayPress}
    />
  );
};

export const TwoCalendarsMounted = () => {
  return (
    <VStack spacing={48}>
      <CalendarInstanceDemo instanceId="First" startingIndex={3} />
      <CalendarInstanceDemo instanceId="Second" startingIndex={10} />
    </VStack>
  );
};

function CalendarInstanceDemo({
  instanceId,
  startingIndex,
}: {
  instanceId: string;
  startingIndex: number;
}) {
  const [date, setDate] = useState(
    toDateId(addDays(startOfThisMonth, startingIndex))
  );
  const rerender = useRef(0);
  rerender.current += 1;
  return (
    <VStack spacing={8}>
      <Calendar
        calendarActiveDateRanges={[
          {
            startId: date,
            endId: date,
          },
        ]}
        calendarInstanceId={instanceId}
        calendarMonthId={date}
        onCalendarDayPress={setDate}
      />
      <Text>
        {instanceId} date: {date} (re-renders: {rerender.current}⚡)
      </Text>
    </VStack>
  );
}
