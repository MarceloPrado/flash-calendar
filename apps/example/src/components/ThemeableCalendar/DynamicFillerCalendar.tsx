import type { CalendarTheme } from "@marceloterreiro/flash-calendar";
import {
  Calendar,
  toDateId,
  useDateRange,
} from "@marceloterreiro/flash-calendar";
import { startOfMonth } from "date-fns";
import { format } from "date-fns/fp";
import { memo } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const today = new Date();

const startOfThisMonth = startOfMonth(today);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 12,
  },
  description: {
    color: "#ffffff",
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  descriptionHighlight: {
    fontWeight: "bold",
    color: "#4CAF50",
  },
  rangeInfo: {
    color: "#ffffff",
    fontSize: 12,
    marginTop: 12,
    opacity: 0.8,
  },
  buttonContainer: {
    marginTop: 12,
  },
});

const primaryColor = "#4CAF50";
const weekendColor = "#FF9800";
const todayColor = "#2196F3";

const dynamicFillerTheme: CalendarTheme = {
  rowMonth: {
    content: {
      textAlign: "left",
      color: "rgba(255, 255, 255, 0.7)",
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
  itemWeekName: { content: { color: "rgba(255, 255, 255, 0.6)" } },
  itemDayContainer: {
    // This demonstrates the callback functionality for activeDayFiller
    // The callback receives CalendarDayMetadata and returns ViewStyle
    activeDayFiller: (metadata) => {
      // Different colors based on day properties
      let backgroundColor = primaryColor;

      if (metadata.isToday) {
        // Highlight today with a different color
        backgroundColor = todayColor;
      } else if (metadata.isWeekend) {
        // Use orange for weekends
        backgroundColor = weekendColor;
      }

      return {
        backgroundColor,
        opacity: 0.7,
      };
    },
  },
  itemDay: {
    idle: ({ isPressed, isWeekend }) => ({
      container: {
        backgroundColor: isPressed ? primaryColor : "transparent",
        borderRadius: 4,
      },
      content: {
        color: isWeekend && !isPressed ? "rgba(255, 255, 255, 0.5)" : "#ffffff",
      },
    }),
    today: ({ isPressed }) => ({
      container: {
        borderColor: todayColor,
        borderWidth: 1,
        borderRadius: isPressed ? 4 : 30,
        backgroundColor: isPressed ? todayColor : "transparent",
      },
      content: {
        color: isPressed ? "#ffffff" : todayColor,
      },
    }),
    active: ({ isEndOfRange, isStartOfRange }) => ({
      container: {
        backgroundColor: primaryColor,
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

export const DynamicFillerCalendar = memo(() => {
  const {
    calendarActiveDateRanges,
    onCalendarDayPress,
    dateRange,
    isDateRangeValid,
    onClearDateRange,
  } = useDateRange();

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        This calendar demonstrates the{" "}
        <Text style={styles.descriptionHighlight}>
          activeDayFiller callback
        </Text>{" "}
        feature. Select a date range to see the filler color change dynamically:
      </Text>
      <Text style={styles.description}>
        • <Text style={styles.descriptionHighlight}>Green</Text> for weekdays
        {"\n"}• <Text style={styles.descriptionHighlight}>Orange</Text> for
        weekends
        {"\n"}• <Text style={styles.descriptionHighlight}>Blue</Text> when the
        range includes today
      </Text>
      <Calendar
        calendarActiveDateRanges={calendarActiveDateRanges}
        calendarDayHeight={32}
        calendarFirstDayOfWeek="sunday"
        calendarMonthId={toDateId(startOfThisMonth)}
        calendarRowHorizontalSpacing={12}
        calendarRowVerticalSpacing={12}
        getCalendarWeekDayFormat={format("iiiiii")}
        onCalendarDayPress={onCalendarDayPress}
        theme={dynamicFillerTheme}
      />
      {dateRange.startId && (
        <Text style={styles.rangeInfo}>
          Selected: {dateRange.startId}
          {dateRange.endId ? ` - ${dateRange.endId}` : " (select end date)"}
        </Text>
      )}
      {isDateRangeValid && (
        <View style={styles.buttonContainer}>
          <Button
            title="Clear Range"
            onPress={onClearDateRange}
            color="#4CAF50"
          />
        </View>
      )}
    </View>
  );
});
