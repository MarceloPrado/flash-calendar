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
  MonthShape,
  getHeightForMonth,
  useCalendarList,
} from "@/hooks/useCalendarList";

const keyExtractor = (month: MonthShape) => month.id;

export interface CalendarListProps
  extends Omit<CalendarProps, "calendarMonthId">,
    Omit<FlashListProps<MonthShape>, "renderItem" | "data"> {
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

        // Other props
        theme,
        ...props
      }: CalendarListProps,
      ref: Ref<CalendarListRef>
    ) => {
      const {
        onDayPress,
        calendarActiveDateRanges: activeDateRanges,
        disabledDates,
        calendarItemDayFormat,
        calendarItemWeekNameFormat,
        calendarRowMonthFormat,
        calendarMaxDateId,
        calendarMinDateId,
        ...flatListProps
      } = props;

      const calendarProps = useMemo(
        (): Omit<CalendarProps, "calendarMonthId"> => ({
          calendarActiveDateRanges: activeDateRanges,
          calendarDayHeight,
          calendarFirstDayOfWeek,
          calendarItemDayFormat,
          calendarItemWeekNameFormat,
          calendarMaxDateId,
          calendarMinDateId,
          calendarMonthHeaderHeight,
          calendarRowHorizontalSpacing,
          calendarRowMonthFormat,
          calendarRowVerticalSpacing,
          calendarWeekHeaderHeight,
          disabledDates,
          onDayPress,
          theme,
        }),
        [
          activeDateRanges,
          calendarDayHeight,
          calendarFirstDayOfWeek,
          calendarItemDayFormat,
          calendarItemWeekNameFormat,
          calendarMaxDateId,
          calendarMinDateId,
          calendarMonthHeaderHeight,
          calendarRowHorizontalSpacing,
          calendarRowMonthFormat,
          calendarRowVerticalSpacing,
          calendarWeekHeaderHeight,
          disabledDates,
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

      const handleOnEndReached = useCallback(() => {
        appendMonths(calendarFutureScrollRangeInMonths);
      }, [appendMonths, calendarFutureScrollRangeInMonths]);

      const handleOverrideItemLayout = useCallback<
        NonNullable<FlashListProps<MonthShape>["overrideItemLayout"]>
      >(
        (layout, item) => {
          const monthHeight = getHeightForMonth({
            month: item,
            spacing: calendarSpacing,
            calendarDayHeight,
            calendarMonthHeaderHeight,
            calendarRowVerticalSpacing,
            calendarWeekHeaderHeight,
          });

          layout.size = monthHeight;
        },
        [
          calendarDayHeight,
          calendarMonthHeaderHeight,
          calendarRowVerticalSpacing,
          calendarSpacing,
          calendarWeekHeaderHeight,
        ]
      );

      const flashListRef = useRef<FlashList<MonthShape>>(null);

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
                month,
                spacing: calendarSpacing,
                calendarDayHeight,
                calendarMonthHeaderHeight,
                calendarRowVerticalSpacing,
                calendarWeekHeaderHeight,
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
          data={monthList}
          estimatedItemSize={273}
          initialScrollIndex={initialMonthIndex}
          keyExtractor={keyExtractor}
          onEndReached={handleOnEndReached}
          overrideItemLayout={handleOverrideItemLayout}
          extraData={activeDateRanges}
          ref={flashListRef}
          renderItem={({ item }) => (
            <View style={calendarContainerStyle}>
              <Calendar calendarMonthId={item.id} {...calendarProps} />
            </View>
          )}
          showsVerticalScrollIndicator={false}
          {...flatListProps}
        />
      );
    }
  )
);
