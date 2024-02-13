import {
  addDays,
  endOfMonth,
  format,
  isWeekend,
  startOfMonth,
  startOfWeek,
  sub,
} from "date-fns";
import { useMemo } from "react";

import { DayState } from "@/components/CalendarItemDay";
import { fromDateId, toDateId } from "@/helpers/dates";
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

/**
 * The type of each day in the calendar. Has a few pre-computed properties to
 * help increase re-rendering performance.
 */
export type DayShape = {
  date: Date;
  /** The day displayed in the desired format from `calendarItemDayFormat` */
  displayLabel: string;
  /** Does this day belong to a different month? */
  isDifferentMonth: boolean;
  /** Is this the last day of the month? */
  isEndOfMonth: boolean;
  /** Is this the last day of the week? */
  isEndOfWeek: boolean;
  /** Is this the first day of the month? */
  isStartOfMonth: boolean;
  /** Is this the first day of the week? */
  isStartOfWeek: boolean;
  /** Is this day part of the weekend? */
  isWeekend: boolean;
  /** Is this the current day? */
  isToday: boolean;

  // Range related
  /** Is this the start of a range? */
  isStartOfRange: boolean;
  /**  Is this the end of a range? */
  isEndOfRange: boolean;
  /** The state of the day */
  state: DayState;
  /** Is the range valid (has both start and end dates set)? */
  isRangeValid: boolean;
  /** The ID of this date is the `YYYY-MM-DD` representation */
  id: string;
};

export type BuildCalendarParams = {
  /**
   * The calendar's month. It can be any date within the month, since it gets
   * normalized to the first day of the month.
   *
   * **Tip**: To convert to date ID, use `toDateId(date)`.
   */
  calendarMonthId: string;
  /**
   * The minimum date allowed to be selected (inclusive). Dates earlier than
   * this will be disabled.
   *
   * **Tip**: To convert to date ID, use `toDateId(date)`.
   */
  calendarMinDateId?: string;
  /**
   * The maximum date allowed to be selected (inclusive). Dates later than this
   * will be disabled.
   *
   * **Tip**: To convert to date ID, use `toDateId(date)`.
   */
  calendarMaxDateId?: string;

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
  {
    calendarActiveDateRanges,
    calendarMinDateId,
    calendarMaxDateId,
  }: BuildCalendarParams
) => {
  const activeRange = calendarActiveDateRanges?.find(({ startId, endId }) => {
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

  let state: DayState = activeRange ? ("active" as const) : "idle";

  if (
    (calendarMinDateId && id < calendarMinDateId) ||
    (calendarMaxDateId && id > calendarMaxDateId)
  ) {
    state = "disabled";
  }

  return {
    isStartOfRange: id === activeRange?.startId,
    isEndOfRange: id === activeRange?.endId,
    isRangeValid: isRangeValid ?? false,
    state,
  };
};

/**
 * Builds a calendar based on the given parameters.
 */
export const buildCalendar = (params: BuildCalendarParams) => {
  const {
    calendarMonthId: monthId,
    calendarFirstDayOfWeek = "sunday",
    calendarRowMonthFormat = "MMMM yyyy",
    calendarItemWeekNameFormat = "EEEEE",
    calendarItemDayFormat = "d",
  } = params;

  const month = fromDateId(monthId);
  const monthStart = startOfMonth(month);
  const monthStartId = toDateId(monthStart);
  const monthEnd = endOfMonth(month);
  const monthEndId = toDateId(monthEnd);

  const emptyDaysAtStart = getNumberOfEmptyCellsAtStart(
    monthStart,
    calendarFirstDayOfWeek
  );

  const startOfWeekIndex = calendarFirstDayOfWeek === "sunday" ? 0 : 1;
  const endOfWeekIndex = calendarFirstDayOfWeek === "sunday" ? 6 : 0;
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
          isEndOfWeek: dayToIterate.getDay() === endOfWeekIndex,
          isStartOfMonth: false,
          isStartOfWeek: dayToIterate.getDay() === startOfWeekIndex,
          isToday: id === today,
          isWeekend: isWeekend(dayToIterate),
          ...getRangeState(id, params),
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
      isEndOfMonth: id === monthEndId,
      isEndOfWeek: dayToIterate.getDay() === endOfWeekIndex,
      isStartOfMonth: id === monthStartId,
      isStartOfWeek: dayToIterate.getDay() === startOfWeekIndex,
      isToday: id === today,
      isWeekend: isWeekend(dayToIterate),
      ...getRangeState(id, params),
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
        isEndOfWeek: dayToIterate.getDay() === endOfWeekIndex,
        isStartOfMonth: false,
        isStartOfWeek: dayToIterate.getDay() === startOfWeekIndex,
        isToday: id === today,
        isWeekend: isWeekend(dayToIterate),
        ...getRangeState(id, params),
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
