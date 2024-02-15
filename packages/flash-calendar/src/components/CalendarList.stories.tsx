import type { Meta, StoryObj } from "@storybook/react";
import { add, set, startOfMonth, sub } from "date-fns";
import { useCallback, useMemo, useRef, useState } from "react";
import { Button, Text, View } from "react-native";

import { Calendar, CalendarListRef, CalendarOnDayPress } from "@/components";
import { HStack } from "@/components/HStack";
import { VStack } from "@/components/VStack";
import { paddingDecorator } from "@/developer/decorators";
import { loggingHandler } from "@/developer/loggginHandler";
import { toDateId } from "@/helpers/dates";
import { CalendarActiveDateRange } from "@/hooks/useCalendar";

const CalendarListMeta: Meta<typeof Calendar.List> = {
  title: "Calendar.List",
  component: Calendar.List,
  argTypes: {},
  args: {
    onDayPress: loggingHandler("onDayPress"),
    calendarRowVerticalSpacing: 8,
    calendarRowHorizontalSpacing: 8,
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

  const onDayPress = (dateId: string) => {
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

export const ImperativeScrolling = () => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  const ref = useRef<CalendarListRef>(null);

  return (
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
      <HStack spacing={12}>
        <Button
          title="Past year"
          onPress={() => {
            const pastYear = sub(currentMonth, { years: 1 });
            setCurrentMonth(pastYear);
            ref.current?.scrollToDate(pastYear, true);
          }}
        />
        <Button
          title="Today"
          onPress={() => {
            const thisMonth = startOfMonth(new Date());
            setCurrentMonth(thisMonth);
            ref.current?.scrollToDate(thisMonth, true);
          }}
        />
        <Button
          title="Next year"
          onPress={() => {
            const nextYear = add(currentMonth, { years: 1 });
            setCurrentMonth(nextYear);
            ref.current?.scrollToDate(nextYear, true);
          }}
        />
      </HStack>
      <View
        // This hardcoded height is just to simplify testing the programmatic scrolling
        style={{
          height: 32 * 8,
          width: "100%",
          backgroundColor: "rgba(0,0,0,.05)",
        }}
      >
        <Calendar.List
          onDayPress={loggingHandler("onDayPress")}
          calendarInitialMonthId={toDateId(currentMonth)}
          calendarPastScrollRangeInMonths={0}
          calendarFutureScrollRangeInMonths={0}
          calendarSpacing={20}
          calendarRowVerticalSpacing={0}
          calendarMonthHeaderHeight={32}
          calendarWeekHeaderHeight={32}
          ref={ref}
        />
      </View>
    </VStack>
  );
};

export const MinAndMaxDates = () => {
  return (
    <VStack spacing={20} grow alignItems="center">
      <Text>This calendar list is only available for the 2024 period</Text>
      <View style={{ flex: 1, width: "100%" }}>
        <Calendar.List
          onDayPress={loggingHandler("onDayPress")}
          calendarInitialMonthId={"2024-02-13"}
          calendarMinDateId={"2024-01-01"}
          calendarMaxDateId={"2024-12-31"}
        />
      </View>
    </VStack>
  );
};

export const DateRangePicker = () => {
  const [dateRange, setDateRange] = useState<CalendarActiveDateRange>({
    startId: undefined,
    endId: undefined,
  });
  const handleDayPress = useCallback<CalendarOnDayPress>(
    (dateId: string) => {
      // Starting the first range
      if (!dateRange.startId && !dateRange.endId) {
        setDateRange({
          startId: dateId,
          endId: undefined,
        });
      } else if (dateRange.startId && dateRange.endId) {
        // Starting a new range
        setDateRange({
          startId: dateId,
          endId: undefined,
        });
      } else if (dateRange.startId && !dateRange.endId) {
        if (dateId < dateRange.startId) {
          setDateRange({
            startId: dateId,
            endId: dateRange.startId,
          });
        } else {
          setDateRange({
            ...dateRange,
            endId: dateId,
          });
        }
      }
    },
    [dateRange]
  );

  const handleClear = useCallback(() => {
    setDateRange({ startId: undefined, endId: undefined });
  }, []);

  const calendarActiveDateRanges = useMemo<CalendarActiveDateRange[]>(() => {
    return [dateRange];
  }, [dateRange]);

  return (
    <VStack spacing={20} grow alignItems="center">
      <Text>This shows how to build a date range picker</Text>
      <View style={{ flex: 1, width: "100%" }}>
        <Calendar.List
          onDayPress={handleDayPress}
          calendarInitialMonthId={"2024-02-13"}
          calendarMinDateId={"2024-01-01"}
          calendarMaxDateId={"2024-12-31"}
          calendarActiveDateRanges={calendarActiveDateRanges}
        />
      </View>
      <HStack justifyContent="space-between" width={"100%"}>
        <Button title="Clear range" onPress={handleClear} />
        <VStack spacing={4}>
          <Text>Start: {dateRange.startId ?? "?"}</Text>
          <Text>End: {dateRange.endId ?? "?"}</Text>
        </VStack>
      </HStack>
    </VStack>
  );
};
