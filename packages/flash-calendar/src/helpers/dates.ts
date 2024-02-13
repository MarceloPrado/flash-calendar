// export const toDateId = (date: Date): string => format(date, "yyyy-MM-dd");

import { parseISO } from "date-fns";

/**
 * Returns the date formatted as YYYY-MM-DD, ensuring timezone doesn't affect
 * the result.
 */
export function toDateId(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function fromDateId(dateId: string) {
  return parseISO(dateId);
}
