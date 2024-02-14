import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Meta } from "@storybook/react";
import {
  Calendar,
  CalendarOnDayPress,
  fromDateId,
  toDateId,
} from "@marceloterreiro/flash-calendar";

import { paddingDecorator } from "@/developer/decorators";
import { VStack } from "@/components/VStack";
import { format, startOfMonth } from "date-fns";

import {
  WindowsXpButton,
  WindowsXpCalendar,
  WindowsXpWindow,
  WINDOWS_XP_CALENDAR_HEIGHT,
  windowsXpTokens,
} from "./WindowsXpCalendar";

const CalendarListMeta: Meta<typeof Calendar> = {
  title: "Calendar.List/Themes",
  decorators: [paddingDecorator],
};

export default CalendarListMeta;

const styles = StyleSheet.create({
  background: {
    backgroundColor: windowsXpTokens.colors.background,
  },
  calendarContainer: {
    height: WINDOWS_XP_CALENDAR_HEIGHT,
  },
});

export const WindowsXp = () => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));

  const handleOpenPicker = useCallback(() => {
    setIsPickerVisible(true);
  }, []);

  const handleDayPress = useCallback<CalendarOnDayPress>((dateId) => {
    setCurrentDate(fromDateId(dateId));
  }, []);

  return (
    <View style={styles.background}>
      <WindowsXpWindow title="@marceloterreiro/flash-calendar demo">
        <VStack spacing={12} justifyContent="flex-start">
          <Text>
            This is a Windows's XP calendar style, showcasing how easy it is to
            compose and build your own calendars.
          </Text>

          <WindowsXpButton onPress={handleOpenPicker}>
            {format(currentDate, "dd/MM/yyyy")}
          </WindowsXpButton>

          {isPickerVisible && (
            <View style={styles.calendarContainer}>
              <Calendar.List
                calendarInitialMonthId={toDateId(currentDate)}
                onDayPress={handleDayPress}
                calendarPastScrollRangeInMonths={0}
                calendarFutureScrollRangeInMonths={0}
                calendarWeekDayFormat="E"
                renderItem={({ item }) => (
                  <WindowsXpCalendar
                    calendarMonthId={item.id}
                    {...item.calendarProps}
                  />
                )}
              />
            </View>
          )}
        </VStack>
      </WindowsXpWindow>
    </View>
  );
};
