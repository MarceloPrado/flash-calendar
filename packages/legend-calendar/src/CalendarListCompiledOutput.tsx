import {
  LegendList as LegendListBase,
  type LegendListProps,
  type LegendListRef,
} from "@legendapp/list/react-native";
import { memo, useEffect, useImperativeHandle, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { c as _c } from "react/compiler-runtime";

import type { CalendarProps } from "@/components/Calendar";
import { Calendar } from "@/components/Calendar";
import { getWeekOfMonth, startOfMonth, toDateId } from "@/helpers/dates";
import type { CalendarMonth } from "@/hooks/useCalendarList";
import { getHeightForMonth, useCalendarList } from "@/hooks/useCalendarList";
import { activeDateRangesStore } from "@/hooks/useOptimizedDayMetadata";

// Type assertion to make LegendList compatible with React 19
const LegendList = LegendListBase as <T>(
  props: LegendListProps<T> & { ref?: React.Ref<LegendListRef> }
) => React.ReactElement;
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
    Omit<
      LegendListProps<CalendarMonthEnhanced>,
      "renderItem" | "data" | "children"
    > {
  /**
   * How many months to show before the current month. Once the user scrolls
   * past this range and if they haven't exceeded the `calendarMinDateId`, new
   * months are prepended in this increment.
   * @defaultValue 12
   */
  calendarPastScrollRangeInMonths?: number;
  /**
   * How many months to show after the current month. Once the user scrolls
   * past this range and if they haven't exceeded the `calendarMaxDateId`, new
   * months are appended in this increment.
   * @defaultValue 12
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
   * @defaultValue 20
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
  renderItem?: LegendListProps<CalendarMonthEnhanced>["renderItem"];
}

interface ImperativeScrollParams {
  /**
   * An additional offset to add to the final scroll position. Useful when
   * you need to slightly change the final scroll position.
   */
  additionalOffset?: number;
}
export interface CalendarListRef {
  scrollToMonth: (
    date: Date,
    animated: boolean,
    params?: ImperativeScrollParams
  ) => void;
  scrollToDate: (
    date: Date,
    animated: boolean,
    params?: ImperativeScrollParams
  ) => void;
  scrollToOffset: (offset: number, animated: boolean) => void;
}

export const CalendarList = memo(function CalendarList(t0) {
  const $ = _c(102);
  let props;
  let ref;
  if ($[0] !== t0) {
    ({ ref, ...props } = t0);
    $[0] = t0;
    $[1] = props;
    $[2] = ref;
  } else {
    props = $[1];
    ref = $[2];
  }
  let calendarColorScheme;
  let calendarFormatLocale;
  let calendarInitialMonthId;
  let calendarRowHorizontalSpacing;
  let onEndReached;
  let onStartReached;
  let otherProps;
  let t1;
  let t2;
  let t3;
  let t4;
  let t5;
  let t6;
  let t7;
  let t8;
  let t9;
  let theme;
  if ($[3] !== props) {
    ({
      calendarInitialMonthId,
      calendarPastScrollRangeInMonths: t1,
      calendarFutureScrollRangeInMonths: t2,
      calendarFirstDayOfWeek: t3,
      calendarFormatLocale,
      calendarSpacing: t4,
      calendarRowHorizontalSpacing,
      calendarRowVerticalSpacing: t5,
      calendarMonthHeaderHeight: t6,
      calendarDayHeight: t7,
      calendarWeekHeaderHeight: t8,
      calendarAdditionalHeight: t9,
      calendarColorScheme,
      theme,
      onEndReached,
      onStartReached,
      ...otherProps
    } = props);
    $[3] = props;
    $[4] = calendarColorScheme;
    $[5] = calendarFormatLocale;
    $[6] = calendarInitialMonthId;
    $[7] = calendarRowHorizontalSpacing;
    $[8] = onEndReached;
    $[9] = onStartReached;
    $[10] = otherProps;
    $[11] = t1;
    $[12] = t2;
    $[13] = t3;
    $[14] = t4;
    $[15] = t5;
    $[16] = t6;
    $[17] = t7;
    $[18] = t8;
    $[19] = t9;
    $[20] = theme;
  } else {
    calendarColorScheme = $[4];
    calendarFormatLocale = $[5];
    calendarInitialMonthId = $[6];
    calendarRowHorizontalSpacing = $[7];
    onEndReached = $[8];
    onStartReached = $[9];
    otherProps = $[10];
    t1 = $[11];
    t2 = $[12];
    t3 = $[13];
    t4 = $[14];
    t5 = $[15];
    t6 = $[16];
    t7 = $[17];
    t8 = $[18];
    t9 = $[19];
    theme = $[20];
  }
  const calendarPastScrollRangeInMonths = t1 === undefined ? 12 : t1;
  const calendarFutureScrollRangeInMonths = t2 === undefined ? 12 : t2;
  const calendarFirstDayOfWeek = t3 === undefined ? "sunday" : t3;
  const calendarSpacing = t4 === undefined ? 20 : t4;
  const calendarRowVerticalSpacing = t5 === undefined ? 8 : t5;
  const calendarMonthHeaderHeight = t6 === undefined ? 20 : t6;
  const calendarDayHeight = t7 === undefined ? 32 : t7;
  const calendarWeekHeaderHeight = t8 === undefined ? calendarDayHeight : t8;
  const calendarAdditionalHeight = t9 === undefined ? 0 : t9;
  let CalendarPressableComponent;
  let calendarActiveDateRanges;
  let calendarDisabledDateIds;
  let calendarInstanceId;
  let calendarMaxDateId;
  let calendarMinDateId;
  let flatListProps;
  let getCalendarDayFormat;
  let getCalendarMonthFormat;
  let getCalendarWeekDayFormat;
  let onCalendarDayPress;
  if ($[21] !== otherProps) {
    ({
      calendarActiveDateRanges,
      calendarDisabledDateIds,
      calendarInstanceId,
      calendarMaxDateId,
      calendarMinDateId,
      getCalendarDayFormat,
      getCalendarMonthFormat,
      getCalendarWeekDayFormat,
      onCalendarDayPress,
      CalendarPressableComponent,
      ...flatListProps
    } = otherProps);
    $[21] = otherProps;
    $[22] = CalendarPressableComponent;
    $[23] = calendarActiveDateRanges;
    $[24] = calendarDisabledDateIds;
    $[25] = calendarInstanceId;
    $[26] = calendarMaxDateId;
    $[27] = calendarMinDateId;
    $[28] = flatListProps;
    $[29] = getCalendarDayFormat;
    $[30] = getCalendarMonthFormat;
    $[31] = getCalendarWeekDayFormat;
    $[32] = onCalendarDayPress;
  } else {
    CalendarPressableComponent = $[22];
    calendarActiveDateRanges = $[23];
    calendarDisabledDateIds = $[24];
    calendarInstanceId = $[25];
    calendarMaxDateId = $[26];
    calendarMinDateId = $[27];
    flatListProps = $[28];
    getCalendarDayFormat = $[29];
    getCalendarMonthFormat = $[30];
    getCalendarWeekDayFormat = $[31];
    onCalendarDayPress = $[32];
  }
  let t10;
  let t11;
  if ($[33] !== calendarActiveDateRanges || $[34] !== calendarInstanceId) {
    t10 = () => {
      activeDateRangesStore.setRanges(
        calendarInstanceId ?? "legend-calendar-default-instance",
        calendarActiveDateRanges ?? []
      );
    };
    t11 = [calendarActiveDateRanges, calendarInstanceId];
    $[33] = calendarActiveDateRanges;
    $[34] = calendarInstanceId;
    $[35] = t10;
    $[36] = t11;
  } else {
    t10 = $[35];
    t11 = $[36];
  }
  useEffect(t10, t11);
  let t12;
  if (
    $[37] !== CalendarPressableComponent ||
    $[38] !== calendarColorScheme ||
    $[39] !== calendarDayHeight ||
    $[40] !== calendarDisabledDateIds ||
    $[41] !== calendarFirstDayOfWeek ||
    $[42] !== calendarFormatLocale ||
    $[43] !== calendarInstanceId ||
    $[44] !== calendarMaxDateId ||
    $[45] !== calendarMinDateId ||
    $[46] !== calendarMonthHeaderHeight ||
    $[47] !== calendarRowHorizontalSpacing ||
    $[48] !== calendarRowVerticalSpacing ||
    $[49] !== calendarWeekHeaderHeight ||
    $[50] !== getCalendarDayFormat ||
    $[51] !== getCalendarMonthFormat ||
    $[52] !== getCalendarWeekDayFormat ||
    $[53] !== onCalendarDayPress ||
    $[54] !== theme
  ) {
    t12 = {
      calendarColorScheme,
      calendarDayHeight,
      calendarDisabledDateIds,
      calendarFirstDayOfWeek,
      calendarFormatLocale,
      calendarInstanceId,
      calendarMaxDateId,
      calendarMinDateId,
      calendarMonthHeaderHeight,
      calendarRowHorizontalSpacing,
      calendarRowVerticalSpacing,
      calendarWeekHeaderHeight,
      getCalendarDayFormat,
      getCalendarMonthFormat,
      getCalendarWeekDayFormat,
      onCalendarDayPress,
      theme,
      CalendarPressableComponent,
    };
    $[37] = CalendarPressableComponent;
    $[38] = calendarColorScheme;
    $[39] = calendarDayHeight;
    $[40] = calendarDisabledDateIds;
    $[41] = calendarFirstDayOfWeek;
    $[42] = calendarFormatLocale;
    $[43] = calendarInstanceId;
    $[44] = calendarMaxDateId;
    $[45] = calendarMinDateId;
    $[46] = calendarMonthHeaderHeight;
    $[47] = calendarRowHorizontalSpacing;
    $[48] = calendarRowVerticalSpacing;
    $[49] = calendarWeekHeaderHeight;
    $[50] = getCalendarDayFormat;
    $[51] = getCalendarMonthFormat;
    $[52] = getCalendarWeekDayFormat;
    $[53] = onCalendarDayPress;
    $[54] = theme;
    $[55] = t12;
  } else {
    t12 = $[55];
  }
  const calendarProps = t12;
  let t13;
  if (
    $[56] !== calendarFirstDayOfWeek ||
    $[57] !== calendarFutureScrollRangeInMonths ||
    $[58] !== calendarInitialMonthId ||
    $[59] !== calendarMaxDateId ||
    $[60] !== calendarMinDateId ||
    $[61] !== calendarPastScrollRangeInMonths
  ) {
    t13 = {
      calendarFirstDayOfWeek,
      calendarFutureScrollRangeInMonths,
      calendarPastScrollRangeInMonths,
      calendarInitialMonthId,
      calendarMaxDateId,
      calendarMinDateId,
    };
    $[56] = calendarFirstDayOfWeek;
    $[57] = calendarFutureScrollRangeInMonths;
    $[58] = calendarInitialMonthId;
    $[59] = calendarMaxDateId;
    $[60] = calendarMinDateId;
    $[61] = calendarPastScrollRangeInMonths;
    $[62] = t13;
  } else {
    t13 = $[62];
  }
  const {
    initialMonthIndex,
    monthList,
    appendMonths,
    prependMonths,
    addMissingMonths,
  } = useCalendarList(t13);
  let t14;
  if ($[63] !== calendarProps || $[64] !== monthList) {
    let t15;
    if ($[66] !== calendarProps) {
      t15 = (month) => ({ ...month, calendarProps });
      $[66] = calendarProps;
      $[67] = t15;
    } else {
      t15 = $[67];
    }
    t14 = monthList.map(t15);
    $[63] = calendarProps;
    $[64] = monthList;
    $[65] = t14;
  } else {
    t14 = $[65];
  }
  const monthListWithCalendarProps = t14;
  let t15;
  if (
    $[68] !== appendMonths ||
    $[69] !== calendarFutureScrollRangeInMonths ||
    $[70] !== onEndReached
  ) {
    t15 = (info) => {
      appendMonths(calendarFutureScrollRangeInMonths);
      onEndReached?.(info);
    };
    $[68] = appendMonths;
    $[69] = calendarFutureScrollRangeInMonths;
    $[70] = onEndReached;
    $[71] = t15;
  } else {
    t15 = $[71];
  }
  const handleOnEndReached = t15;
  let t16;
  if (
    $[72] !== calendarPastScrollRangeInMonths ||
    $[73] !== onStartReached ||
    $[74] !== prependMonths
  ) {
    t16 = (info_0) => {
      prependMonths(calendarPastScrollRangeInMonths);
      onStartReached?.(info_0);
    };
    $[72] = calendarPastScrollRangeInMonths;
    $[73] = onStartReached;
    $[74] = prependMonths;
    $[75] = t16;
  } else {
    t16 = $[75];
  }
  const handleOnStartReached = t16;
  let t17;
  if (
    $[76] !== addMissingMonths ||
    $[77] !== calendarAdditionalHeight ||
    $[78] !== calendarDayHeight ||
    $[79] !== calendarMonthHeaderHeight ||
    $[80] !== calendarRowVerticalSpacing ||
    $[81] !== calendarSpacing ||
    $[82] !== calendarWeekHeaderHeight ||
    $[83] !== monthList
  ) {
    t17 = (date) => {
      const monthId = toDateId(startOfMonth(date));

      let baseMonthList = monthList;
      let index = baseMonthList.findIndex((month_0) => month_0.id === monthId);

      if (index === -1) {
        baseMonthList = addMissingMonths(monthId);
        index = baseMonthList.findIndex((month_1) => month_1.id === monthId);
      }
      return baseMonthList.slice(0, index).reduce((acc, month_2) => {
        const currentHeight = getHeightForMonth({
          calendarMonth: month_2,
          calendarSpacing,
          calendarDayHeight,
          calendarMonthHeaderHeight,
          calendarRowVerticalSpacing,
          calendarWeekHeaderHeight,
          calendarAdditionalHeight,
        });
        return acc + currentHeight;
      }, 0);
    };
    $[76] = addMissingMonths;
    $[77] = calendarAdditionalHeight;
    $[78] = calendarDayHeight;
    $[79] = calendarMonthHeaderHeight;
    $[80] = calendarRowVerticalSpacing;
    $[81] = calendarSpacing;
    $[82] = calendarWeekHeaderHeight;
    $[83] = monthList;
    $[84] = t17;
  } else {
    t17 = $[84];
  }
  const getScrollOffsetForMonth = t17;

  const legendListRef = useRef(null);
  let t18;
  if (
    $[85] !== calendarDayHeight ||
    $[86] !== calendarFirstDayOfWeek ||
    $[87] !== calendarRowVerticalSpacing ||
    $[88] !== calendarWeekHeaderHeight ||
    $[89] !== getScrollOffsetForMonth
  ) {
    t18 = () => ({
      scrollToMonth(date_0, animated, t19) {
        const { additionalOffset: t20 } =
          t19 === undefined ? { additionalOffset: 0 } : t19;
        const additionalOffset = t20 === undefined ? 0 : t20;

        setTimeout(() => {
          legendListRef.current?.scrollToOffset({
            offset: getScrollOffsetForMonth(date_0) + additionalOffset,
            animated,
          });
        }, 0);
      },
      scrollToDate(date_1, animated_0, t21) {
        const { additionalOffset: t22 } =
          t21 === undefined ? { additionalOffset: 0 } : t21;
        const additionalOffset_0 = t22 === undefined ? 0 : t22;

        const currentMonthOffset = getScrollOffsetForMonth(date_1);
        const weekOfMonthIndex = getWeekOfMonth(date_1, calendarFirstDayOfWeek);
        const rowHeight = calendarDayHeight + calendarRowVerticalSpacing;

        let weekOffset =
          calendarWeekHeaderHeight + rowHeight * weekOfMonthIndex;

        weekOffset = weekOffset - calendarRowVerticalSpacing;

        legendListRef.current?.scrollToOffset({
          offset: currentMonthOffset + weekOffset + additionalOffset_0,
          animated: animated_0,
        });
      },
      scrollToOffset(offset, animated_1) {
        legendListRef.current?.scrollToOffset({ offset, animated: animated_1 });
      },
    });
    $[85] = calendarDayHeight;
    $[86] = calendarFirstDayOfWeek;
    $[87] = calendarRowVerticalSpacing;
    $[88] = calendarWeekHeaderHeight;
    $[89] = getScrollOffsetForMonth;
    $[90] = t18;
  } else {
    t18 = $[90];
  }
  useImperativeHandle(ref, t18);
  let t19;
  if ($[91] !== calendarSpacing) {
    t19 = { paddingBottom: calendarSpacing };
    $[91] = calendarSpacing;
    $[92] = t19;
  } else {
    t19 = $[92];
  }
  const calendarContainerStyle = t19;
  let t20;
  if ($[93] !== calendarContainerStyle) {
    t20 = (t21) => {
      const { item } = t21;
      return (
        <View style={calendarContainerStyle}>
          <Calendar calendarMonthId={item.id} {...item.calendarProps} />
        </View>
      );
    };
    $[93] = calendarContainerStyle;
    $[94] = t20;
  } else {
    t20 = $[94];
  }
  const handleRenderItem = t20;
  let t21;
  if (
    $[95] !== flatListProps ||
    $[96] !== handleOnEndReached ||
    $[97] !== handleOnStartReached ||
    $[98] !== handleRenderItem ||
    $[99] !== initialMonthIndex ||
    $[100] !== monthListWithCalendarProps
  ) {
    t21 = (
      <LegendList
        data={monthListWithCalendarProps}
        estimatedItemSize={273}
        initialScrollIndex={initialMonthIndex}
        keyExtractor={keyExtractor}
        maintainVisibleContentPosition
        onEndReached={handleOnEndReached}
        onStartReached={handleOnStartReached}
        recycleItems
        ref={legendListRef}
        renderItem={handleRenderItem}
        showsVerticalScrollIndicator={false}
        style={styles.container}
        {...flatListProps}
      />
    );
    $[95] = flatListProps;
    $[96] = handleOnEndReached;
    $[97] = handleOnStartReached;
    $[98] = handleRenderItem;
    $[99] = initialMonthIndex;
    $[100] = monthListWithCalendarProps;
    $[101] = t21;
  } else {
    t21 = $[101];
  }
  return t21;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
