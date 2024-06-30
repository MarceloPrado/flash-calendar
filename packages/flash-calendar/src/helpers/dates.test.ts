import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import {
  addDays as addDaysDateFns,
  subDays as subDaysDateFns,
  endOfMonth as endOfMonthDateFns,
  startOfWeek as startOfWeekDateFns,
  startOfMonth as startOfMonthDateFns,
  addMonths as addMonthsDateFns,
  subMonths as subMonthsDateFns,
  getWeeksInMonth as getWeeksInMonthDateFns,
  getWeekOfMonth as getWeekOfMonthDateFns,
} from "date-fns";

import {
  addDays,
  endOfMonth,
  fromDateId,
  addMonths,
  subMonths,
  startOfMonth,
  subDays,
  startOfWeek,
  toDateId,
  isWeekend,
  differenceInMonths,
  getWeeksInMonth,
  getWeekOfMonth,
} from "@/helpers/dates";
import { range } from "@/helpers/numbers";
import { pipe } from "@/helpers/functions";

describe("toDateId: UTC time zone", () => {
  beforeEach(() => {
    process.env.TZ = "UTC";
  });
  afterEach(() => {
    process.env.TZ = undefined;
  });

  it("January 1st, 2024", () => {
    expect(toDateId(new Date("2024-01-01T00:00:00.000Z"))).toBe("2024-01-01");
  });
  it("January 31th, 2024", () => {
    expect(toDateId(new Date("2024-01-31T00:00:00.000Z"))).toBe("2024-01-31");
  });
  it("February 1st, 2024", () => {
    expect(toDateId(new Date("2024-02-01T00:00:00.000Z"))).toBe("2024-02-01");
  });
  it("February 10th, 2024", () => {
    expect(toDateId(new Date("2024-02-10T00:00:00.000Z"))).toBe("2024-02-10");
  });
  it("convert between ID -> Date -> ID returns the original result", () => {
    const id = "2024-02-01";
    const date = new Date(id);
    expect(toDateId(date)).toBe(id);
  });
});

describe("toDateId: Brasilia time zone ", () => {
  beforeEach(() => {
    process.env.TZ = "America/Sao_Paulo";
  });
  afterEach(() => {
    process.env.TZ = undefined;
  });

  it("January 1st, 2024", () => {
    expect(toDateId(new Date("2024-01-01T03:00:00.000Z"))).toBe("2024-01-01");
  });
  it("January 31th, 2024", () => {
    expect(toDateId(new Date("2024-01-31T03:00:00.000Z"))).toBe("2024-01-31");

    const january = new Date("2024-01-01T03:00:00.000Z");
    const endOfJanuary = endOfMonth(january);
    expect(toDateId(endOfJanuary)).toBe("2024-01-31");
  });
  it("February 1st, 2024", () => {
    expect(toDateId(new Date("2024-02-01T03:00:00.000Z"))).toBe("2024-02-01");
  });
  it("February 10th, 2024", () => {
    expect(toDateId(new Date("2024-02-10T03:00:00.000Z"))).toBe("2024-02-10");
  });

  it("February 29th, 2024", () => {
    const february = new Date("2024-02-01T03:00:00.000Z");
    const endOfFebruary = endOfMonth(february);
    expect(toDateId(endOfFebruary)).toBe("2024-02-29");
  });

  it("convert between ID -> Date -> ID returns the original result", () => {
    const id = "2024-02-01T03:00:00.000Z";
    const date = new Date(id);
    expect(toDateId(date)).toBe(id.split("T")[0]);
  });
});

describe("fromDateId: UTC time zone", () => {
  it("parse Jan 1st", () => {
    const parsedDate = fromDateId("2024-01-01");
    expect(parsedDate.getFullYear()).toBe(2024);
    expect(parsedDate.getMonth()).toBe(0);
    expect(parsedDate.getDate()).toBe(1);
    expect(toDateId(parsedDate)).toBe("2024-01-01");
  });

  it("parses March 1st", () => {
    const parsedDate = fromDateId("2024-03-01");
    expect(toDateId(parsedDate)).toBe("2024-03-01");
  });
});

