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
  return new Date(dateId);
}

/**
 * FIXME: does this really impact bundle-size?
 */

// /**
//  * Returns the first day of the month for the given date.
//  */
// export function startOfMonth(date: Date) {
//   return new Date(date.getFullYear(), date.getMonth(), 1);
// }

// /**
//  * Returns the first day of the week for the given date.
//  */
// export function startOfWeek(
//   baseDate: Date,
//   firstDayOfWeek: "monday" | "sunday"
// ): Date {
//   // Clone the baseDate to avoid modifying the original date
//   const date = new Date(baseDate.getTime());

//   // Calculate the day of the week (0 for Sunday, 1 for Monday, etc.)
//   const dayOfWeek = date.getDay();
//   const isSunday = dayOfWeek === 0;

//   if (isSunday && firstDayOfWeek === "monday") {
//     date.setDate(date.getDate() - 6);
//     return date;
//   }

//   // Calculate the difference between the current day and the first day of the week
//   const diff = dayOfWeek - (firstDayOfWeek === "monday" ? 1 : 0);
//   date.setDate(date.getDate() - diff);

//   return date;
// }
