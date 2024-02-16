import {
  add,
  differenceInMonths,
  getWeeksInMonth,
  startOfMonth,
  sub,
} from "date-fns";
import { useCallback, useMemo, useState } from "react";

import { CalendarProps } from "@/components/Calendar";
import { fromDateId, toDateId } from "@/helpers/dates";
import { UseCalendarParams } from "@/hooks/useCalendar";

export type CalendarMonth = {
  id: string;
  date: Date;
  numberOfWeeks: number;
};

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
      numberOfWeeks: getWeeksInMonth(startingMonth, {
        weekStartsOn: firstDayOfWeek === "sunday" ? 0 : 1,
      }),
    },
  ];

  if (startingMonthId === endingMonthId) {
    return months;
  }

  const numberOfMonths = differenceInMonths(endingMonth, startingMonth);

  for (let i = 1; i <= numberOfMonths; i++) {
    const month = add(startingMonth, { months: i });
    const numberOfWeeks = getWeeksInMonth(month, {
      weekStartsOn: firstDayOfWeek === "sunday" ? 0 : 1,
    });

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
   * @default today
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
  const { initialMonth, initialMonthId } = useMemo(() => {
    const baseDate = calendarInitialMonthId
      ? fromDateId(calendarInitialMonthId)
      : fromDateId(toDateId(new Date()));
    const baseStartOfMonth = startOfMonth(baseDate);

    return {
      initialMonth: baseStartOfMonth,
      initialMonthId: toDateId(baseStartOfMonth),
    };
  }, [calendarInitialMonthId]);

  const [monthList, setMonthList] = useState<CalendarMonth[]>(() => {
    const currentMonth = startOfMonth(initialMonth);

    const startingMonth = calendarMinDateId
      ? fromDateId(calendarMinDateId)
      : sub(currentMonth, { months: calendarPastScrollRangeInMonths });

    const endingMonth = calendarMaxDateId
      ? fromDateId(calendarMaxDateId)
      : add(currentMonth, { months: calendarFutureScrollRangeInMonths });

    return buildMonthList(startingMonth, endingMonth, calendarFirstDayOfWeek);
  });

  /**
   * Append new months to the list.
   */
  const appendMonths = useCallback(
    (numberOfMonths: number) => {
      // Last month + 1
      const startingMonth = add(monthList[monthList.length - 1].date, {
        months: 1,
      });

      const endingMonth = calendarMaxDateId
        ? fromDateId(calendarMaxDateId)
        : add(startingMonth, { months: numberOfMonths - 1 });

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
      const endingMonth = sub(monthList[0].date, { months: 1 });

      const startingMonth = calendarMinDateId
        ? fromDateId(calendarMinDateId)
        : sub(endingMonth, { months: numberOfMonths - 1 });

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
        return appendMonths(differenceInMonths(targetMonthId, lastMonth.id));
      } else {
        return prependMonths(differenceInMonths(firstMonth.id, targetMonthId));
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
