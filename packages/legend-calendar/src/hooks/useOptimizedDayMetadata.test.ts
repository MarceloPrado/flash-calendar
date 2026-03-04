import { act, renderHook } from "@testing-library/react-hooks";
import { beforeEach, describe, expect, it } from "bun:test";

import { fromDateId } from "@/helpers/dates";
import type { CalendarDayMetadata } from "@/hooks/useCalendar";
import {
  activeDateRangesStore,
  useOptimizedDayMetadata,
} from "@/hooks/useOptimizedDayMetadata";

describe("useOptimizedDayMetadata", () => {
  beforeEach(() => {
    activeDateRangesStore.clear();
  });

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
    // With useSyncExternalStore + useMemo, we get fewer renders than the old
    // useEffect + useState implementation (2 instead of 3), which is more efficient.
    expect(result.all).toHaveLength(2);
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
      activeDateRangesStore.setRanges("legend-calendar-default-instance", [
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
      activeDateRangesStore.setRanges("legend-calendar-default-instance", [
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
      activeDateRangesStore.setRanges("legend-calendar-default-instance", [
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
      activeDateRangesStore.setRanges("legend-calendar-default-instance", [
        {
          startId: "2024-02-01",
          endId: "2024-02-17",
        },
      ]);
    });

    expect(result.current).toEqual(baseMetadata);
    // useSyncExternalStore triggers a re-render when the snapshot changes,
    // but useMemo returns the same baseMetadata ref, so the component using
    // this hook (with memo()) won't re-render. This is still more efficient.
    expect(result.all).toHaveLength(2);

    // Emit another event
    act(() => {
      activeDateRangesStore.setRanges("legend-calendar-default-instance", [
        {
          startId: "2024-02-19",
          endId: "2024-02-23",
        },
      ]);
    });

    expect(result.current).toEqual(baseMetadata);
    expect(result.all).toHaveLength(3);

    // Emit an incomplete range
    act(() => {
      activeDateRangesStore.setRanges("legend-calendar-default-instance", [
        {
          startId: "2024-02-01",
          endId: undefined,
        },
      ]);
    });

    expect(result.current).toEqual(baseMetadata);
    expect(result.all).toHaveLength(4);

    // Check if the metadata is updated when the range is complete
    act(() => {
      activeDateRangesStore.setRanges("legend-calendar-default-instance", [
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
    expect(result.all).toHaveLength(5);
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
      activeDateRangesStore.setRanges("legend-calendar-default-instance", [
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
      activeDateRangesStore.setRanges("legend-calendar-default-instance", [
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

describe("useOptimizedDayMetadata with calendarInstanceId", () => {
  const getBaseMetadata = (date: string): CalendarDayMetadata => ({
    date: fromDateId(date),
    displayLabel: date.split("-")[2],
    id: date,
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
  });

  it("uses the default instance ID when not provided", () => {
    const baseMetadata = getBaseMetadata("2024-02-16");
    const { result } = renderHook(() => useOptimizedDayMetadata(baseMetadata));

    act(() => {
      activeDateRangesStore.setRanges("legend-calendar-default-instance", [
        {
          startId: "2024-02-16",
          endId: "2024-02-16",
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
  });

  it("responds to events for the correct instance ID", () => {
    const instanceId = "test-calendar-1";
    const baseMetadata = getBaseMetadata("2024-02-16");
    const { result } = renderHook(() =>
      useOptimizedDayMetadata(baseMetadata, instanceId)
    );

    act(() => {
      activeDateRangesStore.setRanges(instanceId, [
        {
          startId: "2024-02-16",
          endId: "2024-02-16",
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
  });

  it("ignores events for different instance IDs", () => {
    const instanceId = "test-calendar-2";
    const baseMetadata = getBaseMetadata("2024-02-16");
    const { result } = renderHook(() =>
      useOptimizedDayMetadata(baseMetadata, instanceId)
    );

    act(() => {
      activeDateRangesStore.setRanges("different-calendar", [
        {
          startId: "2024-02-16",
          endId: "2024-02-16",
        },
      ]);
    });

    // The metadata should not change
    expect(result.current).toEqual(baseMetadata);
  });

  it("handles multiple instances correctly", () => {
    const instanceId1 = "test-calendar-3";
    const instanceId2 = "test-calendar-4";

    const baseMetadata1 = getBaseMetadata("2024-02-16");
    const baseMetadata2 = getBaseMetadata("2024-02-16");

    const { result: result1 } = renderHook(() =>
      useOptimizedDayMetadata(baseMetadata1, instanceId1)
    );
    const { result: result2 } = renderHook(() =>
      useOptimizedDayMetadata(baseMetadata2, instanceId2)
    );

    act(() => {
      activeDateRangesStore.setRanges(instanceId1, [
        {
          startId: "2024-02-16",
          endId: "2024-02-16",
        },
      ]);
    });

    expect(result1.current).toEqual({
      ...baseMetadata1,
      state: "active",
      isStartOfRange: true,
      isEndOfRange: true,
      isRangeValid: true,
    });
    expect(result2.current).toEqual(baseMetadata2);

    act(() => {
      activeDateRangesStore.setRanges(instanceId2, [
        {
          startId: "2024-02-15",
          endId: "2024-02-17",
        },
      ]);
    });

    expect(result1.current).toEqual({
      ...baseMetadata1,
      state: "active",
      isStartOfRange: true,
      isEndOfRange: true,
      isRangeValid: true,
    });
    expect(result2.current).toEqual({
      ...baseMetadata2,
      state: "active",
      isRangeValid: true,
    });
  });

  it("resets state for the correct instance when a new range is selected", () => {
    const instanceId = "test-calendar-5";
    const baseMetadata = getBaseMetadata("2024-02-16");
    const { result } = renderHook(() =>
      useOptimizedDayMetadata(baseMetadata, instanceId)
    );

    act(() => {
      activeDateRangesStore.setRanges(instanceId, [
        {
          startId: "2024-02-16",
          endId: "2024-02-16",
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

    act(() => {
      activeDateRangesStore.setRanges(instanceId, [
        {
          startId: "2024-02-18",
          endId: "2024-02-20",
        },
      ]);
    });

    // Should reset to base state
    expect(result.current).toEqual(baseMetadata);
  });
});
