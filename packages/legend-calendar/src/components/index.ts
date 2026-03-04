import { Calendar as CalendarDefault } from "@/components/Calendar";
import {
    CalendarItemDay,
    CalendarItemDayContainer,
    CalendarItemDayWithContainer,
} from "@/components/CalendarItemDay";
import { CalendarItemEmpty } from "@/components/CalendarItemEmpty";
import { CalendarItemWeekName } from "@/components/CalendarItemWeekName";
import { CalendarList } from "@/components/CalendarList";
import { CalendarRowMonth } from "@/components/CalendarRowMonth";
import { CalendarRowWeek } from "@/components/CalendarRowWeek";
import { HStack } from "@/components/HStack";
import { VStack } from "@/components/VStack";

/**
 * This file houses the public API for the legend-calendar package.
 */

type CalendarItemDayNamespace = {
  Container: typeof CalendarItemDayContainer;
  WithContainer: typeof CalendarItemDayWithContainer;
} & typeof CalendarItemDay;

const CalendarItemDayWithNamespace =
  CalendarItemDay as CalendarItemDayNamespace;

CalendarItemDayWithNamespace.Container = CalendarItemDayContainer;
CalendarItemDayWithNamespace.WithContainer = CalendarItemDayWithContainer;
export type {
    CalendarOnDayPress,
    CalendarProps,
    CalendarTheme
} from "@/components/Calendar";
export type {
    CalendarItemDayContainerProps,
    CalendarItemDayProps,
    CalendarItemDayWithContainerProps
} from "@/components/CalendarItemDay";
export type { CalendarItemEmptyProps } from "@/components/CalendarItemEmpty";
export type { CalendarItemWeekNameProps } from "@/components/CalendarItemWeekName";
export type {
    CalendarListProps,
    CalendarListRef,
    CalendarMonthEnhanced
} from "@/components/CalendarList";
export type { CalendarRowMonthProps } from "@/components/CalendarRowMonth";
export type { CalendarRowWeekProps } from "@/components/CalendarRowWeek";
export type { HStackProps } from "@/components/HStack";
export type { CalendarTextProps } from "@/components/Text";
export type { VStackProps } from "@/components/VStack";

interface CalendarItemNamespace {
  /**
   * Renders the day item of the calendar (e.g. `1`, `2`, `3`, etc.)
   */
  Day: typeof CalendarItemDayWithNamespace;
  /**
   * Renders the week day name item of the calendar (e.g. `Sun`, `Mon`, `Tue`, etc.)
   */
  WeekName: typeof CalendarItemWeekName;
  /**
   * Renders an empty item to fill the calendar's grid in the start or end of
   * the month.
   */
  Empty: typeof CalendarItemEmpty;
}

const CalendarItemWithNamespace = {} as CalendarItemNamespace;
CalendarItemWithNamespace.Day = CalendarItemDayWithNamespace;

CalendarItemWithNamespace.WeekName = CalendarItemWeekName;

CalendarItemWithNamespace.Empty = CalendarItemEmpty;

interface CalendarRowNamespace {
  /**
   * Renders the month row of the calendar (e.g. `January`, `February`, `March`, etc.)
   */
  Month: typeof CalendarRowMonth;
  /**
   * Renders each week row of the calendar, including the week day names.
   */
  Week: typeof CalendarRowWeek;
}

const CalendarRowWithNamespace = {} as CalendarRowNamespace;
CalendarRowWithNamespace.Month = CalendarRowMonth;

CalendarRowWithNamespace.Week = CalendarRowWeek;

type CalendarNamespace = {
  Item: typeof CalendarItemWithNamespace;
  Row: typeof CalendarRowWithNamespace;
  List: typeof CalendarList;
  HStack: typeof HStack;
  VStack: typeof VStack;
} & typeof CalendarDefault;

const CalendarWithNamespace = CalendarDefault as CalendarNamespace;
CalendarWithNamespace.Item = CalendarItemWithNamespace;
CalendarWithNamespace.Row = CalendarRowWithNamespace;

CalendarWithNamespace.List = CalendarList;

// Useful for customizing the layout of the calendar, re-exported for convenience
CalendarWithNamespace.HStack = HStack;
CalendarWithNamespace.VStack = VStack;

export const Calendar = CalendarWithNamespace;
