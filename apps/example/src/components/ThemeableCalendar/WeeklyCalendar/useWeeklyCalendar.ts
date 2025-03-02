import type {
  UseCalendarListParams,
  UseCalendarParams,
} from "@marceloterreiro/flash-calendar";
import {
  buildCalendar,
  useCalendarList,
} from "@marceloterreiro/flash-calendar";
import { useMemo } from "react";

type WeeklyCalendarProps = Omit<UseCalendarParams, "calendarMonthId"> &
  UseCalendarListParams;

function useWeeklyCalendar(props: WeeklyCalendarProps) {
  const {
    calendarFirstDayOfWeek,
    calendarDisabledDateIds,
    getCalendarDayFormat,
    getCalendarMonthFormat,
    getCalendarWeekDayFormat,
    calendarMinDateId,
    calendarMaxDateId,
    calendarFormatLocale,
  } = props;
  const { monthList } = useCalendarList(props);

  const calendar = useMemo(() => {
    const weeks = monthList.map((month) =>
      buildCalendar({
        calendarMonthId: month.id,
        calendarFirstDayOfWeek,
        calendarDisabledDateIds,
        getCalendarDayFormat,
        getCalendarMonthFormat,
        getCalendarWeekDayFormat,
        calendarMinDateId,
        calendarMaxDateId,
        calendarFormatLocale,
      })
    );

    return {
      weekList: weeks.flatMap((week) => week.weeksList),
      weekDaysList: weeks[0].weekDaysList,
    };
  }, [
    monthList,
    calendarFirstDayOfWeek,
    calendarDisabledDateIds,
    getCalendarDayFormat,
    getCalendarMonthFormat,
    getCalendarWeekDayFormat,
    calendarMinDateId,
    calendarMaxDateId,
    calendarFormatLocale,
  ]);

  return calendar;
}

export default useWeeklyCalendar;
