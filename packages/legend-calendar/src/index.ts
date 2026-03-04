export * from "./components";
export { fromDateId, toDateId } from "./helpers/dates";

export {
  buildCalendar,
  useCalendar,
  type CalendarActiveDateRange,
  type CalendarDayMetadata,
  type UseCalendarParams,
} from "./hooks/useCalendar";

export {
  getHeightForMonth,
  useCalendarList,
  type CalendarMonth,
  type UseCalendarListParams,
} from "./hooks/useCalendarList";

export {
  activeDateRangesStore,
  useOptimizedDayMetadata,
} from "./hooks/useOptimizedDayMetadata";

export { useDateRange } from "./hooks/useDateRange";
