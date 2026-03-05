import { memo, useEffect } from "react";
import type { ColorSchemeName, PressableProps } from "react-native";
import { c as _c } from "react/compiler-runtime";

import type {
  CalendarItemDayContainerProps,
  CalendarItemDayProps,
} from "@/components/CalendarItemDay";
import { CalendarItemDayWithContainer } from "@/components/CalendarItemDay";
import type { CalendarItemEmptyProps } from "@/components/CalendarItemEmpty";
import { CalendarItemEmpty } from "@/components/CalendarItemEmpty";
import type { CalendarItemWeekNameProps } from "@/components/CalendarItemWeekName";
import { CalendarItemWeekName } from "@/components/CalendarItemWeekName";
import type { CalendarRowMonthProps } from "@/components/CalendarRowMonth";
import { CalendarRowMonth } from "@/components/CalendarRowMonth";
import type { CalendarRowWeekProps } from "@/components/CalendarRowWeek";
import { CalendarRowWeek } from "@/components/CalendarRowWeek";
import { CalendarThemeProvider } from "@/components/CalendarThemeProvider";
import { VStack } from "@/components/VStack";
import { uppercaseFirstLetter } from "@/helpers/strings";
import type { BaseTheme } from "@/helpers/tokens";
import type { UseCalendarParams } from "@/hooks/useCalendar";
import { useCalendar } from "@/hooks/useCalendar";
import { activeDateRangesStore } from "@/hooks/useOptimizedDayMetadata";

export type PressableLike = React.ComponentType<
  Pick<PressableProps, "children" | "style" | "disabled"> & {
    onPress: () => void;
  }
>;

export interface CalendarTheme {
  rowMonth?: CalendarRowMonthProps["theme"];
  rowWeek?: CalendarRowWeekProps["theme"];
  itemWeekName?: CalendarItemWeekNameProps["theme"];
  itemEmpty?: CalendarItemEmptyProps["theme"];
  itemDayContainer?: CalendarItemDayContainerProps["theme"];
  /**
   * The theme for the day. `base` is applied before any state, allowing you to
   * set a base value once and use it for all states.
   */
  itemDay?: CalendarItemDayProps["theme"];
}

export type CalendarOnDayPress = (dateId: string) => void;

export interface CalendarProps extends UseCalendarParams {
  /**
   * A unique identifier for this calendar instance. This is useful if you
   * need to render more than one calendar at once. This allows Legend Calendar
   * to scope its state to the given instance.
   *
   * No need to get fancy with `uuid` or anything like that - a simple static
   * string is enough.
   *
   * If not provided, Legend Calendar will use a default value which will hoist
   * the state in a global scope.
   */
  calendarInstanceId?: string;
  /**
   * The spacing between each calendar row (the month header, the week days row,
   * and the weeks row)
   * @defaultValue 8
   */
  calendarRowVerticalSpacing?: number;
  /**
   * The spacing between each day in the weeks row.
   * @defaultValue 8
   */
  calendarRowHorizontalSpacing?: number;
  /**
   * The height of each day cell.
   * @defaultValue 32
   */
  calendarDayHeight?: number;
  /**
   * The height of the week day's header.
   * @defaultValue calendarDayHeight
   */
  calendarWeekHeaderHeight?: number;
  /**
   * The height of the month header.
   * @defaultValue 20
   */
  calendarMonthHeaderHeight?: number;
  /**
   * When set, Legend Calendar will use this color scheme instead of the system's
   * value (`light|dark`). This is useful if your app doesn't support dark-mode,
   * for example.
   *
   * We don't advise using this prop - ideally, your app should reflect the
   * user's preferences.
   * @defaultValue undefined
   */
  calendarColorScheme?: ColorSchemeName;
  /**
   * The callback to be called when a day is pressed.
   */
  onCalendarDayPress: CalendarOnDayPress;
  /** Theme to customize the calendar component. */
  theme?: CalendarTheme;
  /** Optional component to replace the default <Pressable> component. */
  CalendarPressableComponent?: PressableLike;
}

