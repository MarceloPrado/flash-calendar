import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";
import { subMonths } from "date-fns";
import { format } from "date-fns/fp";

const threeMonthsAgo = subMonths(new Date(), 3);

export const CalendarCustomFormatting = () => {
  return (
    <Calendar
      calendarMonthId={toDateId(threeMonthsAgo)}
      getCalendarDayFormat={format("dd")}
      getCalendarMonthFormat={format("MMMM yyyy (LL/yyyy)")}
      getCalendarWeekDayFormat={format("E")}
      onCalendarDayPress={(dateId) => {
        console.log(`Clicked on ${dateId}`);
      }}
    />
  );
};
