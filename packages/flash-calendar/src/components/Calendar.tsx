import { memo, useEffect } from "react";

import type {
  CalendarItemDayContainerProps,
  CalendarItemDayProps,
} from "@/components/CalendarItemDay";
import {
  CalendarItemDayContainer,
  CalendarItemDayWithContainer,
} from "@/components/CalendarItemDay";
import type { CalendarItemEmptyProps } from "@/components/CalendarItemEmpty";
import { CalendarItemEmpty } from "@/components/CalendarItemEmpty";
import type { CalendarItemWeekNameProps } from "@/components/CalendarItemWeekName";
import { CalendarItemWeekName } from "@/components/CalendarItemWeekName";
import type { CalendarRowMonthProps } from "@/components/CalendarRowMonth";
import { CalendarRowMonth } from "@/components/CalendarRowMonth";
import type { CalendarRowWeekProps } from "@/components/CalendarRowWeek";
import { CalendarRowWeek } from "@/components/CalendarRowWeek";
import { VStack } from "@/components/VStack";
import { uppercaseFirstLetter } from "@/helpers/strings";
import type { BaseTheme } from "@/helpers/tokens";
import type { UseCalendarParams } from "@/hooks/useCalendar";
import { useCalendar } from "@/hooks/useCalendar";
import { activeDateRangesEmitter } from "@/hooks/useOptimizedDayMetadata";

export interface CalendarTheme {
  rowMonth?: CalendarRowMonthProps["theme"];
  rowWeek?: CalendarRowWeekProps["theme"];
  itemWeekName?: CalendarItemWeekNameProps["theme"];
  itemEmpty?: CalendarItemEmptyProps["theme"];
  itemDayContainer?: CalendarItemDayContainerProps["theme"];
  /**
   * The theme for the day. `base` is applied before any state, allowing you to
   * set a base value once and use it for all states.
   */
  itemDay?: CalendarItemDayProps["theme"];
}

export type CalendarOnDayPress = (dateId: string) => void;

export interface CalendarProps extends UseCalendarParams {
  onCalendarDayPress: CalendarOnDayPress;
  /**
   * The spacing between each calendar row (the month header, the week days row,
   * and the weeks row)
   * @defaultValue 8
   */
  calendarRowVerticalSpacing?: number;
  /**
   * The spacing between each day in the weeks row.
   * @defaultValue 8
   */
  calendarRowHorizontalSpacing?: number;
  /**
   * The height of each day cell.
   * @defaultValue 32
   */
  calendarDayHeight?: number;
  /**
   * The height of the week day's header.
   * @defaultValue calendarDayHeight
   */
  calendarWeekHeaderHeight?: number;
  /**
   * The height of the month header.
   * @defaultValue 20
   */
  calendarMonthHeaderHeight?: number;
  /** Theme to customize the calendar component. */
  theme?: CalendarTheme;
}

const BaseCalendar = memo(
  ({
    onCalendarDayPress,
    calendarRowVerticalSpacing = 8,
    calendarRowHorizontalSpacing = 8,
    theme,
    calendarDayHeight = 32,
    calendarMonthHeaderHeight = 20,
    calendarWeekHeaderHeight = calendarDayHeight,

    ...buildCalendarParams
  }: CalendarProps) => {
    const { calendarRowMonth, weeksList, weekDaysList } =
      useCalendar(buildCalendarParams);

    return (
      <VStack
        alignItems="center"
        spacing={calendarRowVerticalSpacing as keyof BaseTheme["spacing"]}
      >
        <CalendarRowMonth
          height={calendarMonthHeaderHeight}
          theme={theme?.rowMonth}
        >
          {uppercaseFirstLetter(calendarRowMonth)}
        </CalendarRowMonth>
        <CalendarRowWeek spacing={8} theme={theme?.rowWeek}>
          {weekDaysList.map((weekDay, i) => (
            <CalendarItemWeekName
              height={calendarWeekHeaderHeight}
              key={i}
              theme={theme?.itemWeekName}
            >
              {weekDay}
            </CalendarItemWeekName>
          ))}
        </CalendarRowWeek>
        {weeksList.map((week, index) => (
          <CalendarRowWeek key={index}>
            {week.map((dayProps) => {
              if (dayProps.isDifferentMonth) {
                return (
                  <CalendarItemDayContainer
                    dayHeight={calendarDayHeight}
                    daySpacing={calendarRowHorizontalSpacing}
                    isStartOfWeek={dayProps.isStartOfWeek}
                    key={dayProps.id}
                    theme={theme?.itemDayContainer}
                  >
                    <CalendarItemEmpty
                      height={calendarDayHeight}
                      theme={theme?.itemEmpty}
                    />
                  </CalendarItemDayContainer>
                );
              }

              return (
                <CalendarItemDayWithContainer
                  containerTheme={theme?.itemDayContainer}
                  dayHeight={calendarDayHeight}
                  daySpacing={calendarRowHorizontalSpacing}
                  key={dayProps.id}
                  metadata={dayProps}
                  onPress={onCalendarDayPress}
                  theme={theme?.itemDay}
                >
                  {dayProps.displayLabel}
                </CalendarItemDayWithContainer>
              );
            })}
          </CalendarRowWeek>
        ))}
      </VStack>
    );
  }
);
BaseCalendar.displayName = "BaseCalendar";

export const Calendar = memo(
  ({ calendarActiveDateRanges, ...props }: CalendarProps) => {
    useEffect(() => {
      activeDateRangesEmitter.emit(
        "onSetActiveDateRanges",
        calendarActiveDateRanges ?? []
      );
    }, [calendarActiveDateRanges]);

    return <BaseCalendar {...props} />;
  }
);

Calendar.displayName = "Calendar";
