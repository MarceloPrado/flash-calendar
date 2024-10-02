import type { Meta, StoryObj } from "@storybook/react";
import {
  addDays,
  addMonths,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";
import { useCallback, useMemo, useRef, useState } from "react";
import { Button, Text, View } from "react-native";

import type { CalendarListProps, CalendarListRef } from "@/components";
import { Calendar } from "@/components";
import { HStack } from "@/components/HStack";
import { VStack } from "@/components/VStack";
import { paddingDecorator } from "@/developer/decorators";
import { loggingHandler } from "@/developer/loggginHandler";
import { fromDateId, toDateId } from "@/helpers/dates";
import type { CalendarActiveDateRange } from "@/hooks/useCalendar";
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
  },
  decorators: [paddingDecorator],
};

export default CalendarListMeta;

export const Default: StoryObj<typeof Calendar.List> = {};

export const SpacingDense: StoryObj<typeof Calendar.List> = {
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

export const WithShortFutureScrollRange: StoryObj<typeof Calendar.List> = {
  args: {
    calendarPastScrollRangeInMonths: 1,
    calendarFutureScrollRangeInMonths: 1,
    calendarInitialMonthId: "2024-02-01",
  },
};

export function SpacingSparse() {
  const [selectedDate, setSelectedDate] = useState<undefined | string>(
    undefined
  );

  const onCalendarDayPress = (dateId: string) => {
    setSelectedDate(dateId);
  };

  return (
    <VStack grow spacing={24}>
      <Text>Selected date: {selectedDate}</Text>

      <Calendar.List
        calendarActiveDateRanges={[
          {
            startId: selectedDate,
            endId: selectedDate,
          },
        ]}
        calendarDayHeight={50}
        calendarInitialMonthId={selectedDate}
        calendarMonthHeaderHeight={20}
        calendarRowHorizontalSpacing={16}
        calendarRowVerticalSpacing={16}
        calendarSpacing={48}
        calendarWeekHeaderHeight={32}
        onCalendarDayPress={onCalendarDayPress}
      />
    </VStack>
  );
}

export function ImperativeScrolling() {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  const [activeDateId, setActiveDateId] = useState<string | undefined>(
    toDateId(addDays(currentMonth, 3))
  );

  const calendarActiveDateRanges = useMemo<CalendarActiveDateRange[]>(() => {
    if (!activeDateId) return [];

    return [{ startId: activeDateId, endId: activeDateId }];
  }, [activeDateId]);

  const ref = useRef<CalendarListRef>(null);

  const onCalendarDayPress = useCallback((dateId: string) => {
    ref.current?.scrollToDate(fromDateId(dateId), true);
    setActiveDateId(dateId);
  }, []);

  return (
    <View style={{ paddingTop: 20, flex: 1 }}>
      <VStack alignItems="center" grow spacing={20}>
        <HStack spacing={12}>
          <Button
            onPress={() => {
              const pastMonth = subMonths(currentMonth, 1);
              setCurrentMonth(pastMonth);
              ref.current?.scrollToMonth(pastMonth, true);
            }}
            title="Past month"
          />
          <Text>Current: {toDateId(currentMonth)}</Text>
          <Button
            onPress={() => {
              const nextMonth = addMonths(currentMonth, 1);
              setCurrentMonth(nextMonth);
              ref.current?.scrollToMonth(nextMonth, true);
            }}
            title="Next month"
          />
        </HStack>
        <Button
          onPress={() => {
            const thisMonth = startOfMonth(new Date());
            setCurrentMonth(thisMonth);
            ref.current?.scrollToMonth(thisMonth, true);
          }}
          title="Today"
        />
        <View style={{ flex: 1, width: "100%" }}>
          <Calendar.List
            calendarActiveDateRanges={calendarActiveDateRanges}
            calendarInitialMonthId={toDateId(currentMonth)}
            onCalendarDayPress={onCalendarDayPress}
            ref={ref}
          />
        </View>
      </VStack>
    </View>
  );
}

export function MinAndMaxDates() {
  return (
    <VStack alignItems="center" grow spacing={20}>
      <Text>This calendar list is only available for the 2024 period</Text>
      <View style={{ flex: 1, width: "100%" }}>
        <Calendar.List
          calendarInitialMonthId="2024-02-13"
          calendarMaxDateId="2024-12-31"
          calendarMinDateId="2024-01-01"
          onCalendarDayPress={loggingHandler("onCalendarDayPress")}
        />
      </View>
    </VStack>
  );
}

export function DateRangePicker() {
  const calendarListProps = useMemo<Partial<CalendarListProps>>(() => {
    const today = new Date();
    return {
      calendarInitialMonthId: toDateId(today),
      calendarMinDateId: toDateId(startOfYear(today)),
      calendarMaxDateId: toDateId(endOfYear(today)),
    };
  }, []);

  const calendarDateRangeProps = useDateRange();
  const { onClearDateRange, dateRange, isDateRangeValid } =
    calendarDateRangeProps;

  const { colors } = useTheme();

  const textProps = {
    style: { color: colors.content.primary },
  };

  return (
    <VStack alignItems="center" grow spacing={20}>
      <Text style={{ ...textProps.style, fontWeight: "bold" }}>
        This shows how to build a date range picker bounded by the current year
      </Text>
      <View style={{ flex: 1, width: "100%" }}>
        <Calendar.List {...calendarListProps} {...calendarDateRangeProps} />
      </View>
      <HStack justifyContent="space-between" width="100%">
        <Button onPress={onClearDateRange} title="Clear range" />
        <VStack spacing={4}>
          <Text {...textProps}>Start: {dateRange.startId ?? "?"}</Text>
          <Text {...textProps}>End: {dateRange.endId ?? "?"}</Text>
        </VStack>
        <VStack alignItems="flex-end" spacing={4}>
          <Text {...textProps}>Is range valid?</Text>
          <Text {...textProps}>{isDateRangeValid ? "✅" : "❌"}</Text>
        </VStack>
      </HStack>
    </VStack>
  );
}

export const DatePicker = () => {
  const [activeDateId, setActiveDateId] = useState<string | undefined>(
    toDateId(addDays(startOfThisMonth, 3))
  );

  const calendarActiveDateRanges = useMemo<CalendarActiveDateRange[]>(() => {
    if (!activeDateId) return [];

    return [{ startId: activeDateId, endId: activeDateId }];
  }, [activeDateId]);

  return (
    <Calendar.List
      calendarActiveDateRanges={calendarActiveDateRanges}
      calendarInitialMonthId={toDateId(startOfThisMonth)}
      onCalendarDayPress={setActiveDateId}
    />
  );
};

export const ScrollingBackwardsWorkaround = () => {
  return (
    <VStack alignItems="stretch" grow spacing={12}>
      <Text>This preloads all past months between Jan 1st 2020 and today</Text>

      <Calendar.List
        calendarFutureScrollRangeInMonths={1}
        calendarInitialMonthId="2024-02-01"
        calendarMaxDateId="2024-05-01"
        calendarMinDateId="2020-01-01"
        calendarPastScrollRangeInMonths={50}
        onCalendarDayPress={loggingHandler("onCalendarDayPress")}
      />
    </VStack>
  );
};

export const TwoCalendarListsMounted = () => {
  return (
    <VStack grow spacing={48}>
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
  const calendarDateRangeProps = useDateRange();
  const rerender = useRef(0);
  rerender.current += 1;
  return (
    <VStack grow spacing={8}>
      <Calendar.List
        {...calendarDateRangeProps}
        calendarInstanceId={instanceId}
      />
      <Text>
        {instanceId}: {calendarDateRangeProps.dateRange.startId} -{" "}
        {calendarDateRangeProps.dateRange.endId} (re-renders: {rerender.current}
        ⚡)
      </Text>
    </VStack>
  );
}

export const Demo = () => {
  const dateRangeOne = useDateRange();
  const dateRangeTwo = useDateRange();
  return (
    <VStack grow spacing={48}>
      <VStack grow spacing={4}>
        <Text>First calendar</Text>
        <Calendar
          calendarInstanceId="First"
          calendarMonthId="2024-08-01"
          {...dateRangeOne}
        />
      </VStack>
      <VStack grow spacing={4}>
        <Text>Second calendar</Text>
        <Calendar
          calendarInstanceId="Second"
          calendarMonthId="2024-08-01"
          {...dateRangeTwo}
        />
      </VStack>
    </VStack>
  );
};
