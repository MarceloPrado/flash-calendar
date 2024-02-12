import { FlashList, FlashListProps } from "@shopify/flash-list";
import { add, getWeeksInMonth, startOfMonth, sub } from "date-fns";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { View } from "react-native";

import { Calendar, CalendarProps } from "@/components/Calendar";
import { fromDateId, toDateId } from "@/helpers/dates";

type MonthShape = { id: string; date: Date; numberOfWeeks: number };

const keyExtractor = (month: MonthShape) => month.id;

export interface CalendarListProps
  extends Omit<CalendarProps, "calendarMonth">,
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
   * The spacing between each `<Calendar />` component.
   * @default 20
   */
  calendarSpacing?: number;

  /**
   * The initial month to open the calendar to, as a `YYYY-MM-DD` string.
   * @default today
   */
  calendarInitialMonthId?: string;

  /**
   * The scroll component to use. Useful if you need to replace the FlashList
   * with an alternative (e.g. a BottomSheet FlashList).
   * @default FlashList
   */
  CalendarScrollComponent?: typeof FlashList;
}

const getMonthHeight = ({
  calendarRowVerticalSpacing,
  calendarDayHeight,
  calendarWeekHeaderHeight,
  calendarMonthHeaderHeight,
  index,
  month,
  spacing,
}: {
  month: MonthShape;
  index: number;
  spacing: number;
  calendarMonthHeaderHeight: number;
  calendarRowVerticalSpacing: number;
  calendarDayHeight: number;
  calendarWeekHeaderHeight: number;
}) => {
  const headerHeight =
    calendarMonthHeaderHeight +
    calendarRowVerticalSpacing +
    calendarWeekHeaderHeight;

  const weekHeight = calendarDayHeight + calendarRowVerticalSpacing;

  return (
    headerHeight +
    month.numberOfWeeks * weekHeight +
    (index === 0 ? 0 : spacing)
  );
};

const buildMonthList = (
  startingMonth: Date,
  numberOfMonths: number,
  firstDayOfWeek: CalendarProps["calendarFirstDayOfWeek"] = "sunday"
): MonthShape[] => {
  const months = [
    {
      id: toDateId(startingMonth),
      date: startingMonth,
      numberOfWeeks: getWeeksInMonth(startingMonth, {
        weekStartsOn: firstDayOfWeek === "sunday" ? 0 : 1,
      }),
    },
  ];

  for (let i = 1; i <= numberOfMonths; i++) {
    const month = add(startingMonth, { months: i });
    const numberOfWeeks = getWeeksInMonth(month, {
      weekStartsOn: firstDayOfWeek === "sunday" ? 0 : 1,
    });

    months.push({
      id: toDateId(month),
      date: month,
      numberOfWeeks,
    });
  }
  return months;
};

