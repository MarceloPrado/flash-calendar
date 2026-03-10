import type {
  CalendarActiveDateRange,
  CalendarOnDayPress,
} from "@lazerlen/legend-calendar";
import { Calendar, fromDateId, toDateId } from "@lazerlen/legend-calendar";
import type { Meta } from "@storybook/react-native";
import { add, sub } from "date-fns";
import { format } from "date-fns/fp";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { DynamicFillerCalendar } from "./DynamicFillerCalendar";
import { LinearCalendar } from "./LinearCalendar";
import {
  WindowsXpButton,
  WindowsXpCalendar,
  WindowsXpWindow,
  windowsXpTokens,
} from "./WindowsXpCalendar";

const styles = StyleSheet.create({
  windowsXpBackground: {
    backgroundColor: windowsXpTokens.colors.background,
    padding: 12,
    flex: 1,
  },
  circularBackground: {
    backgroundColor: "#ffffff",
    padding: 16,
    flex: 1,
  },
  circularContainer: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.08)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 2,
  },
});

const CalendarMeta: Meta<typeof Calendar> = {
  title: "Calendar/Themes",
  decorators: [],
};

export default CalendarMeta;

export const Linear = () => <LinearCalendar />;

export const DynamicFiller = () => <DynamicFillerCalendar />;

export const Circular = () => {
  const circularMonth = new Date(2026, 2, 1);
  const [selectedRange] = useState<CalendarActiveDateRange[]>([
    {
      startId: "2026-03-10",
      endId: "2026-03-18",
    },
  ]);

  return (
    <View style={styles.circularBackground}>
      <View style={styles.circularContainer}>
        <Calendar
          calendarActiveDateRanges={selectedRange}
          calendarDayHeight={36}
          calendarMonthId={toDateId(circularMonth)}
          calendarRowHorizontalSpacing={6}
          calendarRowVerticalSpacing={12}
          getCalendarWeekDayFormat={format("EEEEE")}
          onCalendarDayPress={() => undefined}
          theme={{
            rowMonth: {
              content: {
                fontSize: 16,
                fontWeight: "600",
                textAlign: "center",
                color: "#383838",
              },
            },
            rowWeek: {
              container: {
                paddingBottom: 4,
              },
            },
            itemWeekName: {
              content: {
                fontSize: 12,
                fontWeight: "600",
                color: "#7a7a7a",
              },
            },
            itemDayContainer: {
              spacer: (metadata) => ({
                borderTopLeftRadius:
                  metadata.state === "active" && metadata.isStartOfRange
                    ? 18
                    : 0,
                borderBottomLeftRadius:
                  metadata.state === "active" && metadata.isStartOfRange
                    ? 18
                    : 0,
                borderTopRightRadius:
                  metadata.state === "active" && metadata.isEndOfRange ? 18 : 0,
                borderBottomRightRadius:
                  metadata.state === "active" && metadata.isEndOfRange ? 18 : 0,
                alignItems:
                  metadata.state === "active" && metadata.isStartOfRange
                    ? "flex-start"
                    : metadata.state === "active" && metadata.isEndOfRange
                    ? "flex-end"
                    : "center",
                justifyContent: "center",
                backgroundColor:
                  metadata.state === "active" ? "#eef2fd" : "transparent",
              }),
              activeDayFiller: {
                backgroundColor: "#eef2fd",
              },
            },
            itemDay: {
              base: () => ({
                container: {
                  borderRadius: 999,
                  width: 36,
                  height: 36,
                  flex: 0,
                  padding: 0,
                  alignItems: "center",
                  justifyContent: "center",
                },
                content: {
                  fontSize: 14,
                },
              }),
              idle: ({ isWeekend }) => ({
                container: {
                  backgroundColor: "transparent",
                },
                content: {
                  color: isWeekend ? "#b5b5b5" : "#3a3a3a",
                },
              }),
              active: ({ isStartOfRange, isEndOfRange }) => {
                const isEdge = isStartOfRange || isEndOfRange;
                return {
                  container: {
                    backgroundColor: isEdge ? "#2a74fd" : "#eef2fd",
                    borderRadius: isEdge ? 999 : 0,
                    width: isEdge ? 36 : "100%",
                    height: 36,
                    flex: isEdge ? 0 : 1,
                  },
                  content: {
                    color: isEdge ? "#ffffff" : "#2a74fd",
                    fontWeight: isEdge ? "700" : "500",
                  },
                };
              },
              today: () => ({
                container: {
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: "#2a74fd",
                },
                content: {
                  color: "#2a74fd",
                  fontWeight: "600",
                },
              }),
            },
          }}
        />
      </View>
    </View>
  );
};

export const WindowsXP = () => {
  const [isPickerVisible, setIsPickerVisible] = useState(true);

  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(
    sub(new Date(), { days: 1 })
  );

  const handleOpenPicker = useCallback(() => {
    setIsPickerVisible((p) => !p);
  }, []);

  const handleDayPress = useCallback<CalendarOnDayPress>((dateId) => {
    setCurrentCalendarMonth(fromDateId(dateId));
    setSelectedDate(fromDateId(dateId));
    setIsPickerVisible(false);
  }, []);

  const calendarActiveDateRanges = useMemo<CalendarActiveDateRange[]>(
    () => [
      {
        startId: toDateId(selectedDate),
        endId: toDateId(selectedDate),
      },
    ],
    [selectedDate]
  );

  const handlePreviousMonth = useCallback(() => {
    setCurrentCalendarMonth(sub(currentCalendarMonth, { months: 1 }));
  }, [currentCalendarMonth]);

  const handleNextMonth = useCallback(() => {
    setCurrentCalendarMonth(add(currentCalendarMonth, { months: 1 }));
  }, [currentCalendarMonth]);

  return (
    <View style={styles.windowsXpBackground}>
      <WindowsXpWindow title="@lazerlen/legend-calendar">
        <Calendar.VStack justifyContent="flex-start" spacing={12}>
          <Text>
            This is a Windows's XP themed calendar, using the composable API
            pattern to fully customize the calendar's appearance.
          </Text>

          <WindowsXpButton onPress={handleOpenPicker}>
            {format("dd/MM/yyyy")(selectedDate)}
          </WindowsXpButton>

          {isPickerVisible && (
            <WindowsXpCalendar
              calendarActiveDateRanges={calendarActiveDateRanges}
              calendarMaxDateId="2024-06-31"
              calendarMinDateId="2024-01-01"
              calendarMonthId={toDateId(currentCalendarMonth)}
              getCalendarWeekDayFormat={format("E")}
              onCalendarDayPress={handleDayPress}
              onNextMonthPress={handleNextMonth}
              onPreviousMonthPress={handlePreviousMonth}
            />
          )}
        </Calendar.VStack>
      </WindowsXpWindow>
    </View>
  );
};
