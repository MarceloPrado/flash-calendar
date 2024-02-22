import { Calendar, useDateRange } from "@marceloterreiro/flash-calendar";

export const CalendarListDateRange = () => {
  const {
    calendarActiveDateRanges,
    onCalendarDayPress,
    // Also available:
    // dateRange, // { startId?: string, endId?: string }
    // isDateRangeValid, // boolean
    // onClearDateRange, // () => void
  } = useDateRange();
  return (
    <Calendar.List
      calendarActiveDateRanges={calendarActiveDateRanges}
      onCalendarDayPress={onCalendarDayPress}
    />
  );
};
