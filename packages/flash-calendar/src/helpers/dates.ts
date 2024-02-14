import { parseISO } from "date-fns";

/**
 * Returns the date formatted as YYYY-MM-DD, ensuring timezone doesn't affect
 * the result.
 */
export function toDateId(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();

  // Pad single digit month and day with leading zeros
  const monthFormatted = month < 10 ? `0${month}` : month;
  const dayFormatted = day < 10 ? `0${day}` : day;

  return `${year}-${monthFormatted}-${dayFormatted}`;
}

/**
 * Converts a date ID to a `Date` object, correctly accounting for timezone.
 */
export function fromDateId(dateId: string) {
  return parseISO(dateId);
}
