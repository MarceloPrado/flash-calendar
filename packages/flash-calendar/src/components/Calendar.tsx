import { memo } from "react";

import {
  CalendarItemDay,
  CalendarItemDayContainer,
  CalendarItemEmpty,
} from "@/components/CalendarItemDay";
import { CalendarItemWeekName } from "@/components/CalendarItemWeekName";
import { CalendarRowMonth } from "@/components/CalendarRowMonth";
import { CalendarRowWeek } from "@/components/CalendarRowWeek";
import { VStack } from "@/components/VStack";
import { uppercaseFirstLetter } from "@/helpers/strings";
import { tokens } from "@/helpers/tokens";
import { BuildCalendarParams, useCalendar } from "@/hooks/useCalendar";

export interface CalendarProps extends BuildCalendarParams {
  onDayPress: (dateId: string, date: Date) => void;
  disabledDates?: string[];
  activeDateRanges?: { startId?: string; endId?: string }[];
  /**
   * The spacing between each calendar row (the month header, the week days row,
   * and the weeks row)
   * @default 8
   */
  calendarRowSpacing?: number;
}

export const Calendar = memo(
  ({
    onDayPress,
    disabledDates,
    activeDateRanges,
    calendarRowSpacing = 8,
    ...buildCalendarParams
  }: CalendarProps) => {
    const { calendarRowMonth, weeksList, weekDaysList } =
      useCalendar(buildCalendarParams);

    return (
      <VStack
        alignItems="center"
        spacing={calendarRowSpacing as keyof typeof tokens.spacing}
      >
        <CalendarRowMonth>
          {uppercaseFirstLetter(calendarRowMonth)}
        </CalendarRowMonth>
        <CalendarRowWeek spacing={8}>
          {weekDaysList.map((weekDay, i) => (
            <CalendarItemWeekName key={i}>{weekDay}</CalendarItemWeekName>
          ))}
        </CalendarRowWeek>
        {weeksList.map((week, index) => (
          <CalendarRowWeek key={index}>
            {week.map((dayProps) => {
              const {
                isDifferentMonth,
                id,
                displayLabel,
                isToday,
                date,
                isEndOfWeek,
                isStartOfWeek,
              } = dayProps;
              if (isDifferentMonth) {
                return (
                  <CalendarItemDayContainer
                    key={id}
                    isStartOfWeek={isStartOfWeek}
                  >
                    <CalendarItemEmpty key={id} />
                  </CalendarItemDayContainer>
                );
              }

              const activeRange = activeDateRanges?.find(
                ({ startId, endId }) => {
                  // Regular range
                  if (startId && endId) {
                    return id >= startId && id <= endId;
                  } else if (startId) {
                    return id === startId;
                  } else if (endId) {
                    return id === endId;
                  }
                  return false;
                }
              );

              const isRangeValid =
                activeRange &&
                activeRange.startId !== undefined &&
                activeRange.endId !== undefined;

              const isEndOfRange = id === activeRange?.endId;

              return (
                <CalendarItemDayContainer
                  key={id}
                  shouldShowActiveDayFiller={
                    isRangeValid && !isEndOfWeek && !isEndOfRange
                  }
                  isStartOfWeek={isStartOfWeek}
                >
                  <CalendarItemDay
                    id={id}
                    isEndOfRange={id === activeRange?.endId || !isRangeValid}
                    isStartOfRange={
                      id === activeRange?.startId || !isRangeValid
                    }
                    onPress={(_id) => onDayPress(_id, date)}
                    state={
                      activeRange
                        ? "active"
                        : disabledDates?.includes(id)
                        ? "disabled"
                        : isToday
                        ? "today"
                        : "idle"
                    }
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