const BaseCalendar = memo(function BaseCalendar(props) {
  const $ = _c(51);
  let CalendarPressableComponent;
  let buildCalendarParams;
  let calendarInstanceId;
  let onCalendarDayPress;
  let t0;
  let t1;
  let t2;
  let t3;
  let t4;
  let theme;
  if ($[0] !== props) {
    ({
      calendarInstanceId,
      calendarRowVerticalSpacing: t0,
      calendarRowHorizontalSpacing: t1,
      calendarDayHeight: t2,
      calendarMonthHeaderHeight: t3,
      calendarWeekHeaderHeight: t4,
      onCalendarDayPress,
      theme,
      CalendarPressableComponent,
      ...buildCalendarParams
    } = props);
    $[0] = props;
    $[1] = CalendarPressableComponent;
    $[2] = buildCalendarParams;
    $[3] = calendarInstanceId;
    $[4] = onCalendarDayPress;
    $[5] = t0;
    $[6] = t1;
    $[7] = t2;
    $[8] = t3;
    $[9] = t4;
    $[10] = theme;
  } else {
    CalendarPressableComponent = $[1];
    buildCalendarParams = $[2];
    calendarInstanceId = $[3];
    onCalendarDayPress = $[4];
    t0 = $[5];
    t1 = $[6];
    t2 = $[7];
    t3 = $[8];
    t4 = $[9];
    theme = $[10];
  }
  const calendarRowVerticalSpacing = t0 === undefined ? 8 : t0;
  const calendarRowHorizontalSpacing = t1 === undefined ? 8 : t1;
  const calendarDayHeight = t2 === undefined ? 32 : t2;
  const calendarMonthHeaderHeight = t3 === undefined ? 20 : t3;
  const calendarWeekHeaderHeight = t4 === undefined ? calendarDayHeight : t4;

  const { calendarRowMonth, weeksList, weekDaysList } =
    useCalendar(buildCalendarParams);

  const t5 = calendarRowVerticalSpacing as keyof BaseTheme["spacing"];

  const t6 = theme?.rowMonth;
  let t7;
  if ($[11] !== calendarRowMonth) {
    t7 = uppercaseFirstLetter(calendarRowMonth);
    $[11] = calendarRowMonth;
    $[12] = t7;
  } else {
    t7 = $[12];
  }
  let t8;
  if ($[13] !== calendarMonthHeaderHeight || $[14] !== t6 || $[15] !== t7) {
    t8 = (
      <CalendarRowMonth height={calendarMonthHeaderHeight} theme={t6}>
        {t7}
      </CalendarRowMonth>
    );
    $[13] = calendarMonthHeaderHeight;
    $[14] = t6;
    $[15] = t7;
    $[16] = t8;
  } else {
    t8 = $[16];
  }
  const t9 = theme?.rowWeek;
  let t10;
  if (
    $[17] !== calendarWeekHeaderHeight ||
    $[18] !== theme?.itemWeekName ||
    $[19] !== weekDaysList
  ) {
    let t11;
    if ($[21] !== calendarWeekHeaderHeight || $[22] !== theme?.itemWeekName) {
      t11 = (weekDay, i) => (
        <CalendarItemWeekName
          height={calendarWeekHeaderHeight}
          key={i}
          theme={theme?.itemWeekName}
        >
          {weekDay}
        </CalendarItemWeekName>
      );
      $[21] = calendarWeekHeaderHeight;
      $[22] = theme?.itemWeekName;
      $[23] = t11;
    } else {
      t11 = $[23];
    }
    t10 = weekDaysList.map(t11);
    $[17] = calendarWeekHeaderHeight;
    $[18] = theme?.itemWeekName;
    $[19] = weekDaysList;
    $[20] = t10;
  } else {
    t10 = $[20];
  }
  let t11;
  if ($[24] !== t10 || $[25] !== t9) {
    t11 = (
      <CalendarRowWeek spacing={8} theme={t9}>
        {t10}
      </CalendarRowWeek>
    );
    $[24] = t10;
    $[25] = t9;
    $[26] = t11;
  } else {
    t11 = $[26];
  }
  let t12;
  if (
    $[27] !== CalendarPressableComponent ||
    $[28] !== calendarDayHeight ||
    $[29] !== calendarInstanceId ||
    $[30] !== calendarRowHorizontalSpacing ||
    $[31] !== onCalendarDayPress ||
    $[32] !== theme?.itemDay ||
    $[33] !== theme?.itemDayContainer ||
    $[34] !== theme?.itemEmpty ||
    $[35] !== weeksList
  ) {
    let t13;
    if (
      $[37] !== CalendarPressableComponent ||
      $[38] !== calendarDayHeight ||
      $[39] !== calendarInstanceId ||
      $[40] !== calendarRowHorizontalSpacing ||
      $[41] !== onCalendarDayPress ||
      $[42] !== theme?.itemDay ||
      $[43] !== theme?.itemDayContainer ||
      $[44] !== theme?.itemEmpty
    ) {
      t13 = (week, index) => (
        <CalendarRowWeek key={index}>
          {week.map((dayProps) => {
            if (dayProps.isDifferentMonth) {
              return (
                <CalendarItemDayContainer
                  dayHeight={calendarDayHeight}
                  daySpacing={calendarRowHorizontalSpacing}
                  isStartOfWeek={dayProps.isStartOfWeek}
                  key={dayProps.id}
                  metadata={dayProps}
                  theme={theme?.itemDayContainer}
                >
                  <CalendarItemEmpty
                    height={calendarDayHeight}
                    theme={theme?.itemEmpty}
                  />
                </CalendarItemDayContainer>
              );
            }
            return (
              <CalendarItemDayWithContainer
                CalendarPressableComponent={CalendarPressableComponent}
                calendarInstanceId={calendarInstanceId}
                containerTheme={theme?.itemDayContainer}
                dayHeight={calendarDayHeight}
                daySpacing={calendarRowHorizontalSpacing}
                key={dayProps.id}
                metadata={dayProps}
                onPress={onCalendarDayPress}
                theme={theme?.itemDay}
              >
                {dayProps.displayLabel}
              </CalendarItemDayWithContainer>
            );
          })}
        </CalendarRowWeek>
      );
      $[37] = CalendarPressableComponent;
      $[38] = calendarDayHeight;
      $[39] = calendarInstanceId;
      $[40] = calendarRowHorizontalSpacing;
      $[41] = onCalendarDayPress;
      $[42] = theme?.itemDay;
      $[43] = theme?.itemDayContainer;
      $[44] = theme?.itemEmpty;
      $[45] = t13;
    } else {
      t13 = $[45];
    }
    t12 = weeksList.map(t13);
    $[27] = CalendarPressableComponent;
    $[28] = calendarDayHeight;
    $[29] = calendarInstanceId;
    $[30] = calendarRowHorizontalSpacing;
    $[31] = onCalendarDayPress;
    $[32] = theme?.itemDay;
    $[33] = theme?.itemDayContainer;
    $[34] = theme?.itemEmpty;
    $[35] = weeksList;
    $[36] = t12;
  } else {
    t12 = $[36];
  }
  let t13;
  if ($[46] !== t11 || $[47] !== t12 || $[48] !== t5 || $[49] !== t8) {
    t13 = (
      <VStack alignItems="center" spacing={t5}>
        {t8}
        {t11}
        {t12}
      </VStack>
    );
    $[46] = t11;
    $[47] = t12;
    $[48] = t5;
    $[49] = t8;
    $[50] = t13;
  } else {
    t13 = $[50];
  }
  return t13;
});

