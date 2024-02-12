import { describe, expect, it } from "bun:test";

import { fromDateId } from "@/helpers/dates";
import { buildCalendar } from "@/hooks/useCalendar";

describe("buildCalendar", () => {
  it("builds the month row", () => {
    const january = buildCalendar({
      calendarMonth: fromDateId("2024-01-01"),
      calendarFirstDayOfWeek: "sunday",
    });
    expect(january.calendarRowMonth).toBe("January 2024");
  });

  it("build the month row with custom formatting", () => {
    const january = buildCalendar({
      calendarMonth: fromDateId("2024-01-01"),
      calendarFirstDayOfWeek: "sunday",
      calendarRowMonthFormat: "MMM yy",
    });
    expect(january.calendarRowMonth).toBe("Jan 24");
  });

  it("builds the week days row starting on sunday", () => {
    const january = buildCalendar({
      calendarMonth: fromDateId("2024-01-01"),
      calendarFirstDayOfWeek: "sunday",
    });
    expect(january.weekDaysList).toEqual(["S", "M", "T", "W", "T", "F", "S"]);
  });

  it("builds the week days row starting on monday", () => {
    const january = buildCalendar({
      calendarMonth: fromDateId("2024-01-01"),
      calendarFirstDayOfWeek: "monday",
    });
    expect(january.weekDaysList).toEqual(["M", "T", "W", "T", "F", "S", "S"]);
  });

  it("builds the weeks row", () => {
    const { weeksList } = buildCalendar({
      calendarMonth: fromDateId("2024-02-01"),
      calendarFirstDayOfWeek: "sunday",
    });

    // February 2024 has 5 weeks
    expect(weeksList).toHaveLength(5);

    // #region First week
    // Every week has 7 days
    expect(weeksList.every((week) => week.length === 7)).toBe(true);

    let [sunday, monday, tuesday, wednesday, thursday, friday, saturday] =
      weeksList[0];
    expect(sunday.isStartOfWeek).toBe(true);
    expect(saturday.isEndOfWeek).toBe(true);

    // Filler days are built correctly
    expect(
      [sunday, monday, tuesday, wednesday].every((day) => day.isDifferentMonth)
    ).toBe(true);
    expect(
      [thursday, friday, saturday].every((day) => day.isDifferentMonth)
    ).toBe(false);

    // Labels are correct
    expect(sunday.displayLabel).toBe("28");
    expect(monday.displayLabel).toBe("29");
    expect(tuesday.displayLabel).toBe("30");
    expect(wednesday.displayLabel).toBe("31");
    expect(thursday.displayLabel).toBe("1");
    expect(friday.displayLabel).toBe("2");
    expect(saturday.displayLabel).toBe("3");

    // IDs are correct
    expect(sunday.id).toBe("2024-01-28");
    expect(monday.id).toBe("2024-01-29");
    expect(tuesday.id).toBe("2024-01-30");
    expect(wednesday.id).toBe("2024-01-31");

    expect(thursday.id).toBe("2024-02-01");
    expect(thursday.isStartOfMonth).toBe(true);

    expect(friday.id).toBe("2024-02-02");
    expect(saturday.id).toBe("2024-02-03");
    // #endregion

    // #region Last weeek
    [sunday, monday, tuesday, wednesday, thursday, friday, saturday] =
      weeksList[4];

    //   Fillers are built correctly
    expect(sunday.isStartOfWeek).toBe(true);
    expect(saturday.isEndOfWeek).toBe(true);
    expect(
      [sunday, monday, tuesday, wednesday, thursday].every(
        (day) => day.isDifferentMonth
      )
    ).toBe(false);
    expect([friday, saturday].every((day) => day.isDifferentMonth)).toBe(true);

    // Labels are correct
    expect(sunday.displayLabel).toBe("25");
    expect(monday.displayLabel).toBe("26");
    expect(tuesday.displayLabel).toBe("27");
    expect(wednesday.displayLabel).toBe("28");
    expect(thursday.displayLabel).toBe("29");
    expect(friday.displayLabel).toBe("1");
    expect(saturday.displayLabel).toBe("2");

    // IDs are correct
    expect(sunday.id).toBe("2024-02-25");
    expect(monday.id).toBe("2024-02-26");
    expect(tuesday.id).toBe("2024-02-27");
    expect(wednesday.id).toBe("2024-02-28");

    expect(thursday.id).toBe("2024-02-29");
    expect(thursday.isEndOfMonth).toBe(true);

    expect(friday.id).toBe("2024-03-01");
    expect(saturday.id).toBe("2024-03-02");
    // #endregion
  });

  it("build the weeks row with custom formatting", () => {
    const { weeksList } = buildCalendar({
      calendarMonth: fromDateId("2024-03-01"),
      calendarFirstDayOfWeek: "sunday",
      calendarItemDayFormat: "dd",
    });
    expect(weeksList[0][6].id).toBe("2024-03-02");
    expect(weeksList[0][6].displayLabel).toBe("02");
  });

  it("handles the expected range", () => {
    const { weeksList } = buildCalendar({
      calendarMonth: fromDateId("2024-02-01"),
      calendarFirstDayOfWeek: "sunday",
      calendarActiveDateRanges: [
        { startId: "2024-02-03", endId: "2024-02-05" },
      ],
    });

    expect(weeksList[0][6].id).toBe("2024-02-03");
    expect(weeksList[0][6].isStartOfRange).toBe(true);
    expect(weeksList[0][6].state).toBe("active");
    expect(weeksList[0][6].isEndOfRange).toBe(false);

    expect(weeksList[1][1].id).toBe("2024-02-05");
    expect(weeksList[1][1].isEndOfRange).toBe(true);
    expect(weeksList[1][1].state).toBe("active");
    expect(weeksList[1][1].isStartOfRange).toBe(false);
  });
});
