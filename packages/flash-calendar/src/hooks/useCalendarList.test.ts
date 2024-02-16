import { act, renderHook } from "@testing-library/react-hooks";
import { describe, it, expect } from "bun:test";

import { fromDateId } from "@/helpers/dates";
import { getHeightForMonth, useCalendarList } from "@/hooks/useCalendarList";

describe("getHeightForMonth", () => {
  it("Measures months with 5 weeks (no calendar spacing)", () => {
    const calendarMonthHeaderHeight = 50;
    const calendarRowVerticalSpacing = 5;
    const calendarWeekHeaderHeight = 30;
    const calendarDayHeight = 20;
    const calendarSpacing = 0;
    const calendarAdditionalHeight = 0;

    expect(
      getHeightForMonth({
        calendarDayHeight,
        calendarAdditionalHeight,
        calendarMonthHeaderHeight,
        calendarRowVerticalSpacing,
        calendarWeekHeaderHeight,
        calendarSpacing,
        calendarMonth: {
          id: "some",
          date: new Date(),
          numberOfWeeks: 5,
        },
      })
    ).toBe(210);
  });

  it("Measures months with 5 weeks (with calendar spacing)", () => {
    const calendarMonthHeaderHeight = 50;
    const calendarRowVerticalSpacing = 5;
    const calendarWeekHeaderHeight = 30;
    const calendarDayHeight = 20;
    const calendarSpacing = 99;
    const calendarAdditionalHeight = 0;

    expect(
      getHeightForMonth({
        calendarDayHeight,
        calendarAdditionalHeight,
        calendarMonthHeaderHeight,
        calendarRowVerticalSpacing,
        calendarWeekHeaderHeight,
        calendarSpacing,
        calendarMonth: {
          id: "some",
          date: new Date(),
          numberOfWeeks: 5,
        },
      })
    ).toBe(309);
  });

  it("Accounts for additional height", () => {
    const calendarMonthHeaderHeight = 50;
    const calendarRowVerticalSpacing = 5;
    const calendarWeekHeaderHeight = 30;
    const calendarDayHeight = 20;
    const calendarSpacing = 0;
    const calendarAdditionalHeight = 24;

    expect(
      getHeightForMonth({
        calendarDayHeight,
        calendarAdditionalHeight,
        calendarMonthHeaderHeight,
        calendarRowVerticalSpacing,
        calendarWeekHeaderHeight,
        calendarSpacing,
        calendarMonth: {
          id: "some",
          date: new Date(),
          numberOfWeeks: 5,
        },
      })
    ).toBe(234);
  });

  it("Measures months with 6 weeks", () => {
    const calendarMonthHeaderHeight = 50;
    const calendarRowVerticalSpacing = 5;
    const calendarWeekHeaderHeight = 30;
    const calendarDayHeight = 20;
    const calendarSpacing = 0;
    const calendarAdditionalHeight = 0;

    expect(
      getHeightForMonth({
        calendarDayHeight,
        calendarAdditionalHeight,
        calendarMonthHeaderHeight,
        calendarRowVerticalSpacing,
        calendarWeekHeaderHeight,
        calendarSpacing,
        calendarMonth: {
          id: "some",
          date: new Date(),
          numberOfWeeks: 6,
        },
      })
    ).toBe(235);
  });

  it("February 24 has the right height with base options", () => {
    // {"calendarAdditionalHeight": 0, "calendarDayHeight": 32, "calendarMonthHeaderHeight": 20, "calendarRowVerticalSpacing": 8, "calendarSpacing": 20, "calendarWeekHeaderHeight": 32}
    const calendarMonthHeaderHeight = 20;
    const calendarRowVerticalSpacing = 8;
    const calendarWeekHeaderHeight = 32;
    const calendarDayHeight = 32;
    const calendarSpacing = 20;
    const calendarAdditionalHeight = 0;

    expect(
      getHeightForMonth({
        calendarDayHeight,
        calendarAdditionalHeight,
        calendarMonthHeaderHeight,
        calendarRowVerticalSpacing,
        calendarWeekHeaderHeight,
        calendarSpacing,
        calendarMonth: {
          id: "some",
          date: fromDateId("2024-02-01"),
          numberOfWeeks: 5,
        },
      })
    ).toBe(280);
  });
});

