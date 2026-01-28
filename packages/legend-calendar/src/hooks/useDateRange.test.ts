import { renderHook, act } from "@testing-library/react-hooks";
import { describe, it, expect } from "bun:test";

import { useDateRange } from "./useDateRange"; // replace with the actual path to your hook

describe("useDateRange", () => {
  it("should initialize with correct default values", () => {
    const { result } = renderHook(() => useDateRange());

    expect(result.current.dateRange).toEqual({
      startId: undefined,
      endId: undefined,
    });
    expect(result.current.calendarActiveDateRanges).toEqual([]);
    expect(result.current.isDateRangeValid).toBe(false);
  });

  it("should update dateRange correctly on onCalendarDayPress", () => {
    const { result } = renderHook(() => useDateRange());

    // Sets the start date
    act(() => {
      result.current.onCalendarDayPress("2022-01-01");
    });

    expect(result.current.dateRange).toEqual({
      startId: "2022-01-01",
      endId: undefined,
    });
    expect(result.current.calendarActiveDateRanges).toEqual([
      { startId: "2022-01-01", endId: undefined },
    ]);

    // Sets the end date
    act(() => {
      result.current.onCalendarDayPress("2022-01-10");
    });

    expect(result.current.dateRange).toEqual({
      startId: "2022-01-01",
      endId: "2022-01-10",
    });
    expect(result.current.calendarActiveDateRanges).toEqual([
      { startId: "2022-01-01", endId: "2022-01-10" },
    ]);

    // Sets a new start date
    act(() => {
      result.current.onCalendarDayPress("2024-02-16");
    });

    expect(result.current.dateRange).toEqual({
      startId: "2024-02-16",
      endId: undefined,
    });
    expect(result.current.calendarActiveDateRanges).toEqual([
      { startId: "2024-02-16", endId: undefined },
    ]);

    // Sets an earlier end date, which should swap the start and end dates
    act(() => {
      result.current.onCalendarDayPress("2024-02-01");
    });

    expect(result.current.dateRange).toEqual({
      startId: "2024-02-01",
      endId: "2024-02-16",
    });
    expect(result.current.calendarActiveDateRanges).toEqual([
      { startId: "2024-02-01", endId: "2024-02-16" },
    ]);
  });

  it("should clear dateRange on onClearDateRange", () => {
    const { result } = renderHook(() => useDateRange());

    act(() => {
      result.current.onCalendarDayPress("2022-01-01");
    });

    act(() => {
      result.current.onCalendarDayPress("2022-01-10");
    });

    act(() => {
      result.current.onClearDateRange();
    });

    expect(result.current.dateRange).toEqual({
      startId: undefined,
      endId: undefined,
    });
  });

  it("should update isDateRangeValid correctly", () => {
    const { result } = renderHook(() => useDateRange());
    expect(result.current.isDateRangeValid).toBe(false);

    act(() => {
      result.current.onCalendarDayPress("2022-01-01");
    });

    expect(result.current.isDateRangeValid).toBe(false);

    act(() => {
      result.current.onCalendarDayPress("2022-01-10");
    });

    expect(result.current.isDateRangeValid).toBe(true);

    act(() => {
      result.current.onClearDateRange();
    });

    expect(result.current.isDateRangeValid).toBe(false);
  });

  it("can initialize a date range", () => {
    const { result } = renderHook(() =>
      useDateRange({ startId: "2022-01-01", endId: "2022-01-10" })
    );
    expect(result.current.dateRange).toEqual({
      startId: "2022-01-01",
      endId: "2022-01-10",
    });
    expect(result.current.isDateRangeValid).toBe(true);
  });
});
