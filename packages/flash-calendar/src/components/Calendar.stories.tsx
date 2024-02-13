import type { Meta, StoryObj } from "@storybook/react";
import { add, startOfMonth } from "date-fns";
import { StyleSheet, View } from "react-native";

import { Calendar } from "./Calendar";

import { paddingDecorator } from "@/developer/decorators";
import { loggingHandler } from "@/developer/loggginHandler";
import { toDateId } from "@/helpers/dates";

const startOfThisMonth = startOfMonth(new Date());

const CalendarMeta: Meta<typeof Calendar> = {
  title: "Calendar",
  component: Calendar,
  argTypes: {
    calendarFirstDayOfWeek: {
      control: {
        type: "select",
      },
      options: ["monday", "sunday"],
    },
    onDayPress: { action: "onDayPress" },
    calendarItemDayFormat: { type: "string" },
    calendarRowMonthFormat: { type: "string" },
    calendarItemWeekNameFormat: { type: "string" },
  },
  args: {
    calendarFirstDayOfWeek: "sunday",
    calendarMonthId: toDateId(startOfThisMonth),
    calendarItemDayFormat: "d",
    calendarItemWeekNameFormat: "EEEEE",
    calendarRowMonthFormat: "MMMM yyyy",
    disabledDates: ["2024-01-01", "2024-01-02"],
    calendarActiveDateRanges: [
      {
        startId: toDateId(add(startOfThisMonth, { days: 3 })),
        endId: toDateId(add(startOfThisMonth, { days: 8 })),
      },
    ],
  },
  decorators: [paddingDecorator],
};

export default CalendarMeta;

export const Default: StoryObj<typeof Calendar> = {};

export const DisabledDates: StoryObj<typeof Calendar> = {
  args: {
    disabledDates: [
      "2024-01-01",
      "2024-01-02",
      "2024-01-03",
      "2024-01-16",
      "2024-01-17",
    ],
    calendarMonthId: "2024-01-01",
  },
};

export const MinAndMaxDates: StoryObj<typeof Calendar> = {
  args: {
    calendarMonthId: "2024-03-01",
    calendarMinDateId: "2024-03-10",
    calendarMaxDateId: "2024-03-20",
  },
};

export const ActiveDateRanges: StoryObj<typeof Calendar> = {
  args: {
    calendarActiveDateRanges: [
      { startId: "2024-01-04", endId: "2024-01-06" },
      { startId: "2024-01-10", endId: "2024-01-12" },
      //   Incomplete
      { startId: "2024-01-24" },
      { endId: "2024-01-29" },
    ],
    calendarMonthId: "2024-01-01",
  },
};

const styles = StyleSheet.create({
  linearContainer: {
    flex: 1,
    backgroundColor: "#252630",
    // Remove padding decorator to fill bg color
    margin: -12,
    padding: 12,
  },
});

const linearAccent = "#585ABF";
export const LinearTheme = () => {
  return (
    <View style={styles.linearContainer}>
      <Calendar
        calendarItemWeekNameFormat="iiiiii"
        calendarMonthId={toDateId(startOfThisMonth)}
        calendarActiveDateRanges={[
          {
            startId: toDateId(add(startOfThisMonth, { days: 3 })),
            endId: toDateId(add(startOfThisMonth, { days: 8 })),
          },
        ]}
        calendarFirstDayOfWeek="sunday"
        calendarDayHeight={30}
        calendarRowVerticalSpacing={16}
        calendarRowHorizontalSpacing={16}
        onDayPress={loggingHandler("onDayPress")}
        theme={{
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
                color:
                  isWeekend && !isPressed
                    ? "rgba(255, 255, 255, 0.5)"
                    : "#ffffff",
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
        }}
      />
    </View>
  );
};
