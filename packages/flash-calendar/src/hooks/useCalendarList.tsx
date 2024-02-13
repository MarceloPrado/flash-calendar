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

export type MonthShape = { id: string; date: Date; numberOfWeeks: number };

export const buildMonthList = (
  startingMonth: Date,
  numberOfMonths: number,
  firstDayOfWeek: CalendarProps["calendarFirstDayOfWeek"] = "sunday"
): MonthShape[] => {
  const months = [
    {
      id: toDateId(startingMonth),
      date: startingMonth,
      numberOfWeeks: getWeeksInMonth(startingMonth, {
        weekStartsOn: firstDayOfWeek === "sunday" ? 0 : 1,
      }),
    },
  ];

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

type UseCalendarListParams = {
  /**
   * The initial month to open the calendar to, as a `YYYY-MM-DD` string.
   * @default today
   */
  calendarInitialMonthId?: string;
  calendarPastScrollRangeInMonths: number;
  calendarFutureScrollRangeInMonths: number;
  calendarFirstDayOfWeek: "monday" | "sunday";
};

export const useCalendarList = ({
  calendarInitialMonthId,
  calendarPastScrollRangeInMonths,
  calendarFutureScrollRangeInMonths,
  calendarFirstDayOfWeek,
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

  const [monthList, setMonthList] = useState<MonthShape[]>(() => {
    const currentMonth = startOfMonth(initialMonth);
    const startingMonth = sub(currentMonth, {
      months: calendarPastScrollRangeInMonths,
    });

    return buildMonthList(
      startingMonth,
      calendarPastScrollRangeInMonths + calendarFutureScrollRangeInMonths,
      calendarFirstDayOfWeek
    );
  });

  /**
   * Append new months to the list.
   */
  const appendMonths = useCallback(
    (numberOfMonths: number) => {
      const lastMonth = monthList[monthList.length - 1].date;
      const [_duplicateLastMonth, ...newMonths] = buildMonthList(
        lastMonth,
        numberOfMonths,
        calendarFirstDayOfWeek
      );
      const newMonthList = [...monthList, ...newMonths];
      setMonthList(newMonthList);
      return newMonthList;
    },
    [calendarFirstDayOfWeek, monthList]
  );

  const prependMonths = useCallback(
    (numberOfMonths: number) => {
      const firstMonth = monthList[0].date;
      const newMonths = buildMonthList(
        sub(firstMonth, { months: numberOfMonths + 1 }),
        numberOfMonths,
        calendarFirstDayOfWeek
      );
      const newMonthList = [...newMonths, ...monthList];
      setMonthList(newMonthList);
      return newMonthList;
    },
    [calendarFirstDayOfWeek, monthList]
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
  calendarRowVerticalSpacing,
  calendarDayHeight,
  calendarWeekHeaderHeight,
  calendarMonthHeaderHeight,
  month,
  spacing,
}: {
  month: MonthShape;
  spacing: number;
  calendarMonthHeaderHeight: number;
  calendarRowVerticalSpacing: number;
  calendarDayHeight: number;
  calendarWeekHeaderHeight: number;
}) => {
  const headerHeight =
    calendarMonthHeaderHeight +
    calendarRowVerticalSpacing +
    calendarWeekHeaderHeight;

  const weekHeight = calendarDayHeight + calendarRowVerticalSpacing;

  return headerHeight + month.numberOfWeeks * weekHeight + spacing;
};
