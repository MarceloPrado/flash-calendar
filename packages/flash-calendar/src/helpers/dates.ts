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
  const [year, month, day] = dateId.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Returns the first day of the month for the given date.
 */
export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Returns the last day of the month for the given date.
 */
export function endOfMonth(date: Date) {
  const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  const lastDay = new Date(nextMonth.getTime() - 1);
  return new Date(lastDay);
}

/**
 * Returns the first day of the week for the given date.
 */
export function startOfWeek(
  baseDate: Date,
  firstDayOfWeek: "monday" | "sunday"
): Date {
  // Clone the baseDate to avoid modifying the original date
  const date = new Date(baseDate.getTime());

  // Calculate the day of the week (0 for Sunday, 1 for Monday, etc.)
  const dayOfWeek = date.getDay();
  const isSunday = dayOfWeek === 0;

  if (isSunday && firstDayOfWeek === "monday") {
    date.setDate(date.getDate() - 6);
    return date;
  }

  // Calculate the difference between the current day and the first day of the week
  const diff = dayOfWeek - (firstDayOfWeek === "monday" ? 1 : 0);
  date.setDate(date.getDate() - diff);

  return date;
}

/**
 * Add `n` months to the given date.
 */
export function addMonths(date: Date, months: number) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
}

/**
 * Subtract `n` months from the given date.
 */
export function subMonths(date: Date, months: number) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() - months);
  return newDate;
}

/**
 * Add `n` days to the given date.
 */
export function addDays(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

/**
 * Subtract `n` days from the given date.
 */
export function subDays(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - days);
  return newDate;
}

/**
 * Does the given date fall on a weekend?
 */
export function isWeekend(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Get the number of months between the given dates.
 */
export function differenceInMonths(laterDate: Date, earlierDate: Date) {
  const yearDiff = laterDate.getFullYear() - earlierDate.getFullYear();
  const monthDiff = laterDate.getMonth() - earlierDate.getMonth();

  return yearDiff * 12 + monthDiff;
}

/**
 * Get the number of weeks in the month for the given date.
 */
export function getWeeksInMonth(
  date: Date,
  firstDayOfWeek: "monday" | "sunday"
) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  let dayOfWeek = firstDay.getDay();

  // Adjust the first day of the week
  if (firstDayOfWeek === "monday") {
    dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  }

  const totalDays = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  return Math.ceil((dayOfWeek + totalDays) / 7);
}

/**
 * Get the week of the month of the given date. The week index is 1-based.
 */
export function getWeekOfMonth(
  date: Date,
  firstDayOfWeek: "monday" | "sunday"
) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  let dayOfWeek = firstDay.getDay();

  // Adjust the first day of the week
  if (firstDayOfWeek === "monday") {
    dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  }

  const dayOfMonth = date.getDate();

  return Math.floor((dayOfWeek + dayOfMonth - 1) / 7) + 1;
}
