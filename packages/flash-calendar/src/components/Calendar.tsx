import { memo } from "react";

import {
  CalendarItemDay,
  CalendarItemDayContainer,
  CalendarItemDayContainerProps,
  CalendarItemDayProps,
  DayState,
} from "@/components/CalendarItemDay";
import {
  CalendarItemEmpty,
  CalendarItemEmptyProps,
} from "@/components/CalendarItemEmpty";
import {
  CalendarItemWeekName,
  CalendarItemWeekNameProps,
} from "@/components/CalendarItemWeekName";
import {
  CalendarRowMonth,
  CalendarRowMonthProps,
} from "@/components/CalendarRowMonth";
import {
  CalendarRowWeek,
  CalendarRowWeekProps,
} from "@/components/CalendarRowWeek";
import { VStack } from "@/components/VStack";
import { uppercaseFirstLetter } from "@/helpers/strings";
import { BaseTheme } from "@/helpers/tokens";
import { UseCalendarParams, useCalendar } from "@/hooks/useCalendar";

export type CalendarTheme = {
  rowMonth?: CalendarRowMonthProps["theme"];
  rowWeek?: CalendarRowWeekProps["theme"];
  itemWeekName?: CalendarItemWeekNameProps["theme"];
  itemEmpty?: CalendarItemEmptyProps["theme"];
  itemDayContainer?: CalendarItemDayContainerProps["theme"];
  itemDay?: CalendarItemDayProps["theme"];
};

export interface CalendarProps extends UseCalendarParams {
  onDayPress: (dateId: string, date: Date) => void;
  disabledDates?: string[];
  /**
   * The spacing between each calendar row (the month header, the week days row,
   * and the weeks row)
   * @default 8
   */
  calendarRowVerticalSpacing?: number;
  /**
   * The spacing between each day in the weeks row.
   * @default 8
   */
  calendarRowHorizontalSpacing?: number;
  /**
   * The height of each day cell.
   * @default 32
   */
  calendarDayHeight?: number;
  /**
   * The height of the week day's header.
   * @default calendarDayHeight
   */
  calendarWeekHeaderHeight?: number;
  /**
   * The height of the month header.
   * @default 20
   */
  calendarMonthHeaderHeight?: number;
  /** Theme to customize the calendar component. */
  theme?: CalendarTheme;
}

export const Calendar = memo(
  ({
    onDayPress,
    disabledDates,
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
                state,
                displayLabel,
                isStartOfRange,
                date,
                isToday,
              } = dayProps;
              if (isDifferentMonth) {
                return (
                  <CalendarItemDayContainer
                    key={id}
                    isStartOfWeek={isStartOfWeek}
                    theme={theme?.itemDayContainer}
                    daySpacing={calendarRowHorizontalSpacing}
                    dayHeight={calendarDayHeight}
                  >
                    <CalendarItemEmpty
                      key={id}
                      height={calendarDayHeight}
                      theme={theme?.itemEmpty}
                    />
                  </CalendarItemDayContainer>
                );
              }

              let safeState: DayState = state;
              // We only want to override idle states.
              if (safeState === "idle") {
                if (disabledDates?.includes(id)) {
                  safeState = "disabled";
                } else if (isToday) {
                  safeState = "today";
                }
              }

              return (
                <CalendarItemDayContainer
                  key={id}
                  shouldShowActiveDayFiller={
                    isRangeValid && !isEndOfWeek && !isEndOfRange
                  }
                  isStartOfWeek={isStartOfWeek}
                  theme={theme?.itemDayContainer}
                  daySpacing={calendarRowHorizontalSpacing}
                  dayHeight={calendarDayHeight}
                >
                  <CalendarItemDay
                    metadata={{
                      ...dayProps,
                      isEndOfRange: isEndOfRange || !isRangeValid,
                      isStartOfRange: isStartOfRange || !isRangeValid,
                      state: safeState,
                    }}
                    onPress={(_id) => onDayPress(_id, date)}
                    height={calendarDayHeight}
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
