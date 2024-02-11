import { Calendar as CalendarDefault } from "@/components/Calendar";
import {
  CalendarItemDay,
  CalendarItemEmpty,
} from "@/components/CalendarItemDay";
import { CalendarItemWeekName } from "@/components/CalendarItemWeekName";
// import { CalendarList } from "@/components/CalendarList";
import { CalendarRowMonth } from "@/components/CalendarRowMonth";
import { CalendarRowWeek } from "@/components/CalendarRowWeek";

type CalendarItemNamespace = {
  Day: typeof CalendarItemDay;
  WeekName: typeof CalendarItemWeekName;
  Empty: typeof CalendarItemEmpty;
};

const CalendarItemWithNamespace = {} as CalendarItemNamespace;
CalendarItemWithNamespace.Day = CalendarItemDay;
CalendarItemWithNamespace.WeekName = CalendarItemWeekName;
CalendarItemWithNamespace.Empty = CalendarItemEmpty;

type CalendarRowNamespace = {
  Month: typeof CalendarRowMonth;
  Week: typeof CalendarRowWeek;
};

const CalendarRowWithNamespace = {} as CalendarRowNamespace;
CalendarRowWithNamespace.Month = CalendarRowMonth;
CalendarRowWithNamespace.Week = CalendarRowWeek;

type CalendarNamespace = {
  Item: typeof CalendarItemWithNamespace;
  Row: typeof CalendarRowWithNamespace;
  //   List: typeof CalendarList;
} & typeof CalendarDefault;

const CalendarWithNamespace = CalendarDefault as CalendarNamespace;
CalendarWithNamespace.Item = CalendarItemWithNamespace;
CalendarWithNamespace.Row = CalendarRowWithNamespace;
// CalendarWithNamespace.List = CalendarList;

export const Calendar = CalendarWithNamespace;
