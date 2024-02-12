import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Text } from "react-native";

import { CalendarList } from "./CalendarList";

import { VStack } from "@/components/VStack";
import { paddingDecorator } from "@/developer/decorators";
import { loggingHandler } from "@/developer/loggginHandler";

const CalendarListMeta: Meta<typeof CalendarList> = {
  title: "CalendarList",
  component: CalendarList,
  argTypes: {},
  args: {
    onDayPress: loggingHandler("onDayPress"),
    calendarRowVerticalSpacing: 8,
    calendarRowHorizontalSpacing: 8,
  },
  decorators: [paddingDecorator],
};

export default CalendarListMeta;

export const Default: StoryObj<typeof CalendarList> = {};

export const WithCustomSpacing: StoryObj<typeof CalendarList> = {
  args: {
    calendarRowVerticalSpacing: 0,
    calendarRowHorizontalSpacing: 4,
  },
};

export const WithDateRangeAndDisabledDates: StoryObj<typeof CalendarList> = {
  args: {
    calendarActiveDateRanges: [
      {
        startId: "2024-01-15",
        endId: "2024-01-28",
      },
    ],
    disabledDates: ["2024-01-01", "2024-01-02"],
    calendarInitialMonthId: "2024-01-01",
  },
};

export const WithShortRanges: StoryObj<typeof CalendarList> = {
  args: {
    calendarPastScrollRangeInMonths: 1,
    calendarFutureScrollRangeInMonths: 1,
    calendarInitialMonthId: "2024-02-01",
  },
};

export const SparseCalendar = () => {
  const [show, setShown] = useState(true);
  const [selectedDate, setSelectedDate] = useState<undefined | string>(
    undefined
  );

  const onDayPress = (dateId: string) => {
    setSelectedDate(dateId);
    setShown(false);
  };

  return (
    <VStack spacing={24} grow>
      <Text>Selected date: {selectedDate}</Text>

      <CalendarList
        // month={selectedDate ? fromDateId(selectedDate) : undefined}
        calendarActiveDateRanges={[
          {
            startId: selectedDate,
            endId: selectedDate,
          },
        ]}
        calendarInitialMonthId={selectedDate}
        onDayPress={onDayPress}
        calendarRowVerticalSpacing={16}
        calendarDayHeight={50}
        calendarMonthHeaderHeight={20}
        calendarWeekHeaderHeight={32}
        calendarSpacing={48}
        calendarRowHorizontalSpacing={16}
      />
    </VStack>
  );
};
