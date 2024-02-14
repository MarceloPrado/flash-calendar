import { add, startOfMonth, endOfMonth } from "date-fns";
import { StyleSheet, View } from "react-native";

import {
  Calendar,
  CalendarActiveDateRange,
  CalendarTheme,
  toDateId,
} from "@marceloterreiro/flash-calendar";

import { loggingHandler } from "@marceloterreiro/flash-calendar/src/developer/loggginHandler";
import { memo } from "react";

const today = new Date();

const startOfThisMonth = startOfMonth(today);
const endOfThisMonth = endOfMonth(today);

const styles = StyleSheet.create({
  linearContainer: {
    flex: 1,
    backgroundColor: "#252630",
    padding: 12,
  },
});

const linearAccent = "#585ABF";

const linearTheme: CalendarTheme = {
  rowMonth: {
    content: {
      textAlign: "left",
      color: "rgba(255, 255, 255, 0.5)",
      fontWeight: "700",
    },
  },
  rowWeek: {
    container: {
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255, 255, 255, 0.1)",
      borderStyle: "solid",
    },
  },
  itemWeekName: { content: { color: "rgba(255, 255, 255, 0.5)" } },
  itemDayContainer: {
    activeDayFiller: {
      backgroundColor: linearAccent,
    },
  },
  itemDay: {
    idle: ({ isPressed, isWeekend }) => ({
      container: {
        backgroundColor: isPressed ? linearAccent : "transparent",
        borderRadius: 4,
      },
      content: {
        color: isWeekend && !isPressed ? "rgba(255, 255, 255, 0.5)" : "#ffffff",
      },
    }),
    today: ({ isPressed }) => ({
      container: {
        borderColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: isPressed ? 4 : 30,
        backgroundColor: isPressed ? linearAccent : "transparent",
      },
      content: {
        color: isPressed ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
      },
    }),
    active: ({ isEndOfRange, isStartOfRange }) => ({
      container: {
        backgroundColor: linearAccent,
        borderTopLeftRadius: isStartOfRange ? 4 : 0,
        borderBottomLeftRadius: isStartOfRange ? 4 : 0,
        borderTopRightRadius: isEndOfRange ? 4 : 0,
        borderBottomRightRadius: isEndOfRange ? 4 : 0,
      },
      content: {
        color: "#ffffff",
      },
    }),
  },
};

const calendarActiveDateRanges: CalendarActiveDateRange[] = [
  {
    startId: toDateId(add(startOfThisMonth, { days: 3 })),
    endId: toDateId(add(startOfThisMonth, { days: 8 })),
  },
];

export const LinearCalendar = memo(() => {
  return (
    <View style={styles.linearContainer}>
      <Calendar
        calendarWeekDayFormat="iiiiii"
        calendarMonthId={toDateId(startOfThisMonth)}
        calendarActiveDateRanges={calendarActiveDateRanges}
        calendarFirstDayOfWeek="sunday"
        calendarDayHeight={30}
        calendarRowVerticalSpacing={16}
        calendarRowHorizontalSpacing={16}
        onDayPress={loggingHandler("onDayPress")}
        theme={linearTheme}
      />
    </View>
  );
});
