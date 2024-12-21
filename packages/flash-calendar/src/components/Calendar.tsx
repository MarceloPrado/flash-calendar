import { memo, useEffect } from "react";
import type { ColorSchemeName } from "react-native";

import type {
  CalendarItemDayContainerProps,
  CalendarItemDayProps,
} from "@/components/CalendarItemDay";
import {
  CalendarItemDayContainer,
  CalendarItemDayWithContainer,
} from "@/components/CalendarItemDay";
import type { CalendarItemEmptyProps } from "@/components/CalendarItemEmpty";
import { CalendarItemEmpty } from "@/components/CalendarItemEmpty";
import type { CalendarItemWeekNameProps } from "@/components/CalendarItemWeekName";
import { CalendarItemWeekName } from "@/components/CalendarItemWeekName";
import type { CalendarRowMonthProps } from "@/components/CalendarRowMonth";
import { CalendarRowMonth } from "@/components/CalendarRowMonth";
import type { CalendarRowWeekProps } from "@/components/CalendarRowWeek";
import { CalendarRowWeek } from "@/components/CalendarRowWeek";
import { VStack } from "@/components/VStack";
import { uppercaseFirstLetter } from "@/helpers/strings";
import type { BaseTheme } from "@/helpers/tokens";
import type { UseCalendarParams } from "@/hooks/useCalendar";
import { useCalendar } from "@/hooks/useCalendar";
import { activeDateRangesEmitter } from "@/hooks/useOptimizedDayMetadata";
import { CalendarThemeProvider } from "@/components/CalendarThemeProvider";

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
   * need to render more than one calendar at once. This allows Flash Calendar
   * to scope its state to the given instance.
   *
   * No need to get fancy with `uuid` or anything like that - a simple static
   * string is enough.
   *
   * If not provided, Flash Calendar will use a default value which will hoist
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
   * When set, Flash Calendar will use this color scheme instead of the system's
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
}

const BaseCalendar = memo(function BaseCalendar(props: CalendarProps) {
  const {
    calendarInstanceId,
    calendarRowVerticalSpacing = 8,
    calendarRowHorizontalSpacing = 8,
    calendarDayHeight = 32,
    calendarMonthHeaderHeight = 20,
    calendarWeekHeaderHeight = calendarDayHeight,
    onCalendarDayPress,
    theme,

    ...buildCalendarParams
  } = props;

  const { calendarRowMonth, weeksList, weekDaysList } =
    useCalendar(buildCalendarParams);

  return (
    <VStack
      alignItems="center"
      spacing={calendarRowVerticalSpacing as keyof BaseTheme["spacing"]}
    >
      <CalendarRowMonth
        height={calendarMonthHeaderHeight}
        theme={theme?.rowMonth}
      >
        {uppercaseFirstLetter(calendarRowMonth)}
      </CalendarRowMonth>
      <CalendarRowWeek spacing={8} theme={theme?.rowWeek}>
        {weekDaysList.map((weekDay, i) => (
          <CalendarItemWeekName
            height={calendarWeekHeaderHeight}
            key={i}
            theme={theme?.itemWeekName}
          >
            {weekDay}
          </CalendarItemWeekName>
        ))}
      </CalendarRowWeek>
      {weeksList.map((week, index) => (
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
      ))}
    </VStack>
  );
});

export const Calendar = memo(function Calendar(props: CalendarProps) {
  const {
    calendarInstanceId,
    calendarActiveDateRanges,
    calendarMonthId,
    calendarColorScheme,
    ...otherProps
  } = props;
  useEffect(() => {
    activeDateRangesEmitter.emit("onSetActiveDateRanges", {
      instanceId: calendarInstanceId,
      ranges: calendarActiveDateRanges ?? [],
    });
    /**
     * While `calendarMonthId` is not used by the effect, we still need it in
     * the dependency array since [FlashList uses recycling
     * internally](https://shopify.github.io/flash-list/docs/recycling).
     *
     * This means `Calendar` can re-render with different props instead of
     * getting re-mounted. Without it, we would see staled/invalid data, as
     * reported by
     * [#11](https://github.com/MarceloPrado/flash-calendar/issues/11).
     */
  }, [calendarActiveDateRanges, calendarInstanceId, calendarMonthId]);

  return (
    <CalendarThemeProvider colorScheme={calendarColorScheme}>
      <BaseCalendar
        {...otherProps}
        calendarInstanceId={calendarInstanceId}
        calendarMonthId={calendarMonthId}
      />
    </CalendarThemeProvider>
  );
});
