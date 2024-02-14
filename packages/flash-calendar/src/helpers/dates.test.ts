import { expect, it, describe, beforeEach, afterEach } from "bun:test";
import { endOfMonth } from "date-fns";

import { fromDateId, toDateId } from "@/helpers/dates";

describe("toDateId", () => {
  describe("Brasilia time zone", () => {
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

  describe("UTC time zone", () => {
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
});

describe("fromDateId", () => {
  it("parse Jan 1st", () => {
    const parsedDate = fromDateId("2024-01-01");
    expect(parsedDate.getFullYear()).toBe(2024);
    expect(parsedDate.getMonth()).toBe(0);
    expect(parsedDate.getDate()).toBe(1);
    expect(toDateId(parsedDate)).toBe("2024-01-01");
  });
});
