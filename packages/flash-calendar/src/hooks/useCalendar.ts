import {
  addDays,
  endOfMonth,
  format,
  startOfMonth,
  startOfWeek,
  sub,
} from "date-fns";
import { useMemo } from "react";

import { DayState } from "@/components/CalendarItemDay";
import { toDateId } from "@/helpers/dates";
import { range } from "@/helpers/numbers";

const getNumberOfEmptyCellsAtStart = (
  month: Date,
  firstDayOfWeek: "sunday" | "monday"
) => {
  const startOfMonthDay = month.getDay();

  if (firstDayOfWeek === "sunday") {
    return startOfMonthDay;
  }

  return startOfMonthDay === 0 ? 6 : startOfMonthDay - 1;
};

export type DayShape = {
  date: Date;
  /** The day displayed in the desired format from `calendarItemDayFormat` */
  displayLabel: string;
  isDifferentMonth: boolean;
  isEndOfMonth: boolean;
  isEndOfWeek: boolean;
  isStartOfMonth: boolean;
  isStartOfWeek: boolean;
  isToday: boolean;

  // Range related
  isStartOfRange: boolean;
  isEndOfRange: boolean;
  state?: DayState;
  isRangeValid: boolean;

  /** The ID of this date is the `YYYY-MM-DD` representation */
  id: string;
};

export type BuildCalendarParams = {
  /** The desired month for this calendar. It can be any date within the month.
   * The function normalizes the value. */
  calendarMonth: Date;
  /**
   * Which `date-fns` token to format the calendar header.
   * @default "MMMM yyyy" e.g. "January 2022"
   */
  calendarRowMonthFormat?: string;
  /**
   * Which `date-fns` token to format the week name.
   * @default "EEEEE" e.g. "S"
   */
  calendarItemWeekNameFormat?: string;
  /**
   * Which `date-fns` token to format the day.
   * @default "d" e.g. "1"
   */
  calendarItemDayFormat?: string;
  /**
   * The day of the week to start the calendar with.
   * @default "sunday"
   */
  calendarFirstDayOfWeek?: "sunday" | "monday";
  /**
   * The active date ranges to highlight in the calendar.
   */
  calendarActiveDateRanges?: { startId?: string; endId?: string }[];
};

const getRangeState = (
  id: string,
  activeDateRanges: BuildCalendarParams["calendarActiveDateRanges"]
) => {
  const activeRange = activeDateRanges?.find(({ startId, endId }) => {
    // Regular range
    if (startId && endId) {
      return id >= startId && id <= endId;
    } else if (startId) {
      return id === startId;
    } else if (endId) {
      return id === endId;
    }
    return false;
  });

  const isRangeValid =
    activeRange &&
    activeRange.startId !== undefined &&
    activeRange.endId !== undefined;

  return {
    isStartOfRange: id === activeRange?.startId,
    isEndOfRange: id === activeRange?.endId,
    isRangeValid: isRangeValid ?? false,
    state: activeRange ? ("active" as const) : undefined,
  };
};

/**
 * Builds a calendar based on the given parameters.
 */
export const buildCalendar = ({
  calendarMonth: month,
  calendarFirstDayOfWeek = "sunday",
  calendarRowMonthFormat = "MMMM yyyy",
  calendarItemWeekNameFormat = "EEEEE",
  calendarItemDayFormat = "d",
  calendarActiveDateRanges,
}: BuildCalendarParams) => {
  const monthStart = startOfMonth(month);
  const monthStartId = toDateId(monthStart);
  const monthEnd = endOfMonth(month);
  const monthEndId = toDateId(monthEnd);

  const emptyDaysAtStart = getNumberOfEmptyCellsAtStart(
    monthStart,
    calendarFirstDayOfWeek
  );

  const startOfWeekIndex = calendarFirstDayOfWeek === "sunday" ? 0 : 1;
  const today = toDateId(new Date());

  // The first day to iterate is the first day of the month minus the empty days at the start
  let dayToIterate = sub(monthStart, { days: emptyDaysAtStart });

  const weeksList: DayShape[][] = [
    [
      ...range(1, emptyDaysAtStart).map((): DayShape => {
        const id = toDateId(dayToIterate);
        const dayShape: DayShape = {
          date: dayToIterate,
          displayLabel: format(dayToIterate, calendarItemDayFormat),
          id,
          isDifferentMonth: true,
          isEndOfMonth: false,
          isEndOfWeek: dayToIterate.getDay() === 6,
          isStartOfMonth: false,
          isStartOfWeek: dayToIterate.getDay() === startOfWeekIndex,
          isToday: id === today,
          ...getRangeState(id, calendarActiveDateRanges),
        };
        dayToIterate = addDays(dayToIterate, 1);
        return dayShape;
      }),
    ],
  ];

  // By this point, we're back at the start of the month
  while (dayToIterate.getMonth() === monthStart.getMonth()) {
    const currentWeek = weeksList[weeksList.length - 1];
    if (currentWeek.length === 7) {
      weeksList.push([]);
    }
    const id = toDateId(dayToIterate);
    weeksList[weeksList.length - 1].push({
      date: dayToIterate,
      displayLabel: format(dayToIterate, calendarItemDayFormat),
      id,
      isDifferentMonth: false,
      isEndOfWeek: dayToIterate.getDay() === 6,
      isStartOfWeek: dayToIterate.getDay() === startOfWeekIndex,
      isToday: id === today,
      isStartOfMonth: id === monthStartId,
      isEndOfMonth: id === monthEndId,
      ...getRangeState(id, calendarActiveDateRanges),
    });
    dayToIterate = addDays(dayToIterate, 1);
  }

  // Once all the days of the month have been added, we need to add the empty days at the end
  const lastWeek = weeksList[weeksList.length - 1];
  const emptyDaysAtEnd = 7 - lastWeek.length;
  lastWeek.push(
    ...range(1, emptyDaysAtEnd).map(() => {
      const id = toDateId(dayToIterate);
      const dayShape: DayShape = {
        date: dayToIterate,
        displayLabel: format(dayToIterate, calendarItemDayFormat),
        id,
        isDifferentMonth: true,
        isEndOfMonth: false,
        isEndOfWeek: dayToIterate.getDay() === 6,
        isStartOfMonth: false,
        isStartOfWeek: dayToIterate.getDay() === startOfWeekIndex,
        isToday: id === today,
        ...getRangeState(id, calendarActiveDateRanges),
      };
      dayToIterate = addDays(dayToIterate, 1);
      return dayShape;
    })
  );

  const startOfWeekDate = startOfWeek(month, {
    weekStartsOn: calendarFirstDayOfWeek === "sunday" ? 0 : 1,
  });
  const weekDaysList = range(1, 7).map((i) =>
    format(addDays(startOfWeekDate, i - 1), calendarItemWeekNameFormat)
  );

  return {
    weeksList,
    calendarRowMonth: format(month, calendarRowMonthFormat),
    weekDaysList,
  };
};

/**
 * Returns a memoized calendar based on the given parameters.
 */
export const useCalendar = (buildCalendarParams: BuildCalendarParams) =>
  useMemo(() => buildCalendar(buildCalendarParams), [buildCalendarParams]);
