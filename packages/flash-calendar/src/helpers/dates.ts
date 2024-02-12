// export const toDateId = (date: Date): string => format(date, "yyyy-MM-dd");

import { parseISO } from "date-fns";

/**
 * Returns the date formatted as YYYY-MM-DD, ensuring timezone doesn't affect
 * the result.
 */
export function toDateId(date: Date) {
  // return date.toISOString().slice(0, 10);

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();

  // Pad single digit month and day with leading zeros
  const monthFormatted = month < 10 ? `0${month}` : month;
  const dayFormatted = day < 10 ? `0${day}` : day;

  return `${year}-${monthFormatted}-${dayFormatted}`;
}

export function fromDateId(dateId: string) {
  return parseISO(dateId);
}
