import { useCallback, useMemo, useState } from "react";

import type { CalendarOnDayPress } from "@/components";
import type { CalendarActiveDateRange } from "@/hooks/useCalendar";

/**
 * A convenience hook to simplify managing a date range in the calendar.
 */
export const useDateRange = (
  initialDateRange: CalendarActiveDateRange = {
    startId: undefined,
    endId: undefined,
  }
) => {
  const [dateRange, setDateRange] =
    useState<CalendarActiveDateRange>(initialDateRange);

  const onCalendarDayPress = useCallback<CalendarOnDayPress>(
    (dateId: string) => {
      // Starting the first range
      if (!dateRange.startId && !dateRange.endId) {
        setDateRange({
          startId: dateId,
          endId: undefined,
        });
      } else if (dateRange.startId && dateRange.endId) {
        // Starting a new range
        setDateRange({
          startId: dateId,
          endId: undefined,
        });
      } else if (dateRange.startId && !dateRange.endId) {
        if (dateId < dateRange.startId) {
          setDateRange({
            startId: dateId,
            endId: dateRange.startId,
          });
        } else {
          setDateRange({
            ...dateRange,
            endId: dateId,
          });
        }
      }
    },
    [dateRange]
  );

  const onClearDateRange = useCallback(() => {
    setDateRange({
      startId: undefined,
      endId: undefined,
    });
  }, []);

  const isDateRangeValid = !!(dateRange.startId && dateRange.endId);

  const calendarActiveDateRanges = useMemo<CalendarActiveDateRange[]>(() => {
    if (!dateRange.startId && !dateRange.endId) return [];

    return [dateRange];
  }, [dateRange]);

  return {
    /**
     * The current date range.
     *
     * When passing to `<Calendar.List />`, use `calendarActiveDateRanges` for
     * greater convenience and performance.
     **/
    dateRange,
    /**
     * The active date ranges to pass to the `<Calendar.List />` component.
     */
    calendarActiveDateRanges,
    /**
     * Clears the current date range.
     */
    onClearDateRange,
    /**
     * Callback to pass to the `<Calendar.List />` component to handle date
     * range.
     */
    onCalendarDayPress,
    /**
     * Whether the current date range is valid (e.g. has both start and end
     * dates)
     */
    isDateRangeValid,
  };
};
