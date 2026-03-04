import { useSyncExternalStore } from "react";

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
  cachedActiveByDayId: Map<
    string,
    {
      baseMetadata: CalendarDayMetadata;
      key: string;
      metadata: CalendarDayMetadata;
    }
  >;
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
        cachedActiveByDayId: new Map(),
      });
    }
    return this.stores.get(instanceId)!;
  }

  setRanges(instanceId: string, ranges: CalendarActiveDateRange[]): void {
    const store = this.getOrCreateStore(instanceId);

    // Bail out if the ranges haven't changed to avoid notifying all subscribers
    if (this.rangesEqual(store.ranges, ranges)) {
      return;
    }

    store.ranges = ranges;
    store.cachedActiveByDayId.clear();
    store.subscribers.forEach((callback) => callback());
  }

  private rangesEqual(
    a: CalendarActiveDateRange[],
    b: CalendarActiveDateRange[]
  ): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i].startId !== b[i].startId || a[i].endId !== b[i].endId) {
        return false;
      }
    }
    return true;
  }

  getSnapshot(instanceId: string): CalendarActiveDateRange[] {
    return this.getOrCreateStore(instanceId).ranges;
  }

  getDaySnapshot(
    instanceId: string,
    baseMetadata: CalendarDayMetadata
  ): CalendarDayMetadata {
    const store = this.getOrCreateStore(instanceId);

    const { isStartOfRange, isEndOfRange, isRangeValid, state } =
      getStateFields({
        id: baseMetadata.id,
        calendarActiveDateRanges: store.ranges,
      });

    if (state !== "active") {
      return baseMetadata;
    }

    const key = `${isStartOfRange ? 1 : 0}${isEndOfRange ? 1 : 0}${
      isRangeValid ? 1 : 0
    }`;

    const cached = store.cachedActiveByDayId.get(baseMetadata.id);
    if (cached && cached.baseMetadata === baseMetadata && cached.key === key) {
      return cached.metadata;
    }

    const metadata: CalendarDayMetadata = {
      ...baseMetadata,
      isStartOfRange,
      isEndOfRange,
      isRangeValid,
      state,
    };

    store.cachedActiveByDayId.set(baseMetadata.id, {
      baseMetadata,
      key,
      metadata,
    });

    return metadata;
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

  return useSyncExternalStore(
    (callback) =>
      activeDateRangesStore.subscribe(safeCalendarInstanceId, callback),
    () =>
      activeDateRangesStore.getDaySnapshot(safeCalendarInstanceId, baseMetadata)
  );
};
