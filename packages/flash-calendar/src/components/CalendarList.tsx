import { FlashList, FlashListProps } from "@shopify/flash-list";
import { startOfMonth } from "date-fns";
import {
  Ref,
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { View } from "react-native";

import { Calendar, CalendarProps } from "@/components/Calendar";
import { toDateId } from "@/helpers/dates";
import {
  CalendarMonth,
  getHeightForMonth,
  useCalendarList,
} from "@/hooks/useCalendarList";

/**
 * Represents each `CalendarList` item. It's enhanced with the required
 * `Calendar` props to simplify building custom `Calendar` components.
 */
export type CalendarMonthEnhanced = CalendarMonth & {
  calendarProps: Omit<CalendarProps, "calendarMonthId">;
};

const keyExtractor = (month: CalendarMonth) => month.id;

export interface CalendarListProps
  extends Omit<CalendarProps, "calendarMonthId">,
    Omit<FlashListProps<CalendarMonthEnhanced>, "renderItem" | "data"> {
  /**
   * How many months to show before the current month
   * @default 12
   */
  calendarPastScrollRangeInMonths?: number;
  /**
   * How many months to show after the current month.
   * @default 12
   */
  calendarFutureScrollRangeInMonths?: number;

  /**
   * An additional height to use in the month's height calculation. Useful when
   * providing a custom `Calendar` component with extra content such as a
   * footer.
   */
  calendarAdditionalHeight?: number;

  /**
   * The vertical spacing between each `<Calendar />` component.
   * @default 20
   */
  calendarSpacing?: number;

  /**
   * The initial month to open the calendar to, as a `YYYY-MM-DD` string.
   * Defaults to the current month.
   *
   * **Tip**: To convert to date ID, use `toDateId(date)`.
   */
  calendarInitialMonthId?: string;

  /**
   * The scroll component to use. Useful if you need to replace the FlashList
   * with an alternative (e.g. a BottomSheet FlashList).
   * @default FlashList
   */
  CalendarScrollComponent?: typeof FlashList;

  /**
   * Overwrites the default `Calendar` component.
   *
   * **Important**: when providing a custom implementation, make sure to
   * manually set all the spacing and height props to ensure the list scrolls
   * to the right offset:
   * - calendarDayHeight
   * - calendarMonthHeaderHeight
   * - calendarWeekHeaderHeight
   * - calendarAdditionalHeight
   * - calendarRowVerticalSpacing
   * - calendarSpacing
   */
  renderItem?: FlashListProps<CalendarMonthEnhanced>["renderItem"];
}

export type CalendarListRef = {
  scrollToDate: (date: Date, animated: boolean) => void;
};

export const CalendarList = memo(
  forwardRef(
    (
      {
        // List-related props
        calendarInitialMonthId,
        calendarPastScrollRangeInMonths = 12,
        calendarFutureScrollRangeInMonths = 12,
        calendarFirstDayOfWeek = "sunday",
        CalendarScrollComponent = FlashList,

        // Spacings
        calendarSpacing = 20,
        calendarRowHorizontalSpacing,
        calendarRowVerticalSpacing = 8,

        // Heights
        calendarMonthHeaderHeight = 20,
        calendarDayHeight = 32,
        calendarWeekHeaderHeight = calendarDayHeight,
        calendarAdditionalHeight = 0,

        // Other props
        theme,
        ...props
      }: CalendarListProps,
      ref: Ref<CalendarListRef>
    ) => {
      const {
        onDayPress,
        calendarActiveDateRanges: activeDateRanges,
        calendarDisabledDateIds,
        calendarDayFormat,
        calendarWeekDayFormat,
        calendarMonthFormat,
        calendarMaxDateId,
        calendarMinDateId,
        ...flatListProps
      } = props;

      const calendarProps = useMemo(
        (): CalendarMonthEnhanced["calendarProps"] => ({
          calendarActiveDateRanges: activeDateRanges,
          calendarDayHeight,
          calendarFirstDayOfWeek,
          calendarDayFormat,
          calendarWeekDayFormat,
          calendarMaxDateId,
          calendarMinDateId,
          calendarMonthHeaderHeight,
          calendarRowHorizontalSpacing,
          calendarMonthFormat,
          calendarRowVerticalSpacing,
          calendarWeekHeaderHeight,
          calendarDisabledDateIds,
          onDayPress,
          theme,
        }),
        [
          activeDateRanges,
          calendarDayHeight,
          calendarFirstDayOfWeek,
          calendarDayFormat,
          calendarWeekDayFormat,
          calendarMaxDateId,
          calendarMinDateId,
          calendarMonthHeaderHeight,
          calendarRowHorizontalSpacing,
          calendarMonthFormat,
          calendarRowVerticalSpacing,
          calendarWeekHeaderHeight,
          calendarDisabledDateIds,
          onDayPress,
          theme,
        ]
      );

      const { initialMonthIndex, monthList, appendMonths, addMissingMonths } =
        useCalendarList({
          calendarFirstDayOfWeek,
          calendarFutureScrollRangeInMonths,
          calendarPastScrollRangeInMonths,
          calendarInitialMonthId,
          calendarMaxDateId,
          calendarMinDateId,
        });

      console.log(`Months size: ${monthList.length}`);
      const monthListWithCalendarProps = useMemo(() => {
        return monthList.map((month) => ({
          ...month,
          calendarProps,
        }));
      }, [calendarProps, monthList]);

      const handleOnEndReached = useCallback(() => {
        appendMonths(calendarFutureScrollRangeInMonths);
      }, [appendMonths, calendarFutureScrollRangeInMonths]);

      const handleOverrideItemLayout = useCallback<
        NonNullable<FlashListProps<CalendarMonth>["overrideItemLayout"]>
      >(
        (layout, item) => {
          const monthHeight = getHeightForMonth({
            calendarMonth: item,
            calendarSpacing,
            calendarDayHeight,
            calendarMonthHeaderHeight,
            calendarRowVerticalSpacing,
            calendarAdditionalHeight,
            calendarWeekHeaderHeight,
          });
          layout.size = monthHeight;
        },
        [
          calendarAdditionalHeight,
          calendarDayHeight,
          calendarMonthHeaderHeight,
          calendarRowVerticalSpacing,
          calendarSpacing,
          calendarWeekHeaderHeight,
        ]
      );

      const flashListRef = useRef<FlashList<CalendarMonthEnhanced>>(null);

      useImperativeHandle(ref, () => ({
        scrollToDate(date, animated) {
          const monthId = toDateId(startOfMonth(date));

          let baseMonthList = monthList;
          let index = baseMonthList.findIndex((month) => month.id === monthId);

          if (index === -1) {
            baseMonthList = addMissingMonths(monthId);
            index = baseMonthList.findIndex((month) => month.id === monthId);
          }

          const currentOffset = baseMonthList
            .slice(0, index)
            .reduce((acc, month) => {
              const currentHeight = getHeightForMonth({
                calendarMonth: month,
                calendarSpacing,
                calendarDayHeight,
                calendarMonthHeaderHeight,
                calendarRowVerticalSpacing,
                calendarWeekHeaderHeight,
                calendarAdditionalHeight,
              });

              return acc + currentHeight;
            }, 0);

          // Wait for the next render cycle to ensure the list has been
          // updated with the new months.
          setTimeout(() => {
            flashListRef.current?.scrollToOffset({
              offset: currentOffset,
              animated,
            });
          }, 0);
        },
      }));

      const calendarContainerStyle = useMemo(() => {
        return { paddingBottom: calendarSpacing };
      }, [calendarSpacing]);

      return (
        <CalendarScrollComponent
          data={monthListWithCalendarProps}
          estimatedItemSize={273}
          initialScrollIndex={initialMonthIndex}
          keyExtractor={keyExtractor}
          onEndReached={handleOnEndReached}
          overrideItemLayout={handleOverrideItemLayout}
          ref={flashListRef}
          renderItem={({ item }) => (
            <View style={calendarContainerStyle}>
              <Calendar calendarMonthId={item.id} {...item.calendarProps} />
            </View>
          )}
          showsVerticalScrollIndicator={false}
          {...flatListProps}
        />
      );
    }
  )
);