export const CalendarList = memo(
  ({
    calendarInitialMonthId: baseInitialMonthId,
    calendarPastScrollRangeInMonths = 12,
    calendarFutureScrollRangeInMonths = 12,
    calendarFirstDayOfWeek = "sunday",
    CalendarScrollComponent = FlashList,

    // Spacings
    calendarSpacing = 20,
    calendarRowHorizontalSpacing,

    // Heights
    calendarMonthHeaderHeight = 20,
    calendarDayHeight = 32,
    calendarRowVerticalSpacing = 8,
    calendarWeekHeaderHeight = calendarDayHeight,

    // Other props
    theme,

    ...props
  }: CalendarListProps) => {
    const { initialMonth, initialMonthId } = useMemo(() => {
      const baseDate = baseInitialMonthId
        ? fromDateId(baseInitialMonthId)
        : fromDateId(toDateId(new Date()));
      const baseStartOfMonth = startOfMonth(baseDate);

      return {
        initialMonth: baseStartOfMonth,
        initialMonthId: toDateId(baseStartOfMonth),
      };
    }, [baseInitialMonthId]);

    const {
      onDayPress,
      calendarActiveDateRanges: activeDateRanges,
      disabledDates,
      calendarItemDayFormat,
      calendarItemWeekNameFormat,
      calendarRowMonthFormat,
      ...flatListProps
    } = props;

    const calendarProps = useMemo(
      (): Omit<CalendarProps, "calendarMonth"> => ({
        calendarFirstDayOfWeek,
        onDayPress,
        calendarActiveDateRanges: activeDateRanges,
        disabledDates,
        calendarItemDayFormat,
        calendarItemWeekNameFormat,
        calendarRowMonthFormat,
        calendarDayHeight,
        calendarMonthHeaderHeight,
        calendarRowHorizontalSpacing,
        calendarRowVerticalSpacing,
        calendarWeekHeaderHeight,
        theme,
      }),
      [
        activeDateRanges,
        calendarDayHeight,
        calendarItemDayFormat,
        calendarItemWeekNameFormat,
        calendarMonthHeaderHeight,
        calendarRowHorizontalSpacing,
        calendarRowMonthFormat,
        calendarRowVerticalSpacing,
        calendarWeekHeaderHeight,
        disabledDates,
        calendarFirstDayOfWeek,
        onDayPress,
        theme,
      ]
    );

    const [monthList, setMonthList] = useState<MonthShape[]>(() => {
      const currentMonth = startOfMonth(initialMonth);
      const startingMonth = sub(currentMonth, {
        months: calendarPastScrollRangeInMonths,
      });

      return buildMonthList(
        startingMonth,
        calendarPastScrollRangeInMonths + calendarFutureScrollRangeInMonths,
        calendarFirstDayOfWeek
      );
    });

    const handleOnEndReached = useCallback(() => {
      setMonthList((prev) => {
        const lastMonth = prev[prev.length - 1].date;
        const [_duplicateLastMonth, ...newMonths] = buildMonthList(
          lastMonth,
          calendarFutureScrollRangeInMonths,
          calendarFirstDayOfWeek
        );

        return [...prev, ...newMonths];
      });
    }, [calendarFirstDayOfWeek, calendarFutureScrollRangeInMonths]);

    const initialMonthIndex = useMemo(() => {
      const index = monthList.findIndex((i) => i.id === initialMonthId);
      return index;
    }, [initialMonthId, monthList]);

    const handleOverrideItemLayout = useCallback<
      NonNullable<FlashListProps<MonthShape>["overrideItemLayout"]>
    >(
      (layout, item, index) => {
        const monthHeight = getMonthHeight({
          month: item,
          index,
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

    const onLoad = useCallback(() => {
      const currentOffset = monthList.slice(0, initialMonthIndex).reduce(
        (acc, month, index) =>
          acc +
          getMonthHeight({
            month,
            index,
            spacing: calendarSpacing,
            calendarDayHeight,
            calendarMonthHeaderHeight,
            calendarRowVerticalSpacing,
            calendarWeekHeaderHeight,
          }),
        0
      );
      flashListRef.current?.scrollToOffset({
        offset: currentOffset + calendarSpacing / 2,
        animated: false,
      });
    }, [
      calendarDayHeight,
      calendarMonthHeaderHeight,
      calendarRowVerticalSpacing,
      calendarSpacing,
      calendarWeekHeaderHeight,
      initialMonthIndex,
      monthList,
    ]);

    const calendarContainerStyle = useMemo(() => {
      return { paddingTop: calendarSpacing };
    }, [calendarSpacing]);

    return (
      <CalendarScrollComponent
        data={monthList}
        estimatedItemSize={273}
        initialScrollIndex={initialMonthIndex}
        keyExtractor={keyExtractor}
        onEndReached={handleOnEndReached}
        onLoad={onLoad}
        overrideItemLayout={handleOverrideItemLayout}
        extraData={activeDateRanges}
        ref={flashListRef}
        renderItem={({ item, index }) =>
          index === 0 ? (
            <Calendar calendarMonth={item.date} {...calendarProps} />
          ) : (
            <View style={calendarContainerStyle}>
              <Calendar calendarMonth={item.date} {...calendarProps} />
            </View>
          )
        }
        showsVerticalScrollIndicator={false}
        {...flatListProps}
      />
    );
  }
);
