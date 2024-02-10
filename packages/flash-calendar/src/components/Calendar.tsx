import { memo } from "react";

import {
  CalendarItemDay,
  CalendarItemEmpty,
} from "@/components/CalendarItemDay";
import { CalendarItemWeekName } from "@/components/CalendarItemWeekName";
import { CalendarRowMonth } from "@/components/CalendarRowMonth";
import { CalendarRowWeek } from "@/components/CalendarRowWeek";
import { VStack } from "@/components/VStack";
import { uppercaseFirstLetter } from "@/helpers/strings";
import { BuildCalendarParams, useCalendar } from "@/hooks/useCalendar";

export interface CalendarProps extends BuildCalendarParams {
  onDayPress: (dateId: string, date: Date) => void;
  disabledDates?: string[];
  activeDateRanges?: { startId?: string; endId?: string }[];
}

export const CALENDAR_ELEMENTS_SPACING = 8;

export const Calendar = memo(
  ({
    onDayPress,
    disabledDates,
    activeDateRanges,
    ...buildCalendarParams
  }: CalendarProps) => {
    const { calendarRowMonth, weeksList, weekDaysList } =
      useCalendar(buildCalendarParams);

    return (
      <VStack alignItems="center" spacing={CALENDAR_ELEMENTS_SPACING}>
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
                isStartOfMonth,
                ...otherProps
              } = dayProps;
              if (isDifferentMonth) {
                return <CalendarItemEmpty {...otherProps} key={id} />;
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

              const isIncompleteRange =
                activeRange &&
                (activeRange.endId === undefined ||
                  activeRange.startId === undefined);

              return (
                <CalendarItemDay
                  id={id}
                  {...otherProps}
                  hideActiveDayFiller={isIncompleteRange ? true : undefined}
                  isEndOfRange={id === activeRange?.endId}
                  isStartOfMonth={isStartOfMonth}
                  isStartOfRange={id === activeRange?.startId}
                  key={id}
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
              );
            })}
          </CalendarRowWeek>
        ))}
      </VStack>
    );
  }
);