describe("fromDateId: Brasilia time zone", () => {
  beforeEach(() => {
    process.env.TZ = "America/Sao_Paulo";
  });
  afterEach(() => {
    process.env.TZ = undefined;
  });

  it("parse Jan 1st", () => {
    const parsedDate = fromDateId("2024-01-01");
    expect(parsedDate.getFullYear()).toBe(2024);
    expect(parsedDate.getMonth()).toBe(0);
    expect(parsedDate.getDate()).toBe(1);
    expect(toDateId(parsedDate)).toBe("2024-01-01");
  });

  it("parses March 1st", () => {
    const parsedDate = fromDateId("2024-03-01");
    expect(toDateId(parsedDate)).toBe("2024-03-01");
  });
});

describe("startOfMonth", () => {
  it("January", () => {
    expect(toDateId(startOfMonth(fromDateId("2024-01-02")))).toBe("2024-01-01");
    expect(toDateId(startOfMonth(fromDateId("2024-01-31")))).toBe("2024-01-01");
  });
  it("February", () => {
    expect(toDateId(startOfMonth(fromDateId("2024-02-01")))).toBe("2024-02-01");
    expect(toDateId(startOfMonth(fromDateId("2024-02-29")))).toBe("2024-02-01");
  });
  it("matches date-fns", () => {
    const baseDate = fromDateId("2020-01-01");
    range(1, 1000).forEach((i) => {
      const date = addDays(baseDate, i);
      expect(startOfMonthDateFns(date).toISOString()).toBe(
        startOfMonth(date).toISOString()
      );
      expect(startOfMonthDateFns(date).toISOString()).toBe(
        startOfMonth(date).toISOString()
      );
    });
  });
});

describe("endOfMonth", () => {
  it("January", () => {
    expect(toDateId(endOfMonth(fromDateId("2024-01-02")))).toBe("2024-01-31");
    expect(toDateId(endOfMonth(fromDateId("2024-01-31")))).toBe("2024-01-31");
  });
  it("February", () => {
    expect(toDateId(endOfMonth(fromDateId("2024-02-01")))).toBe("2024-02-29");
    expect(toDateId(endOfMonth(fromDateId("2024-02-29")))).toBe("2024-02-29");
  });
  it("matches date-fns", () => {
    const baseDate = fromDateId("2020-01-01");
    range(1, 1000).forEach((i) => {
      const date = addDays(baseDate, i);
      expect(endOfMonthDateFns(date).toISOString()).toBe(
        endOfMonth(date).toISOString()
      );
      expect(endOfMonthDateFns(date).toISOString()).toBe(
        endOfMonth(date).toISOString()
      );
    });
  });
});

describe("startOfWeek", () => {
  it("sunday: week of February 17th", () => {
    expect(toDateId(startOfWeek(fromDateId("2024-02-17"), "sunday"))).toBe(
      "2024-02-11"
    );
  });
  it("sunday: week of February 11th", () => {
    expect(toDateId(startOfWeek(fromDateId("2024-02-11"), "sunday"))).toBe(
      "2024-02-11"
    );
  });
  it("monday: week of February 17th", () => {
    expect(toDateId(startOfWeek(fromDateId("2024-02-17"), "monday"))).toBe(
      "2024-02-12"
    );
  });
  it("monday: week of February 11th", () => {
    expect(toDateId(startOfWeek(fromDateId("2024-02-11"), "monday"))).toBe(
      "2024-02-05"
    );
  });

  it("matches date-fns", () => {
    const baseDate = fromDateId("2020-01-01");
    range(1, 1000).forEach((i) => {
      const date = addDays(baseDate, i);
      expect(startOfWeekDateFns(date, { weekStartsOn: 0 }).toISOString()).toBe(
        startOfWeek(date, "sunday").toISOString()
      );
      expect(startOfWeekDateFns(date, { weekStartsOn: 1 }).toISOString()).toBe(
        startOfWeek(date, "monday").toISOString()
      );
    });
  });
});

describe("addMonths", () => {
  const addMonthsCurried = (amount: number) => (date: Date) =>
    addMonths(date, amount);
  it("add 1 month", () => {
    expect(
      pipe(fromDateId("2024-01-01"), addMonthsCurried(1)).toISOString()
    ).toBe(fromDateId("2024-02-01").toISOString());
  });

  it("add 10 months", () => {
    expect(pipe(fromDateId("2024-01-01"), addMonthsCurried(10), toDateId)).toBe(
      "2024-11-01"
    );
  });

  it("matches date-fns", () => {
    const baseDate = fromDateId("2020-01-01");
    range(1, 100).forEach((i) => {
      const date = addMonths(baseDate, i);
      expect(addMonthsDateFns(baseDate, i).toISOString()).toBe(
        date.toISOString()
      );
    });
  });
});

