import { useCallback, useMemo, useState } from "react";

import type { CalendarProps } from "@/components/Calendar";
import {
  fromDateId,
  toDateId,
  startOfMonth,
  addMonths,
  subMonths,
  differenceInMonths,
  getWeeksInMonth,
} from "@/helpers/dates";
import type { UseCalendarParams } from "@/hooks/useCalendar";
import { pipe } from "@/helpers/functions";

export interface CalendarMonth {
  id: string;
  date: Date;
  numberOfWeeks: number;
}

const buildMonthList = (
  startingMonth: Date,
  endingMonth: Date,
  firstDayOfWeek: CalendarProps["calendarFirstDayOfWeek"] = "sunday"
): CalendarMonth[] => {
  const startingMonthId = toDateId(startingMonth);
  const endingMonthId = toDateId(endingMonth);

  if (endingMonthId < startingMonthId) {
    return [];
  }

  const months = [
    {
      id: toDateId(startingMonth),
      date: startingMonth,
      numberOfWeeks: getWeeksInMonth(startingMonth, firstDayOfWeek),
    },
  ];

  if (startingMonthId === endingMonthId) {
    return months;
  }

  const numberOfMonths = differenceInMonths(endingMonth, startingMonth);

  for (let i = 1; i <= numberOfMonths; i++) {
    const month = addMonths(startingMonth, i);
    const numberOfWeeks = getWeeksInMonth(month, firstDayOfWeek);

    months.push({
      id: toDateId(month),
      date: month,
      numberOfWeeks,
    });
  }
  return months;
};

export interface UseCalendarListParams
  extends Pick<UseCalendarParams, "calendarMinDateId" | "calendarMaxDateId"> {
  /**
   * The initial month to open the calendar to, as a `YYYY-MM-DD` string.
   * @defaultValue today
   */
  calendarInitialMonthId?: string;
  /**
   * How many months to show before the current month. Only applicable if
   * `calendarMinDateId` is not set.
   */
  calendarPastScrollRangeInMonths: number;
  /**
   * How many months to show after the current month. Applicable if
   * `calendarMaxDateId` is not set.
   */
  calendarFutureScrollRangeInMonths: number;
  calendarFirstDayOfWeek: "monday" | "sunday";
}

const getEndingMonth = (
  calendarFutureScrollRange: number,
  calendarMaxDateId: string | undefined,
  baseDate: Date
) => {
  const endingMonthFromRange = addMonths(baseDate, calendarFutureScrollRange);
  const newEndingMonthId = toDateId(endingMonthFromRange);
  const safeMaxDateId = calendarMaxDateId ?? newEndingMonthId;

  // We've exceeded the max date
  return newEndingMonthId > safeMaxDateId
    ? fromDateId(safeMaxDateId)
    : endingMonthFromRange;
};

const getStartingMonth = (
  calendarPastScrollRange: number,
  calendarMinDateId: string | undefined,
  baseDate: Date
) => {
  const startingMonthFromRange = subMonths(baseDate, calendarPastScrollRange);
  const newStartingMonthId = toDateId(startingMonthFromRange);
  const safeMinDateId = calendarMinDateId ?? newStartingMonthId;

  // We've exceeded the min date.
  return safeMinDateId > newStartingMonthId
    ? // Normalize to start of month since each month ID is represented by the first day of month
      pipe(fromDateId(safeMinDateId), startOfMonth)
    : startingMonthFromRange;
};

/**
 * Returns a list of months to display in the calendar, and methods to append
 * and prepend months to the list.
 */