export const Calendar = memo(function Calendar(props) {
  const $ = _c(20);
  let calendarActiveDateRanges;
  let calendarColorScheme;
  let calendarInstanceId;
  let calendarMonthId;
  let otherProps;
  if ($[0] !== props) {
    ({
      calendarInstanceId,
      calendarActiveDateRanges,
      calendarMonthId,
      calendarColorScheme,
      ...otherProps
    } = props);
    $[0] = props;
    $[1] = calendarActiveDateRanges;
    $[2] = calendarColorScheme;
    $[3] = calendarInstanceId;
    $[4] = calendarMonthId;
    $[5] = otherProps;
  } else {
    calendarActiveDateRanges = $[1];
    calendarColorScheme = $[2];
    calendarInstanceId = $[3];
    calendarMonthId = $[4];
    otherProps = $[5];
  }
  let t0;
  if ($[6] !== calendarActiveDateRanges || $[7] !== calendarInstanceId) {
    t0 = () => {
      if (calendarActiveDateRanges === undefined) {
        return;
      }
      activeDateRangesStore.setRanges(
        calendarInstanceId ?? "legend-calendar-default-instance",
        calendarActiveDateRanges
      );
    };
    $[6] = calendarActiveDateRanges;
    $[7] = calendarInstanceId;
    $[8] = t0;
  } else {
    t0 = $[8];
  }
  let t1;
  if (
    $[9] !== calendarActiveDateRanges ||
    $[10] !== calendarInstanceId ||
    $[11] !== calendarMonthId
  ) {
    t1 = [calendarActiveDateRanges, calendarInstanceId, calendarMonthId];
    $[9] = calendarActiveDateRanges;
    $[10] = calendarInstanceId;
    $[11] = calendarMonthId;
    $[12] = t1;
  } else {
    t1 = $[12];
  }
  useEffect(t0, t1);
  let t2;
  if (
    $[13] !== calendarInstanceId ||
    $[14] !== calendarMonthId ||
    $[15] !== otherProps
  ) {
    t2 = (
      <BaseCalendar
        {...otherProps}
        calendarInstanceId={calendarInstanceId}
        calendarMonthId={calendarMonthId}
      />
    );
    $[13] = calendarInstanceId;
    $[14] = calendarMonthId;
    $[15] = otherProps;
    $[16] = t2;
  } else {
    t2 = $[16];
  }
  let t3;
  if ($[17] !== calendarColorScheme || $[18] !== t2) {
    t3 = (
      <CalendarThemeProvider colorScheme={calendarColorScheme}>
        {t2}
      </CalendarThemeProvider>
    );
    $[17] = calendarColorScheme;
    $[18] = t2;
    $[19] = t3;
  } else {
    t3 = $[19];
  }
  return t3;
});
