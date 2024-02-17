import { memo } from "react";

import type {
  CalendarItemDayContainerProps,
  CalendarItemDayProps,
} from "@/components/CalendarItemDay";
import {
  CalendarItemDay,
  CalendarItemDayContainer,
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

export type CalendaronCalendarDayPress = (dateId: string) => void;

export interface CalendarProps extends UseCalendarParams {
  onCalendarDayPress: CalendaronCalendarDayPress;
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

export const Calendar = memo(
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
              const {
                isDifferentMonth,
                isStartOfWeek,
                id,
                isRangeValid,
                isEndOfWeek,
                isEndOfRange,
                displayLabel,
              } = dayProps;
              if (isDifferentMonth) {
                return (
                  <CalendarItemDayContainer
                    dayHeight={calendarDayHeight}
                    daySpacing={calendarRowHorizontalSpacing}
                    isStartOfWeek={isStartOfWeek}
                    key={id}
                    theme={theme?.itemDayContainer}
                  >
                    <CalendarItemEmpty
                      height={calendarDayHeight}
                      key={id}
                      theme={theme?.itemEmpty}
                    />
                  </CalendarItemDayContainer>
                );
              }

              return (
                <CalendarItemDayContainer
                  dayHeight={calendarDayHeight}
                  daySpacing={calendarRowHorizontalSpacing}
                  isStartOfWeek={isStartOfWeek}
                  key={id}
                  shouldShowActiveDayFiller={
                    isRangeValid && !isEndOfWeek ? !isEndOfRange : false
                  }
                  theme={theme?.itemDayContainer}
                >
                  <CalendarItemDay
                    height={calendarDayHeight}
                    metadata={dayProps}
                    onPress={onCalendarDayPress}
                    theme={theme?.itemDay}
                  >
                    {displayLabel}
                  </CalendarItemDay>
                </CalendarItemDayContainer>
              );
            })}
          </CalendarRowWeek>
        ))}
      </VStack>
    );
  }
);
Calendar.displayName = "Calendar";
