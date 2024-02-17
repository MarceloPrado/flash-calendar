import type { Meta, StoryObj } from "@storybook/react";
import { add, endOfYear, startOfMonth, startOfYear, sub } from "date-fns";
import { useMemo, useRef, useState } from "react";
import { Button, Text, View } from "react-native";

import { Calendar, CalendarListProps, CalendarListRef } from "@/components";
import { HStack } from "@/components/HStack";
import { VStack } from "@/components/VStack";
import { paddingDecorator } from "@/developer/decorators";
import { loggingHandler } from "@/developer/loggginHandler";
import { toDateId } from "@/helpers/dates";
import { useDateRange } from "@/hooks/useDateRange";
import { useTheme } from "@/hooks/useTheme";

const today = new Date();

const startOfThisMonth = startOfMonth(today);

const CalendarListMeta: Meta<typeof Calendar.List> = {
  title: "Calendar.List",
  component: Calendar.List,
  argTypes: {},
  args: {
    onCalendarDayPress: loggingHandler("onCalendarDayPress"),
    calendarRowVerticalSpacing: 8,
    calendarRowHorizontalSpacing: 8,
    calendarFutureScrollRangeInMonths: 12,
    calendarPastScrollRangeInMonths: 12,

    calendarFirstDayOfWeek: "sunday",
    calendarInitialMonthId: toDateId(startOfThisMonth),
    calendarDayFormat: "d",
    calendarWeekDayFormat: "EEEEE",
    calendarMonthFormat: "MMMM yyyy",
  },
  decorators: [paddingDecorator],
};

export default CalendarListMeta;

export const Default: StoryObj<typeof Calendar.List> = {};

export const WithCustomSpacing: StoryObj<typeof Calendar.List> = {
  args: {
    calendarRowVerticalSpacing: 0,
    calendarRowHorizontalSpacing: 4,
  },
};

export const WithDateRangeAndDisabledDates: StoryObj<typeof Calendar.List> = {
  args: {
    calendarActiveDateRanges: [
      {
        startId: "2024-01-15",
        endId: "2024-01-28",
      },
    ],
    calendarDisabledDateIds: ["2024-01-01", "2024-01-02"],
    calendarInitialMonthId: "2024-01-01",
  },
};

export const WithShortRanges: StoryObj<typeof Calendar.List> = {
  args: {
    calendarPastScrollRangeInMonths: 1,
    calendarFutureScrollRangeInMonths: 1,
    calendarInitialMonthId: "2024-02-01",
  },
};

export const SparseCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<undefined | string>(
    undefined
  );

  const onCalendarDayPress = (dateId: string) => {
    setSelectedDate(dateId);
  };

  return (
    <VStack spacing={24} grow>
      <Text>Selected date: {selectedDate}</Text>

      <Calendar.List
        calendarActiveDateRanges={[
          {
            startId: selectedDate,
            endId: selectedDate,
          },
        ]}
        calendarInitialMonthId={selectedDate}
        onCalendarDayPress={onCalendarDayPress}
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

export const ImperativeScrolling = () => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  const ref = useRef<CalendarListRef>(null);

  return (
    <View style={{ paddingTop: 20, flex: 1 }}>
      <VStack spacing={20} grow alignItems="center">
        <HStack spacing={12}>
          <Button
            title="Past month"
            onPress={() => {
              const pastMonth = sub(currentMonth, { months: 1 });
              setCurrentMonth(pastMonth);
              ref.current?.scrollToDate(pastMonth, true);
            }}
          />
          <Text>Current: {toDateId(currentMonth)}</Text>
          <Button
            title="Next month"
            onPress={() => {
              const nextMonth = add(currentMonth, { months: 1 });
              setCurrentMonth(nextMonth);
              ref.current?.scrollToDate(nextMonth, true);
            }}
          />
        </HStack>
        <Button
          title="Today"
          onPress={() => {
            const thisMonth = startOfMonth(new Date());
            setCurrentMonth(thisMonth);
            ref.current?.scrollToDate(thisMonth, true);
          }}
        />
        <View style={{ flex: 1, width: "100%" }}>
          <Calendar.List
            onCalendarDayPress={loggingHandler("onCalendarDayPress")}
            calendarInitialMonthId={toDateId(currentMonth)}
            ref={ref}
          />
        </View>
      </VStack>
    </View>
  );
};

export const MinAndMaxDates = () => {
  return (
    <VStack spacing={20} grow alignItems="center">
      <Text>This calendar list is only available for the 2024 period</Text>
      <View style={{ flex: 1, width: "100%" }}>
        <Calendar.List
          onCalendarDayPress={loggingHandler("onCalendarDayPress")}
          calendarInitialMonthId={"2024-02-13"}
          calendarMinDateId={"2024-01-01"}
          calendarMaxDateId={"2024-12-31"}
        />
      </View>
    </VStack>
  );
};

export const DateRangePicker = () => {
  const calendarListProps = useMemo<Partial<CalendarListProps>>(() => {
    const today = new Date();
    return {
      calendarInitialMonthId: toDateId(today),
      calendarMinDateId: toDateId(startOfYear(today)),
      calendarMaxDateId: toDateId(endOfYear(today)),
    };
  }, []);

  const {
    isDateRangeValid,
    onClearDateRange,
    dateRange,
    ...calendarDateRangeProps
  } = useDateRange();

  const { colors } = useTheme();

  const textProps = {
    style: { color: colors.content.primary },
  };

  return (
    <VStack spacing={20} grow alignItems="center">
      <Text style={{ ...textProps.style, fontWeight: "bold" }}>
        This shows how to build a date range picker bounded by the current year
      </Text>
      <View style={{ flex: 1, width: "100%" }}>
        <Calendar.List {...calendarListProps} {...calendarDateRangeProps} />
      </View>
      <HStack justifyContent="space-between" width={"100%"}>
        <Button title="Clear range" onPress={onClearDateRange} />
        <VStack spacing={4}>
          <Text {...textProps}>Start: {dateRange.startId ?? "?"}</Text>
          <Text {...textProps}>End: {dateRange.endId ?? "?"}</Text>
        </VStack>
        <VStack spacing={4} alignItems="flex-end">
          <Text {...textProps}>Is range valid?</Text>
          <Text {...textProps}>{isDateRangeValid ? "✅" : "❌"}</Text>
        </VStack>
      </HStack>
    </VStack>
  );
};
