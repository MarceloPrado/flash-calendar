import { renderHook, act } from "@testing-library/react-hooks";
import { describe, it, expect } from "bun:test";

import type { CalendarDayMetadata } from "@/hooks/useCalendar";
import { fromDateId } from "@/helpers/dates";
import {
  activeDateRangesEmitter,
  useOptimizedDayMetadata,
} from "@/hooks/useOptimizedDayMetadata";

describe("useOptimizedDayMetadata", () => {
  it("return the base metadata as the initial value", () => {
    const baseMetadata: CalendarDayMetadata = {
      date: fromDateId("2024-02-16"),
      displayLabel: "16",
      id: "2024-02-16",
      isDifferentMonth: false,
      isDisabled: false,
      isEndOfMonth: false,
      isEndOfRange: false,
      isEndOfWeek: false,
      isRangeValid: false,
      isStartOfMonth: false,
      isStartOfRange: false,
      isStartOfWeek: false,
      isToday: false,
      isWeekend: false,
      state: "idle",
    };

    const { result } = renderHook(() => useOptimizedDayMetadata(baseMetadata));

    expect(result.current).toEqual(baseMetadata);
    expect(result.all).toHaveLength(1);
  });

  it("if the base changes, the returned value should match it.", () => {
    const baseMetadata: CalendarDayMetadata = {
      date: fromDateId("2024-02-16"),
      displayLabel: "16",
      id: "2024-02-16",
      isDifferentMonth: false,
      isDisabled: false,
      isEndOfMonth: false,
      isEndOfRange: false,
      isEndOfWeek: false,
      isRangeValid: false,
      isStartOfMonth: false,
      isStartOfRange: false,
      isStartOfWeek: false,
      isToday: false,
      isWeekend: false,
      state: "idle",
    };

    const { result, rerender } = renderHook(
      (initial) => useOptimizedDayMetadata(initial),
      {
        initialProps: baseMetadata,
      }
    );

    expect(result.current).toEqual(baseMetadata);
    rerender({
      ...baseMetadata,
      isDisabled: true,
    });

    expect(result.current).toEqual({
      ...baseMetadata,
      isDisabled: true,
    });
    // `useEffect` is called after the hook renders with the new baseMetadata.
    // Hence, the length of the `result.all` array is 3.
    expect(result.all).toHaveLength(3);
  });

  it("endOfRange: returns the updated metadata once an event is emitted", () => {
    const baseMetadata: CalendarDayMetadata = {
      date: fromDateId("2024-02-16"),
      displayLabel: "16",
      id: "2024-02-16",
      isDifferentMonth: false,
      isDisabled: false,
      isEndOfMonth: false,
      isEndOfRange: false,
      isEndOfWeek: false,
      isRangeValid: false,
      isStartOfMonth: false,
      isStartOfRange: false,
      isStartOfWeek: false,
      isToday: false,
      isWeekend: false,
      state: "idle",
    };

    // Initial state
    const { result } = renderHook(
      (initial) => useOptimizedDayMetadata(initial),
      {
        initialProps: baseMetadata,
      }
    );
    expect(result.current).toEqual(baseMetadata);

    // Emit event
    act(() => {
      activeDateRangesEmitter.emit("onSetActiveDateRanges", [
        {
          startId: "2024-02-01",
          endId: "2024-02-16",
        },
      ]);
    });

    expect(result.current).toEqual({
      ...baseMetadata,
      state: "active",
      isEndOfRange: true,
      isRangeValid: true,
    });
    expect(result.all).toHaveLength(2);
  });

  it("startOfRange: returns the updated metadata once an event is emitted", () => {
    const baseMetadata: CalendarDayMetadata = {
      date: fromDateId("2024-02-01"),
      displayLabel: "01",
      id: "2024-02-01",
      isDifferentMonth: false,
      isDisabled: false,
      isEndOfMonth: false,
      isEndOfRange: false,
      isEndOfWeek: false,
      isRangeValid: false,
      isStartOfMonth: false,
      isStartOfRange: false,
      isStartOfWeek: false,
      isToday: false,
      isWeekend: false,
      state: "idle",
    };

    // Initial state
    const { result } = renderHook(
      (initial) => useOptimizedDayMetadata(initial),
      {
        initialProps: baseMetadata,
      }
    );
    expect(result.current).toEqual(baseMetadata);

    // Emit event
    act(() => {
      activeDateRangesEmitter.emit("onSetActiveDateRanges", [
        {
          startId: "2024-02-01",
          endId: "2024-02-16",
        },
      ]);
    });

    expect(result.current).toEqual({
      ...baseMetadata,
      state: "active",
      isStartOfRange: true,
      isRangeValid: true,
    });
    expect(result.all).toHaveLength(2);
  });

  it("startOfRange|endOfRange: returns the updated metadata once an event is emitted", () => {
    const baseMetadata: CalendarDayMetadata = {
      date: fromDateId("2024-02-01"),
      displayLabel: "01",
      id: "2024-02-01",
      isDifferentMonth: false,
      isDisabled: false,
      isEndOfMonth: false,
      isEndOfRange: false,
      isEndOfWeek: false,
      isRangeValid: false,
      isStartOfMonth: false,
      isStartOfRange: false,
      isStartOfWeek: false,
      isToday: false,
      isWeekend: false,
      state: "idle",
    };

    // Initial state
    const { result } = renderHook(
      (initial) => useOptimizedDayMetadata(initial),
      {
        initialProps: baseMetadata,
      }
    );
    expect(result.current).toEqual(baseMetadata);

    // Emit event
    act(() => {
      activeDateRangesEmitter.emit("onSetActiveDateRanges", [
        {
          startId: "2024-02-01",
          endId: "2024-02-01",
        },
      ]);
    });

    expect(result.current).toEqual({
      ...baseMetadata,
      state: "active",
      isStartOfRange: true,
      isEndOfRange: true,
      isRangeValid: true,
    });
    expect(result.all).toHaveLength(2);
  });

  it("doesn't re-render if the active dates don't overlap", () => {
    const baseMetadata: CalendarDayMetadata = {
      date: fromDateId("2024-02-18"),
      displayLabel: "18",
      id: "2024-02-18",
      isDifferentMonth: false,
      isDisabled: false,
      isEndOfMonth: false,
      isEndOfRange: false,
      isEndOfWeek: false,
      isRangeValid: false,
      isStartOfMonth: false,
      isStartOfRange: false,
      isStartOfWeek: false,
      isToday: false,
      isWeekend: false,
      state: "idle",
    };

    // Initial state
    const { result } = renderHook(
      (initial) => useOptimizedDayMetadata(initial),
      {
        initialProps: baseMetadata,
      }
    );
    expect(result.current).toEqual(baseMetadata);

    // Emit event
    act(() => {
      activeDateRangesEmitter.emit("onSetActiveDateRanges", [
        {
          startId: "2024-02-01",
          endId: "2024-02-17",
        },
      ]);
    });

    expect(result.current).toEqual(baseMetadata);
    expect(result.all).toHaveLength(1);

    // Emit another event
    act(() => {
      activeDateRangesEmitter.emit("onSetActiveDateRanges", [
        {
          startId: "2024-02-19",
          endId: "2024-02-23",
        },
      ]);
    });

    expect(result.current).toEqual(baseMetadata);
    expect(result.all).toHaveLength(1);

    // Emit an incomplete range
    act(() => {
      activeDateRangesEmitter.emit("onSetActiveDateRanges", [
        {
          startId: "2024-02-01",
          endId: undefined,
        },
      ]);
    });

    expect(result.current).toEqual(baseMetadata);
    expect(result.all).toHaveLength(1);

    // Check if the metadata is updated when the range is complete
    act(() => {
      activeDateRangesEmitter.emit("onSetActiveDateRanges", [
        {
          startId: "2024-02-01",
          endId: "2024-02-20",
        },
      ]);
    });
    expect(result.current).toEqual({
      ...baseMetadata,
      state: "active",
      isRangeValid: true,
    });
    expect(result.all).toHaveLength(2);
  });

  it("resets the state once a new range is selected", () => {
    const baseMetadata: CalendarDayMetadata = {
      date: fromDateId("2024-02-01"),
      displayLabel: "01",
      id: "2024-02-01",
      isDifferentMonth: false,
      isDisabled: false,
      isEndOfMonth: false,
      isEndOfRange: false,
      isEndOfWeek: false,
      isRangeValid: false,
      isStartOfMonth: false,
      isStartOfRange: false,
      isStartOfWeek: false,
      isToday: false,
      isWeekend: false,
      state: "idle",
    };

    // Initial state
    const { result } = renderHook(
      (initial) => useOptimizedDayMetadata(initial),
      {
        initialProps: baseMetadata,
      }
    );
    expect(result.current).toEqual(baseMetadata);

    // Emit event
    act(() => {
      activeDateRangesEmitter.emit("onSetActiveDateRanges", [
        {
          startId: "2024-02-01",
          endId: "2024-02-01",
        },
      ]);
    });

    expect(result.current).toEqual({
      ...baseMetadata,
      state: "active",
      isStartOfRange: true,
      isEndOfRange: true,
      isRangeValid: true,
    });
    expect(result.all).toHaveLength(2);

    // Emit another range
    act(() => {
      activeDateRangesEmitter.emit("onSetActiveDateRanges", [
        {
          startId: "2024-02-03",
          endId: "2024-02-03",
        },
      ]);
    });

    // Back to the initial state
    expect(result.current).toEqual(baseMetadata);
    expect(result.all).toHaveLength(3);
  });
});
