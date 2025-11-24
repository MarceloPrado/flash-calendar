import type {
  CalendarActiveDateRange,
  CalendarOnDayPress,
} from "@marceloterreiro/flash-calendar";
import {
  Calendar,
  fromDateId,
  toDateId,
} from "@marceloterreiro/flash-calendar";
import type { Meta } from "@storybook/react-native";
import { add, sub } from "date-fns";
import { format } from "date-fns/fp";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  WindowsXpButton,
  WindowsXpCalendar,
  WindowsXpWindow,
  windowsXpTokens,
} from "./WindowsXpCalendar";
import { LinearCalendar } from "./LinearCalendar";
import { DynamicFillerCalendar } from "./DynamicFillerCalendar";

const styles = StyleSheet.create({
  windowsXpBackground: {
    backgroundColor: windowsXpTokens.colors.background,
    padding: 12,
    flex: 1,
  },
});

const CalendarMeta: Meta<typeof Calendar> = {
  title: "Calendar/Themes",
  decorators: [],
};

export default CalendarMeta;

export const Linear = () => <LinearCalendar />;

export const DynamicFiller = () => <DynamicFillerCalendar />;

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
      <WindowsXpWindow title="@marceloterreiro/flash-calendar">
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
