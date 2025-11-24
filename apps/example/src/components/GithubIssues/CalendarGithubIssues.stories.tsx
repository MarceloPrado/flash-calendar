import {
  Calendar,
  toDateId,
  useDateRange,
} from "@marceloterreiro/flash-calendar";
import type { Meta } from "@storybook/react-native";
import { addDays, format } from "date-fns";
import { useEffect, useState } from "react";
import { View } from "react-native";

const CalendarMeta: Meta<typeof Calendar> = {
  title: "Calendar/Github Issues",
  decorators: [],
};

export default CalendarMeta;

const today = toDateId(new Date());
const todayPlusFive = toDateId(addDays(new Date(), 5));

// See more: https://github.com/MarceloPrado/flash-calendar/issues/69
export const Issue69 = () => {
  // This state is simplified for the example. In my case it would come from a context.
  const [start, setStart] = useState<string | undefined>(today);
  const [end, setEnd] = useState<string | undefined>(todayPlusFive);

  const { onCalendarDayPress, isDateRangeValid, calendarActiveDateRanges } =
    useDateRange({ startId: start, endId: end }); // I am setting the default range here because I want the data from my context to be pre-selected here

  useEffect(() => {
    // Every time the selected range changed I want to update my context (in this example the state)
    if (isDateRangeValid && calendarActiveDateRanges.length > 0) {
      const range = calendarActiveDateRanges[0];
      setStart(range.startId);
      setEnd(range?.endId);
    }
  }, [calendarActiveDateRanges, isDateRangeValid]);

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        calendarActiveDateRanges={calendarActiveDateRanges}
        calendarColorScheme="light"
        calendarFirstDayOfWeek="monday"
        calendarMonthId={today}
        getCalendarWeekDayFormat={formatWeekDay}
        // getCalendarWeekDayFormat={(date) => format(date, "EEEEEE")}
        onCalendarDayPress={onCalendarDayPress}
      />
    </View>
  );
};

const formatWeekDay = (date: Date) => format(date, "EEEEEE");