describe("subMonths", () => {
  const subMonthsCurried = (amount: number) => (date: Date) =>
    subMonths(date, amount);
  it("sub 1 month", () => {
    expect(
      pipe(fromDateId("2024-01-01"), subMonthsCurried(1)).toISOString()
    ).toBe(fromDateId("2023-12-01").toISOString());
  });

  it("sub 10 months", () => {
    expect(pipe(fromDateId("2024-01-01"), subMonthsCurried(10), toDateId)).toBe(
      "2023-03-01"
    );
  });

  it("matches date-fns", () => {
    const baseDate = fromDateId("2020-01-01");
    range(1, 100).forEach((i) => {
      const date = subMonths(baseDate, i);
      expect(subMonthsDateFns(baseDate, i).toISOString()).toBe(
        date.toISOString()
      );
    });
  });
});
describe("addDays", () => {
  const addDaysCurried = (amount: number) => (date: Date) =>
    addDays(date, amount);
  it("add 1 day", () => {
    expect(
      pipe(fromDateId("2024-01-01"), addDaysCurried(1)).toISOString()
    ).toBe(fromDateId("2024-01-02").toISOString());
  });

  it("add 10 days", () => {
    expect(pipe(fromDateId("2024-01-01"), addDaysCurried(10), toDateId)).toBe(
      "2024-01-11"
    );
  });

  it("matches date-fns", () => {
    const baseDate = fromDateId("2020-01-01");
    range(1, 100).forEach((i) => {
      const date = addDays(baseDate, i);
      expect(addDaysDateFns(baseDate, i).toISOString()).toBe(
        date.toISOString()
      );
    });
  });
});

describe("subDays", () => {
  const subDaysCurried = (amount: number) => (date: Date) =>
    subDays(date, amount);

  it("sub 1 day", () => {
    expect(
      pipe(fromDateId("2024-01-01"), subDaysCurried(1)).toISOString()
    ).toBe(fromDateId("2023-12-31").toISOString());
  });

  it("sub 10 days", () => {
    expect(pipe(fromDateId("2024-01-01"), subDaysCurried(10), toDateId)).toBe(
      "2023-12-22"
    );
  });

  it("matches date-fns", () => {
    const baseDate = fromDateId("2020-01-01");
    range(1, 100).forEach((i) => {
      const date = subDays(baseDate, i);
      expect(subDaysDateFns(baseDate, i).toISOString()).toBe(
        date.toISOString()
      );
    });
  });
});

describe("isWeekend", () => {
  it("Friday", () => {
    expect(pipe(fromDateId("2024-02-16"), isWeekend)).toBeFalse();
  });
  it("Saturday", () => {
    expect(pipe(fromDateId("2024-02-17"), isWeekend)).toBeTrue();
  });
  it("Sunday", () => {
    expect(pipe(fromDateId("2024-02-18"), isWeekend)).toBeTrue();
  });
  it("Monday", () => {
    expect(pipe(fromDateId("2024-02-19"), isWeekend)).toBeFalse();
  });
});

