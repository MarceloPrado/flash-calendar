import type { Meta, StoryObj } from "@storybook/react";
import { addDays, endOfMonth, subDays, startOfMonth } from "date-fns";

import { paddingDecorator } from "@/developer/decorators";
import { toDateId } from "@/helpers/dates";

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
    calendarDayFormat: { type: "string" },
    calendarMonthFormat: { type: "string" },
    calendarWeekDayFormat: { type: "string" },
  },

  args: {
    calendarFirstDayOfWeek: "sunday",
    calendarMonthId: toDateId(startOfThisMonth),
    calendarDayFormat: "d",
    calendarWeekDayFormat: "EEEEE",
    calendarMonthFormat: "MMMM yyyy",
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
    calendarDayFormat: "d",
    calendarWeekDayFormat: "EEEEE",
    calendarMonthFormat: "MMMM yyyy",
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
