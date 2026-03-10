import { uppercaseFirstLetter } from "@/helpers/strings";
import type { CalendarProps } from "@lazerlen/legend-calendar";
import {
  Calendar,
  activeDateRangesStore,
  useCalendar,
} from "@lazerlen/legend-calendar";
import { memo, useEffect } from "react";
import { Text } from "react-native";

import { PerfTestCalendarItemDayWithContainer } from "./PerfTestCalendarItemDay";
import { useRenderCount } from "./useRenderCount";

const BasePerfTestCalendar = memo(
  ({
    onCalendarDayPress,
    calendarRowVerticalSpacing = 8,
    calendarRowHorizontalSpacing = 8,
    theme,
    calendarDayHeight = 48,
    calendarMonthHeaderHeight = 20,
    calendarWeekHeaderHeight = calendarDayHeight,

    ...buildCalendarParams
  }: CalendarProps) => {
    const { calendarRowMonth, weeksList, weekDaysList } =
      useCalendar(buildCalendarParams);

    const renderCounter = useRenderCount(calendarRowMonth);

    return (
      <Calendar.VStack alignItems="center" spacing={calendarRowVerticalSpacing}>
        <Calendar.Row.Month
          height={calendarMonthHeaderHeight}
          theme={theme?.rowMonth}
        >
          {uppercaseFirstLetter(calendarRowMonth)}
          <Text style={{ fontWeight: "bold" }}>
            {" "}
            (render: {renderCounter}x ⚡)
          </Text>
        </Calendar.Row.Month>
        <Calendar.Row.Week spacing={8} theme={theme?.rowWeek}>
          {weekDaysList.map((weekDay, i) => (
            <Calendar.Item.WeekName
              height={calendarWeekHeaderHeight}
              key={i}
              theme={theme?.itemWeekName}
            >
              {weekDay}
            </Calendar.Item.WeekName>
          ))}
        </Calendar.Row.Week>
        {weeksList.map((week, index) => (
          <Calendar.Row.Week
            key={index}
            spacing={
              calendarRowHorizontalSpacing as
                | 0
                | 2
                | 4
                | 6
                | 8
                | 12
                | 16
                | 20
                | 24
            }
          >
            {week.map((dayProps) => {
              if (dayProps.isDifferentMonth) {
                return (
                  <Calendar.Item.Day.Container
                    dayHeight={calendarDayHeight}
                    daySpacing={calendarRowHorizontalSpacing}
                    isStartOfWeek={dayProps.isStartOfWeek}
                    key={dayProps.id}
                    theme={theme?.itemDayContainer}
                  >
                    <Calendar.Item.Empty
                      height={calendarDayHeight}
                      theme={theme?.itemEmpty}
                    />
                  </Calendar.Item.Day.Container>
                );
              }

              return (
                <PerfTestCalendarItemDayWithContainer
                  containerTheme={theme?.itemDayContainer}
                  dayHeight={calendarDayHeight}
                  daySpacing={calendarRowHorizontalSpacing}
                  key={dayProps.id}
                  metadata={dayProps}
                  onPress={onCalendarDayPress}
                >
                  {dayProps.displayLabel}
                </PerfTestCalendarItemDayWithContainer>
              );
            })}
          </Calendar.Row.Week>
        ))}
      </Calendar.VStack>
    );
  }
);

BasePerfTestCalendar.displayName = "BasePerfTestCalendar";

export const PerfTestCalendar = memo(
  ({ calendarActiveDateRanges, calendarMonthId, ...props }: CalendarProps) => {
    useEffect(() => {
      activeDateRangesStore.setRanges(
        calendarMonthId,
        calendarActiveDateRanges ?? []
      );
      /**
       * While `calendarMonthId` is not used by the effect, we still need it in
       * the dependency array since [LegendList uses recycling
       * internally](https://www.legendapp.com/open-source/list/v2/performance/#recycling-list-items).
       *
       * This means `Calendar` can re-render with different props instead of
       * getting re-mounted. Without it, we would see staled/invalid data, as
       * reported by
       * [#11](https://github.com/MarceloPrado/flash-calendar/issues/11).
       */
    }, [calendarActiveDateRanges, calendarMonthId]);

    return (
      <BasePerfTestCalendar {...props} calendarMonthId={calendarMonthId} />
    );
  }
);
PerfTestCalendar.displayName = "PerfTestCalendar";
