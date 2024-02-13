import { parseISO } from "date-fns";

/**
 * Returns the date formatted as YYYY-MM-DD, ensuring timezone doesn't affect
 * the result.
 */
export function toDateId(date: Date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Converts a date ID to a `Date` object, correctly accounting for timezone.
 */
export function fromDateId(dateId: string) {
  return parseISO(dateId);
}