// This test suite was copied from date-fns source, with one change: our
// function returns `1` even if the dates aren't a full month apart
describe("differenceInMonths ", () => {
  it("returns the number of full months between the given dates", () => {
    const result = differenceInMonths(
      new Date(2012, 6 /* Jul */, 2, 18, 0),
      new Date(2011, 6 /* Jul */, 2, 6, 0)
    );
    expect(result).toBe(12);
  });

  it("returns a negative number if the time value of the first date is smaller", () => {
    const result = differenceInMonths(
      new Date(2011, 6 /* Jul */, 2, 6, 0),
      new Date(2012, 6 /* Jul */, 2, 18, 0)
    );
    expect(result).toBe(-12);
  });

  describe("edge cases", () => {
    it("it returns diff of 1 month between Feb 28 2021 and Jan 30 2021", () => {
      const result = differenceInMonths(
        new Date(2021, 1 /* Feb */, 28),
        new Date(2021, 0 /* Jan */, 30)
      );
      expect(result).toBe(1);
    });

    it("it returns diff of 1 month between Feb 28 2021 and Jan 31 2021", () => {
      const result = differenceInMonths(
        new Date(2021, 1 /* Feb */, 28),
        new Date(2021, 0 /* Jan */, 31)
      );
      expect(result).toBe(1);
    });

    it("it returns diff of 1 month between Nov, 30 2021 and Oct, 31 2021", () => {
      const result = differenceInMonths(
        new Date(2021, 10 /* Nov */, 30),
        new Date(2021, 9 /* Oct */, 31)
      );
      expect(result).toBe(1);
    });

    it("it returns diff of 1 month between Oct, 31 2021 and Sep, 30 2021", () => {
      const result = differenceInMonths(
        new Date(2021, 9 /* Oct */, 31),
        new Date(2021, 8 /* Sep */, 30)
      );
      expect(result).toBe(1);
    });

    it("it returns diff of 6 month between Oct, 31 2021 and Apr, 30 2021", () => {
      const result = differenceInMonths(
        new Date(2021, 9 /* Oct */, 31),
        new Date(2021, 3 /* Apr */, 30)
      );
      expect(result).toBe(6);
    });

    it("it returns diff of -1 month between Sep, 30 2021 and Oct, 31 2021", () => {
      const result = differenceInMonths(
        new Date(2021, 8 /* Sep */, 30),
        new Date(2021, 9 /* Oct */, 31)
      );
      expect(result).toBe(-1);
    });

    it("the days of months of the given dates are the same", () => {
      const result = differenceInMonths(
        new Date(2014, 8 /* Sep */, 6),
        new Date(2014, 7 /* Aug */, 6)
      );
      expect(result).toBe(1);
    });

    it("the given dates are the same", () => {
      const result = differenceInMonths(
        new Date(2014, 8 /* Sep */, 5, 0, 0),
        new Date(2014, 8 /* Sep */, 5, 0, 0)
      );
      expect(result).toBe(0);
    });

    it("does not return -0 when the given dates are the same", () => {
      function isNegativeZero(x: number): boolean {
        return x === 0 && 1 / x < 0;
      }

      const result = differenceInMonths(
        new Date(2014, 8 /* Sep */, 5, 0, 0),
        new Date(2014, 8 /* Sep */, 5, 0, 0)
      );

      const resultIsNegative = isNegativeZero(result);
      expect(resultIsNegative).toBeFalse();
    });
  });

  it("returns NaN if the first date is `Invalid Date`", () => {
    const result = differenceInMonths(
      new Date(NaN),
      new Date(2017, 0 /* Jan */, 1)
    );
    expect(result).toBeNaN();
  });

  it("returns NaN if the second date is `Invalid Date`", () => {
    const result = differenceInMonths(
      new Date(2017, 0 /* Jan */, 1),
      new Date(NaN)
    );
    expect(result).toBeNaN();
  });

  it("returns NaN if the both dates are `Invalid Date`", () => {
    const result = differenceInMonths(new Date(NaN), new Date(NaN));
    expect(result).toBeNaN();
  });

  describe("edge cases", () => {
    it("returns the number of full months between the given dates - end of Feb", () => {
      expect(
        differenceInMonths(
          new Date(2012, 1 /* Feb */, 29, 9, 0, 0),
          new Date(2012, 1 /* Feb */, 29, 10, 0, 0)
        )
      ).toBe(0);

      expect(
        differenceInMonths(
          new Date(2012, 1 /* Feb */, 28, 9, 0, 0),
          new Date(2012, 1 /* Feb */, 29, 10, 0, 0)
        )
      ).toBe(0);
      expect(
        differenceInMonths(
          new Date(2012, 1 /* Feb */, 27, 9, 0, 0),
          new Date(2012, 1 /* Feb */, 27, 10, 0, 0)
        )
      ).toBe(0);
      expect(
        differenceInMonths(
          new Date(2012, 1 /* Feb */, 28, 9, 0, 0),
          new Date(2012, 1 /* Feb */, 28, 10, 0, 0)
        )
      ).toBe(0);
    });

    expect(
      differenceInMonths(
        new Date(2021, 1 /* Feb */, 28, 7, 23, 7),
        new Date(2021, 1 /* Feb */, 28, 7, 38, 18)
      )
    ).toBe(0);
  });
});