describe("useCalendarList", () => {
  describe("Min/Max dates", () => {
    it("Returns a single month when min and max are in the same month", () => {
      const { result } = renderHook(() =>
        useCalendarList({
          calendarFirstDayOfWeek: "sunday",
          calendarFutureScrollRangeInMonths: 12,
          calendarPastScrollRangeInMonths: 12,
          calendarMinDateId: "2024-01-01",
          calendarMaxDateId: "2024-01-31",
        })
      );

      expect(result.current.monthList).toHaveLength(1);
      const [january] = result.current.monthList;
      expect(january.numberOfWeeks).toBe(5);
      expect(january.id).toBe("2024-01-01");
    });

    it("Returns a range of months bounded by the min and max dates", () => {
      const { result } = renderHook(() =>
        useCalendarList({
          calendarFirstDayOfWeek: "sunday",
          calendarFutureScrollRangeInMonths: 12,
          calendarPastScrollRangeInMonths: 12,
          calendarInitialMonthId: "2024-03-01",
          calendarMinDateId: "2024-01-01",
          calendarMaxDateId: "2024-07-15",
        })
      );

      expect(result.current.monthList).toHaveLength(7);
      const [january, february, march, april, may, jun, jul] =
        result.current.monthList;

      expect(january.numberOfWeeks).toBe(5);
      expect(january.id).toBe("2024-01-01");

      expect(february.numberOfWeeks).toBe(5);
      expect(february.id).toBe("2024-02-01");

      expect(march.numberOfWeeks).toBe(6);
      expect(march.id).toBe("2024-03-01");

      expect(april.numberOfWeeks).toBe(5);
      expect(april.id).toBe("2024-04-01");

      expect(may.numberOfWeeks).toBe(5);
      expect(may.id).toBe("2024-05-01");

      expect(jun.numberOfWeeks).toBe(6);
      expect(jun.id).toBe("2024-06-01");

      // Although half of July is outside the max date, it's still included
      expect(jul.numberOfWeeks).toBe(5);
      expect(jul.id).toBe("2024-07-01");
    });

    it("Ignores past/future scroll ranges when min/max dates are used", () => {
      const { result } = renderHook(() =>
        useCalendarList({
          calendarFirstDayOfWeek: "sunday",
          calendarFutureScrollRangeInMonths: 90,
          calendarPastScrollRangeInMonths: 90,
          calendarInitialMonthId: "2024-03-01",
          calendarMinDateId: "2024-01-01",
          calendarMaxDateId: "2024-03-03",
        })
      );
      expect(result.current.monthList).toHaveLength(3);
      expect(result.current.monthList[0].id).toBe("2024-01-01");
      expect(result.current.monthList[2].id).toBe("2024-03-01");
    });

    it("Append/Prepend are no-op if min/max are reached", () => {
      const { result } = renderHook(() =>
        useCalendarList({
          calendarFirstDayOfWeek: "sunday",
          calendarFutureScrollRangeInMonths: 12,
          calendarPastScrollRangeInMonths: 12,
          calendarInitialMonthId: "2024-09-01",
          calendarMinDateId: "2024-01-01",
          calendarMaxDateId: "2024-12-31",
        })
      );

      const currentMonthList = result.current.monthList;
      expect(currentMonthList).toHaveLength(12);

      // Appending is a no-op
      act(() => {
        result.current.appendMonths(12);
      });
      expect(result.current.monthList).toEqual(currentMonthList);

      // Prepending is a no-op
      act(() => {
        result.current.prependMonths(12);
      });
      expect(result.current.monthList).toEqual(currentMonthList);
    });
  });

  it("Data is correctly built when future/past ranges are 0", () => {
    const { result } = renderHook(() =>
      useCalendarList({
        calendarFirstDayOfWeek: "sunday",
        calendarFutureScrollRangeInMonths: 0,
        calendarPastScrollRangeInMonths: 0,
      })
    );

    const currentMonthList = result.current.monthList;
    expect(currentMonthList).toHaveLength(1);
  });
});
