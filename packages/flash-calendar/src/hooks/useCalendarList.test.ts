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
    it("Max: virtualization still works as expected", () => {
      const { result } = renderHook(() =>
        useCalendarList({
          calendarFirstDayOfWeek: "sunday",
          calendarFutureScrollRangeInMonths: 2,
          calendarPastScrollRangeInMonths: 2,
          calendarInitialMonthId: "2024-07-01",
          calendarMinDateId: "2024-01-01",
          calendarMaxDateId: "2024-12-31",
        })
      );

      // Initially, we render 5 months: the initial month +- 2
      expect(result.current.monthList).toHaveLength(5);
      const initialIds = [
        "2024-05-01",
        "2024-06-01",
        "2024-07-01",
        "2024-08-01",
        "2024-09-01",
      ];
      expect(result.current.monthList.map((m) => m.id)).toEqual(initialIds);

      // After we scroll to the end, we append 2 more months since we're not at the max date yet.
      act(() => {
        result.current.appendMonths(2);
      });
      expect(result.current.monthList).toHaveLength(7);
      expect(result.current.monthList.map((m) => m.id)).toEqual([
        ...initialIds,
        "2024-10-01",
        "2024-11-01",
      ]);

      // After we scroll to the end again, we append just another month since we're at the max date.
      act(() => {
        result.current.appendMonths(2); // no change here
      });

      expect(result.current.monthList).toHaveLength(8);

      const finalIds = [
        ...initialIds,
        "2024-10-01",
        "2024-11-01",
        "2024-12-01",
      ];
      expect(result.current.monthList.map((m) => m.id)).toEqual(finalIds);

      // If we try scrolling once more, it's a no-op
      act(() => {
        result.current.appendMonths(2);
      });
      expect(result.current.monthList.map((m) => m.id)).toEqual(finalIds);
    });

    it("Min: virtualization still works as expected", () => {
      const { result } = renderHook(() =>
        useCalendarList({
          calendarFirstDayOfWeek: "sunday",
          calendarFutureScrollRangeInMonths: 2,
          calendarPastScrollRangeInMonths: 2,
          calendarInitialMonthId: "2024-07-01",
          calendarMinDateId: "2024-01-01",
          calendarMaxDateId: "2024-12-31",
        })
      );

      // Initially, we render 5 months: the initial month +- 2
      expect(result.current.monthList).toHaveLength(5);
      const initialIds = [
        "2024-05-01",
        "2024-06-01",
        "2024-07-01",
        "2024-08-01",
        "2024-09-01",
      ];
      expect(result.current.monthList.map((m) => m.id)).toEqual(initialIds);

      // After we scroll to the beginning, we prepend 2 more months since we're not at the min date yet.
      act(() => {
        result.current.prependMonths(2);
      });
      expect(result.current.monthList).toHaveLength(7);
      expect(result.current.monthList.map((m) => m.id)).toEqual([
        "2024-03-01",
        "2024-04-01",
        ...initialIds,
      ]);

      // After we scroll to the beginning again, we prepend two months again, reaching the min date.
      act(() => {
        result.current.prependMonths(2); // no change here
      });
      expect(result.current.monthList).toHaveLength(9);

      const finalIds = [
        "2024-01-01",
        "2024-02-01",
        "2024-03-01",
        "2024-04-01",
        ...initialIds,
      ];
      expect(result.current.monthList.map((m) => m.id)).toEqual(finalIds);

      // If we try scrolling once more, it's a no-op
      act(() => {
        result.current.prependMonths(2);
      });
      expect(result.current.monthList.map((m) => m.id)).toEqual(finalIds);
    });

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

  describe("github issues", () => {
    it("#16: Incorrect scroll position when setting calendarMinDateId", () => {
      const { result } = renderHook(() =>
        useCalendarList({
          calendarInitialMonthId: "2024-01-05",
          calendarMinDateId: "2023-02-27",
          calendarFirstDayOfWeek: "sunday",
          calendarFutureScrollRangeInMonths: 12,
          calendarPastScrollRangeInMonths: 12,
        })
      );

      const { monthList, initialMonthIndex } = result.current;

      expect(monthList[0].id).toBe("2023-02-01");
      expect(initialMonthIndex).toBe(11);
      expect(monthList.at(-1)?.id).toBe("2025-01-01");
    });
  });
});