describe("getWeeksInMonth", () => {
  const getWeeksInMonth_sunday = (date: Date) =>
    getWeeksInMonth(date, "sunday");

  const getWeeksInMonth_monday = (date: Date) =>
    getWeeksInMonth(date, "monday");

  it("sunday: Month with 5 weeks", () => {
    expect(pipe(fromDateId("2024-01-01"), getWeeksInMonth_sunday)).toBe(5);
    expect(pipe(fromDateId("2024-02-13"), getWeeksInMonth_sunday)).toBe(5);
    expect(pipe(fromDateId("2024-04-01"), getWeeksInMonth_sunday)).toBe(5);
    expect(pipe(fromDateId("2024-05-31"), getWeeksInMonth_sunday)).toBe(5);
  });

  it("sunday: Month with 6 weeks", () => {
    expect(pipe(fromDateId("2024-03-01"), getWeeksInMonth_sunday)).toBe(6);
    expect(pipe(fromDateId("2024-06-30"), getWeeksInMonth_sunday)).toBe(6);
  });

  it("monday: Month with 5 weeks", () => {
    expect(pipe(fromDateId("2024-01-01"), getWeeksInMonth_monday)).toBe(5);
    expect(pipe(fromDateId("2024-02-13"), getWeeksInMonth_monday)).toBe(5);
    expect(pipe(fromDateId("2024-03-01"), getWeeksInMonth_monday)).toBe(5);
    expect(pipe(fromDateId("2024-04-01"), getWeeksInMonth_monday)).toBe(5);
    expect(pipe(fromDateId("2024-05-31"), getWeeksInMonth_monday)).toBe(5);
    expect(pipe(fromDateId("2024-06-30"), getWeeksInMonth_monday)).toBe(5);
  });

  it("matches date-fns", () => {
    const baseDate = fromDateId("2020-01-01");
    range(1, 500).forEach((i) => {
      const date = addMonths(baseDate, i);
      const countMonday = getWeeksInMonthDateFns(date, { weekStartsOn: 1 });
      const countSunday = getWeeksInMonthDateFns(date, { weekStartsOn: 0 });

      expect(getWeeksInMonth(date, "monday")).toBe(countMonday);
      expect(getWeeksInMonth(date, "sunday")).toBe(countSunday);
    });
  });
});

describe("getWeekOfMonth", () => {
  const getWeekOfMonth_sunday = (date: Date) => getWeekOfMonth(date, "sunday");
  const getWeekOfMonth_monday = (date: Date) => getWeekOfMonth(date, "monday");

  it("sunday: June", () => {
    expect(pipe(fromDateId("2024-06-01"), getWeekOfMonth_sunday)).toBe(1);
    expect(pipe(fromDateId("2024-06-02"), getWeekOfMonth_sunday)).toBe(2);
    expect(pipe(fromDateId("2024-06-03"), getWeekOfMonth_monday)).toBe(2);
    expect(pipe(fromDateId("2024-06-12"), getWeekOfMonth_sunday)).toBe(3);
    expect(pipe(fromDateId("2024-06-22"), getWeekOfMonth_sunday)).toBe(4);
    expect(pipe(fromDateId("2024-06-28"), getWeekOfMonth_sunday)).toBe(5);
    expect(pipe(fromDateId("2024-06-30"), getWeekOfMonth_sunday)).toBe(6);
  });
  it("monday: June", () => {
    expect(pipe(fromDateId("2024-06-01"), getWeekOfMonth_monday)).toBe(1);
    expect(pipe(fromDateId("2024-06-02"), getWeekOfMonth_monday)).toBe(1);
    expect(pipe(fromDateId("2024-06-03"), getWeekOfMonth_monday)).toBe(2);
    expect(pipe(fromDateId("2024-06-12"), getWeekOfMonth_monday)).toBe(3);
    expect(pipe(fromDateId("2024-06-22"), getWeekOfMonth_monday)).toBe(4);
    expect(pipe(fromDateId("2024-06-28"), getWeekOfMonth_monday)).toBe(5);
    expect(pipe(fromDateId("2024-06-30"), getWeekOfMonth_monday)).toBe(5);
  });
  it("matches date-fns", () => {
    const baseDate = fromDateId("2024-06-01");
    range(1, 500).forEach((i) => {
      const date = addDays(baseDate, i);
      const countMonday = getWeekOfMonthDateFns(date, { weekStartsOn: 1 });
      const countSunday = getWeekOfMonthDateFns(date, { weekStartsOn: 0 });

      expect(getWeekOfMonth(date, "monday")).toBe(countMonday);
      expect(getWeekOfMonth(date, "sunday")).toBe(countSunday);
    });
  });
});