export const useCalendarList = ({
  calendarInitialMonthId,
  calendarPastScrollRangeInMonths,
  calendarFutureScrollRangeInMonths,
  calendarFirstDayOfWeek,
  calendarMaxDateId,
  calendarMinDateId,
}: UseCalendarListParams) => {
  // Initialize key values
  const { initialMonth, initialMonthId } = useMemo(() => {
    const baseDate = calendarInitialMonthId
      ? fromDateId(calendarInitialMonthId)
      : fromDateId(toDateId(new Date()));

    // Normalize to start of month since each month ID is represented by the first day of month
    const baseStartOfMonth = startOfMonth(baseDate);

    return {
      initialMonth: baseStartOfMonth,
      initialMonthId: toDateId(baseStartOfMonth),
    };
  }, [calendarInitialMonthId]);

  const [monthList, setMonthList] = useState<CalendarMonth[]>(() => {
    const currentMonth = startOfMonth(initialMonth);

    const startingMonth = getStartingMonth(
      calendarPastScrollRangeInMonths,
      calendarMinDateId,
      currentMonth
    );

    const endingMonth = getEndingMonth(
      calendarFutureScrollRangeInMonths,
      calendarMaxDateId,
      currentMonth
    );

    return buildMonthList(startingMonth, endingMonth, calendarFirstDayOfWeek);
  });

  /**
   * Append new months to the list.
   */
  const appendMonths = useCallback(
    (numberOfMonths: number) => {
      // Last month + 1
      const startingMonth = addMonths(monthList[monthList.length - 1].date, 1);

      const endingMonth = getEndingMonth(
        Math.max(numberOfMonths - 1, 0),
        calendarMaxDateId,
        startingMonth
      );

      const newMonths = buildMonthList(
        startingMonth,
        endingMonth,
        calendarFirstDayOfWeek
      );

      const newMonthList = [...monthList, ...newMonths];
      setMonthList(newMonthList);
      return newMonthList;
    },
    [calendarFirstDayOfWeek, calendarMaxDateId, monthList]
  );

  const prependMonths = useCallback(
    (numberOfMonths: number) => {
      const endingMonth = subMonths(monthList[0].date, 1);

      const startingMonth = getStartingMonth(
        Math.max(numberOfMonths - 1, 0),
        calendarMinDateId,
        endingMonth
      );

      const newMonths = buildMonthList(
        startingMonth,
        endingMonth,
        calendarFirstDayOfWeek
      );

      const newMonthList = [...newMonths, ...monthList];
      setMonthList(newMonthList);
      return newMonthList;
    },
    [calendarFirstDayOfWeek, calendarMinDateId, monthList]
  );

  const addMissingMonths = useCallback(
    (targetMonthId: string) => {
      const firstMonth = monthList[0];
      const lastMonth = monthList[monthList.length - 1];

      if (targetMonthId > lastMonth.id) {
        return appendMonths(
          differenceInMonths(fromDateId(targetMonthId), lastMonth.date)
        );
      } else {
        return prependMonths(
          differenceInMonths(firstMonth.date, fromDateId(targetMonthId))
        );
      }
    },
    [appendMonths, monthList, prependMonths]
  );

  const initialMonthIndex = useMemo(() => {
    const index = monthList.findIndex((i) => i.id === initialMonthId);
    return index;
  }, [initialMonthId, monthList]);

  return {
    /**
     * The list of months to display in the calendar.
     */
    monthList,
    /**
     * The index of the initial month in the list.
     */
    initialMonthIndex,
    /**
     * Appends new months to the list.
     */
    appendMonths,
    /**
     * Prepends new months to the list.
     */
    prependMonths,
    /**
     * Adds missing months to the list, so that the target month is included.
     */
    addMissingMonths,
  };
};

/**
 * Returns the absolute height for a month, accounting for the spacings and
 * headers.
 */
export const getHeightForMonth = ({
  calendarRowVerticalSpacing: vSpacing,
  calendarDayHeight: day,
  calendarWeekHeaderHeight: weekName,
  calendarMonthHeaderHeight: header,
  calendarAdditionalHeight: extraHeight,
  calendarMonth,
  calendarSpacing,
}: {
  calendarAdditionalHeight: number;
  calendarDayHeight: number;
  calendarMonthHeaderHeight: number;
  calendarRowVerticalSpacing: number;
  calendarWeekHeaderHeight: number;
  calendarMonth: CalendarMonth;
  calendarSpacing: number;
}) => {
  const headerHeight = header + vSpacing + weekName + vSpacing;
  const daysHeight =
    day * calendarMonth.numberOfWeeks +
    // The last week doesn't have a bottom spacing (not referring to `calendarSpacing`)
    (calendarMonth.numberOfWeeks - 1) * vSpacing;

  return headerHeight + daysHeight + extraHeight + calendarSpacing;
};
