import { describe, it, expect } from "bun:test";

import { getHeightForMonth } from "@/hooks/useCalendarList";
describe("getHeightForMonth", () => {
  it("Measures months with 5 weeks", () => {
    const calendarMonthHeaderHeight = 50;
    const calendarRowVerticalSpacing = 5;
    const calendarWeekHeaderHeight = 30;
    const calendarDayHeight = 20;

    expect(
      getHeightForMonth({
        calendarDayHeight,
        calendarMonthHeaderHeight,
        calendarRowVerticalSpacing,
        calendarWeekHeaderHeight,
        spacing: 0,
        month: {
          id: "some",
          date: new Date(),
          numberOfWeeks: 5,
        },
      })
    ).toBe(
      calendarMonthHeaderHeight +
        calendarRowVerticalSpacing +
        calendarWeekHeaderHeight +
        5 * (calendarDayHeight + calendarRowVerticalSpacing)
    );
  });

  it("Measures months with 6 weeks", () => {
    const calendarMonthHeaderHeight = 50;
    const calendarRowVerticalSpacing = 5;
    const calendarWeekHeaderHeight = 30;
    const calendarDayHeight = 20;

    expect(
      getHeightForMonth({
        calendarDayHeight,
        calendarMonthHeaderHeight,
        calendarRowVerticalSpacing,
        calendarWeekHeaderHeight,
        spacing: 0,
        month: {
          id: "some",
          date: new Date(),
          numberOfWeeks: 6,
        },
      })
    ).toBe(
      calendarMonthHeaderHeight +
        calendarRowVerticalSpacing +
        calendarWeekHeaderHeight +
        6 * (calendarDayHeight + calendarRowVerticalSpacing)
    );
  });
});
