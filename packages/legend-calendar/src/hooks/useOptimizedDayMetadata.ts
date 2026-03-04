import { useMemo, useSyncExternalStore } from "react";

import {
  getStateFields,
  type CalendarActiveDateRange,
  type CalendarDayMetadata,
} from "@/hooks/useCalendar";

/**
 * The default calendar instance ID. This is used when no instance ID is provided.
 */
const DEFAULT_CALENDAR_INSTANCE_ID = "legend-calendar-default-instance";

interface DateRangeStoreState {
  ranges: CalendarActiveDateRange[];
  subscribers: Set<() => void>;
}

/**
 * A lightweight store for active date ranges. This replaces the mitt emitter
 * with a more efficient useSyncExternalStore-compatible pattern.
 */
class DateRangeStore {
  private stores = new Map<string, DateRangeStoreState>();

  private getOrCreateStore(instanceId: string): DateRangeStoreState {
    if (!this.stores.has(instanceId)) {
      this.stores.set(instanceId, {
        ranges: [],
        subscribers: new Set(),
      });
    }
    return this.stores.get(instanceId)!;
  }

  setRanges(instanceId: string, ranges: CalendarActiveDateRange[]): void {
    const store = this.getOrCreateStore(instanceId);
    store.ranges = ranges;
    store.subscribers.forEach((callback) => callback());
  }

  getSnapshot(instanceId: string): CalendarActiveDateRange[] {
    return this.getOrCreateStore(instanceId).ranges;
  }

  subscribe(instanceId: string, callback: () => void): () => void {
    const store = this.getOrCreateStore(instanceId);
    store.subscribers.add(callback);
    return () => {
      store.subscribers.delete(callback);
    };
  }

  /**
   * Clears all stores. Useful for testing.
   */
  clear(): void {
    this.stores.clear();
  }
}

/**
 * A store for active date ranges. This notifies calendar items when their state
 * changes, allowing just the affected items to re-render.
 *
 * While this is an implementation detail focused on improving performance, it's
 * exported in case you need to build your own calendar. Check the source code
 * for a reference implementation.
 */
export const activeDateRangesStore = new DateRangeStore();

/**
 * Returns an optimized metadata for a particular day. This hook listens to the
 * date range store, enabling only the affected calendar items to re-render.
 *
 * While this is an implementation detail focused on improving performance, it's
 * exported in case you need to build your own calendar. Check the source code
 * for a reference implementation.
 */
export const useOptimizedDayMetadata = (
  baseMetadata: CalendarDayMetadata,
  calendarInstanceId?: string
) => {
  const safeCalendarInstanceId =
    calendarInstanceId ?? DEFAULT_CALENDAR_INSTANCE_ID;

  const ranges = useSyncExternalStore(
    (callback) => activeDateRangesStore.subscribe(safeCalendarInstanceId, callback),
    () => activeDateRangesStore.getSnapshot(safeCalendarInstanceId)
  );

  return useMemo(() => {
    // We're only interested in the active date ranges, no need to worry about
    // disabled states. These are already covered by the base metadata.
    const { isStartOfRange, isEndOfRange, isRangeValid, state } =
      getStateFields({
        id: baseMetadata.id,
        calendarActiveDateRanges: ranges,
      });

    if (state === "active") {
      return {
        ...baseMetadata,
        isStartOfRange,
        isEndOfRange,
        isRangeValid,
        state,
      };
    }

    // Return the base metadata directly when idle - same ref means memo() bails out
    return baseMetadata;
  }, [baseMetadata, ranges]);
};
