import type { Meta, StoryObj } from "@storybook/react";

import { Calendar } from "./Calendar";

import { paddingDecorator } from "@/developer/decorators";
import { fromDateId } from "@/helpers/dates";

const CalendarMeta: Meta<typeof Calendar> = {
  title: "Calendar",
  component: Calendar,
  argTypes: {
    firstDayOfWeek: {
      control: {
        type: "select",
      },
      options: ["monday", "sunday"],
    },
    onDayPress: { action: "onDayPress" },
    calendarItemDayFormat: { type: "string" },
    calendarRowMonthFormat: { type: "string" },
    calendarItemWeekNameFormat: { type: "string" },
  },
  args: {
    firstDayOfWeek: "sunday",
    month: fromDateId("2024-01-01"),
    calendarItemDayFormat: "d",
    calendarItemWeekNameFormat: "EEEEE",
    calendarRowMonthFormat: "MMMM yyyy",
    disabledDates: ["2024-01-01", "2024-01-02"],
    activeDateRanges: [{ startId: "2024-01-28", endId: "2024-01-30" }],
  },
  decorators: [paddingDecorator],
};

export default CalendarMeta;

export const Default: StoryObj<typeof Calendar> = {};

export const DisabledDates: StoryObj<typeof Calendar> = {
  args: {
    disabledDates: [
      "2024-01-01",
      "2024-01-02",
      "2024-01-03",
      "2024-01-16",
      "2024-01-17",
    ],
    month: fromDateId("2024-01-01"),
  },
};

export const ActiveDateRanges: StoryObj<typeof Calendar> = {
  args: {
    activeDateRanges: [
      { startId: "2024-01-04", endId: "2024-01-06" },
      { startId: "2024-01-10", endId: "2024-01-12" },
      //   Incomplete
      { startId: "2024-01-24" },
      { endId: "2024-01-29" },
    ],
    month: fromDateId("2024-01-01"),
  },
};
