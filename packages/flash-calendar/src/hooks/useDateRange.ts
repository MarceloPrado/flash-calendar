import { useCallback, useMemo, useState } from "react";

import type { CalendarOnDayPress } from "@/components";
import type { CalendarActiveDateRange } from "@/hooks/useCalendar";

/**
 * A convenience hook to simplify managing a date range in the calendar in a
 * performant way.
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
      setDateRange((prev) => {
        // Starting the first range
        if (!prev.startId && !prev.endId) {
          return {
            startId: dateId,
            endId: undefined,
          };
        } else if (prev.startId && prev.endId) {
          // Starting a new range
          return {
            startId: dateId,
            endId: undefined,
          };
        } else if (prev.startId && !prev.endId) {
          if (dateId < prev.startId) {
            return {
              startId: dateId,
              endId: prev.startId,
            };
          } else {
            return {
              ...prev,
              endId: dateId,
            };
          }
        }
        return {
          startId: dateId,
          endId: dateId,
        };
      });
    },
    []
  );

  const onClearDateRange = useCallback(() => {
    setDateRange({
      startId: undefined,
      endId: undefined,
    });
  }, []);

  return useMemo(() => {
    const calendarActiveDateRanges =
      !dateRange.startId && !dateRange.endId ? [] : [dateRange];
    const isDateRangeValid = !!(dateRange.startId && dateRange.endId);

    return {
      /**
       * The current date range.
       **/
      dateRange,
      /**
       * Derived from the current date range as a convenience when passing to
       * the `<Calendar.List />` component.
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
  }, [dateRange, onCalendarDayPress, onClearDateRange]);
};
