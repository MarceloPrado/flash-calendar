import type { ListRenderItem } from "@shopify/flash-list";
import { FlashList } from "@shopify/flash-list";
import type { FlatListProps } from "react-native";
import { Dimensions, View } from "react-native";
import {
  activeDateRangesEmitter,
  type CalendarDayMetadata,
} from "@marceloterreiro/flash-calendar";
import { memo, useEffect } from "react";
import type { CalendarListProps, CalendarTheme } from "@/components";
import { Calendar } from "@/components";

import useWeeklyCalendar from "./useWeeklyCalendar";

export type WeeklyCalendarProps = CalendarListProps & {
  onWeekChanged?(week: CalendarDayMetadata[]): void;
};

const WEEK_DAYS_HEIGHT = 36;
const DAYS_HEGIHT = 48;
const DAYS_SPACING = 0;

const { width: screenWidth } = Dimensions.get("window");

const calendarTheme: CalendarTheme = {
  rowWeek: {
    container: {
      width: screenWidth,
    },
  },
};
export const WeeklyCalendar = memo(function WeeklyCalendar(
  props: WeeklyCalendarProps
) {
  const {
    calendarPastScrollRangeInMonths = 6,
    calendarFutureScrollRangeInMonths = 6,
    calendarFirstDayOfWeek = "sunday",
    calendarActiveDateRanges,
    calendarInstanceId,
    theme,
    onWeekChanged,
    ...rest
  } = props;

  const { weekDaysList, weekList } = useWeeklyCalendar({
    calendarPastScrollRangeInMonths,
    calendarFirstDayOfWeek,
    calendarFutureScrollRangeInMonths,
    ...rest,
  });

  useEffect(() => {
    activeDateRangesEmitter.emit("onSetActiveDateRanges", {
      ranges: calendarActiveDateRanges ?? [],
      instanceId: calendarInstanceId,
    });
  }, [calendarActiveDateRanges, calendarInstanceId]);

  const renderItem: ListRenderItem<CalendarDayMetadata[]> = ({
    item: week,
  }) => (
    <Calendar.Row.Week theme={calendarTheme.rowWeek}>
      {week.map((day) => (
        <Calendar.Item.Day.WithContainer
          dayHeight={DAYS_HEGIHT}
          daySpacing={DAYS_SPACING}
          key={day.id}
          metadata={day}
          onPress={rest.onCalendarDayPress}
        >
          {day.displayLabel}
        </Calendar.Item.Day.WithContainer>
      ))}
    </Calendar.Row.Week>
  );

  const handleWeekChanged: NonNullable<
    FlatListProps<CalendarDayMetadata[]>["onViewableItemsChanged"]
  > = (item) => {
    const visible = item.viewableItems.find((i) => i.isViewable);
    onWeekChanged?.(visible?.item);
  };

  return (
    <View>
      <Calendar.HStack>
        <Calendar.Row.Week>
          {weekDaysList.map((day, index) => (
            <Calendar.Item.WeekName
              height={WEEK_DAYS_HEIGHT}
              key={index}
              theme={theme?.itemWeekName}
            >
              {day}
            </Calendar.Item.WeekName>
          ))}
        </Calendar.Row.Week>
      </Calendar.HStack>
      <FlashList
        data={weekList}
        estimatedItemSize={screenWidth}
        horizontal
        onViewableItemsChanged={handleWeekChanged}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        snapToInterval={screenWidth}
      />
    </View>
  );
});
