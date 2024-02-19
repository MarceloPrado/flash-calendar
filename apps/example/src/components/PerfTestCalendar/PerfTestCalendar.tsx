import type { CalendarProps } from "@marceloterreiro/flash-calendar";
import {
  Calendar,
  activeDateRangesEmitter,
  useCalendar,
} from "@marceloterreiro/flash-calendar";
import { memo, useEffect } from "react";
import { Text } from "react-native";
import { uppercaseFirstLetter } from "@/helpers/strings";

import { useRenderCount } from "./useRenderCount";
import { PerfTestCalendarItemDayWithContainer } from "./PerfTestCalendarItemDay";

const BasePerfTestCalendar = memo(
  ({
    onCalendarDayPress,
    calendarRowVerticalSpacing = 8,
    calendarRowHorizontalSpacing = 8,
    theme,
    calendarDayHeight = 48,
    calendarMonthHeaderHeight = 20,
    calendarWeekHeaderHeight = calendarDayHeight,

    ...buildCalendarParams
  }: CalendarProps) => {
    const { calendarRowMonth, weeksList, weekDaysList } =
      useCalendar(buildCalendarParams);

    const renderCounter = useRenderCount(calendarRowMonth);

    return (
      <Calendar.VStack alignItems="center" spacing={calendarRowVerticalSpacing}>
        <Calendar.Row.Month
          height={calendarMonthHeaderHeight}
          theme={theme?.rowMonth}
        >
          {uppercaseFirstLetter(calendarRowMonth)}
          <Text style={{ fontWeight: "bold" }}>
            {" "}
            (render: {renderCounter}x ⚡)
          </Text>
        </Calendar.Row.Month>
        <Calendar.Row.Week spacing={8} theme={theme?.rowWeek}>
          {weekDaysList.map((weekDay, i) => (
            <Calendar.Item.WeekName
              height={calendarWeekHeaderHeight}
              key={i}
              theme={theme?.itemWeekName}
            >
              {weekDay}
            </Calendar.Item.WeekName>
          ))}
        </Calendar.Row.Week>
        {weeksList.map((week, index) => (
          <Calendar.Row.Week key={index}>
            {week.map((dayProps) => {
              if (dayProps.isDifferentMonth) {
                return (
                  <Calendar.Item.Day.Container
                    dayHeight={calendarDayHeight}
                    daySpacing={calendarRowHorizontalSpacing}
                    isStartOfWeek={dayProps.isStartOfWeek}
                    key={dayProps.id}
                    theme={theme?.itemDayContainer}
                  >
                    <Calendar.Item.Empty
                      height={calendarDayHeight}
                      theme={theme?.itemEmpty}
                    />
                  </Calendar.Item.Day.Container>
                );
              }

              return (
                <PerfTestCalendarItemDayWithContainer
                  containerTheme={theme?.itemDayContainer}
                  dayHeight={calendarDayHeight}
                  daySpacing={calendarRowHorizontalSpacing}
                  key={dayProps.id}
                  metadata={dayProps}
                  onPress={onCalendarDayPress}
                >
                  {dayProps.displayLabel}
                </PerfTestCalendarItemDayWithContainer>
              );
            })}
          </Calendar.Row.Week>
        ))}
      </Calendar.VStack>
    );
  }
);

BasePerfTestCalendar.displayName = "BasePerfTestCalendar";

export const PerfTestCalendar = memo(
  ({ calendarActiveDateRanges, ...props }: CalendarProps) => {
    useEffect(() => {
      activeDateRangesEmitter.emit(
        "onSetActiveDateRanges",
        calendarActiveDateRanges ?? []
      );
    }, [calendarActiveDateRanges]);

    return <BasePerfTestCalendar {...props} />;
  }
);
PerfTestCalendar.displayName = "PerfTestCalendar";
