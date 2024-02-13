import type { Meta, StoryObj } from "@storybook/react";
import { add, format, startOfMonth, sub, toDate } from "date-fns";
import { useCallback, useRef, useState } from "react";
import {
  Button,
  Text,
  View,
  StyleSheet,
  ViewBase,
  Pressable,
} from "react-native";

import { CalendarList, CalendarListRef } from "./CalendarList";

import { Calendar } from "@/components";
import { CalendarOnDayPress } from "@/components/Calendar";
import { HStack } from "@/components/HStack";
import { VStack } from "@/components/VStack";
import { paddingDecorator } from "@/developer/decorators";
import { loggingHandler } from "@/developer/loggginHandler";
import { toDateId } from "@/helpers/dates";

const CalendarListMeta: Meta<typeof CalendarList> = {
  title: "CalendarList",
  component: CalendarList,
  argTypes: {},
  args: {
    onDayPress: loggingHandler("onDayPress"),
    calendarRowVerticalSpacing: 8,
    calendarRowHorizontalSpacing: 8,
  },
  decorators: [paddingDecorator],
};

export default CalendarListMeta;

export const Default: StoryObj<typeof CalendarList> = {};

export const WithCustomSpacing: StoryObj<typeof CalendarList> = {
  args: {
    calendarRowVerticalSpacing: 0,
    calendarRowHorizontalSpacing: 4,
  },
};

export const WithDateRangeAndDisabledDates: StoryObj<typeof CalendarList> = {
  args: {
    calendarActiveDateRanges: [
      {
        startId: "2024-01-15",
        endId: "2024-01-28",
      },
    ],
    disabledDates: ["2024-01-01", "2024-01-02"],
    calendarInitialMonthId: "2024-01-01",
  },
};

export const WithShortRanges: StoryObj<typeof CalendarList> = {
  args: {
    calendarPastScrollRangeInMonths: 1,
    calendarFutureScrollRangeInMonths: 1,
    calendarInitialMonthId: "2024-02-01",
  },
};

export const SparseCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<undefined | string>(
    undefined
  );

  const onDayPress = (dateId: string) => {
    setSelectedDate(dateId);
  };

  return (
    <VStack spacing={24} grow>
      <Text>Selected date: {selectedDate}</Text>

      <CalendarList
        calendarActiveDateRanges={[
          {
            startId: selectedDate,
            endId: selectedDate,
          },
        ]}
        calendarInitialMonthId={selectedDate}
        onDayPress={onDayPress}
        calendarRowVerticalSpacing={16}
        calendarDayHeight={50}
        calendarMonthHeaderHeight={20}
        calendarWeekHeaderHeight={32}
        calendarSpacing={48}
        calendarRowHorizontalSpacing={16}
      />
    </VStack>
  );
};

export const ImperativeScrolling = () => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  const ref = useRef<CalendarListRef>(null);

  return (
    <VStack spacing={20} grow alignItems="center">
      <HStack spacing={12}>
        <Button
          title="Past month"
          onPress={() => {
            const pastMonth = sub(currentMonth, { months: 1 });
            setCurrentMonth(pastMonth);
            ref.current?.scrollToDate(pastMonth, true);
          }}
        />
        <Text>Current: {toDateId(currentMonth)}</Text>
        <Button
          title="Next month"
          onPress={() => {
            const nextMonth = add(currentMonth, { months: 1 });
            setCurrentMonth(nextMonth);
            ref.current?.scrollToDate(nextMonth, true);
          }}
        />
      </HStack>
      <HStack spacing={12}>
        <Button
          title="Past year"
          onPress={() => {
            const pastYear = sub(currentMonth, { years: 1 });
            setCurrentMonth(pastYear);
            ref.current?.scrollToDate(pastYear, true);
          }}
        />
        <Button
          title="Today"
          onPress={() => {
            const thisMonth = startOfMonth(new Date());
            setCurrentMonth(thisMonth);
            ref.current?.scrollToDate(thisMonth, true);
          }}
        />
        <Button
          title="Next year"
          onPress={() => {
            const nextYear = add(currentMonth, { years: 1 });
            setCurrentMonth(nextYear);
            ref.current?.scrollToDate(nextYear, true);
          }}
        />
      </HStack>
      <View
        // This hardcoded height is just to simplify testing the programmatic scrolling
        style={{
          height: 32 * 8,
          width: "100%",
          backgroundColor: "rgba(0,0,0,.05)",
        }}
      >
        <CalendarList
          onDayPress={loggingHandler("onDayPress")}
          calendarInitialMonthId={toDateId(currentMonth)}
          calendarPastScrollRangeInMonths={0}
          calendarFutureScrollRangeInMonths={0}
          calendarSpacing={20}
          calendarRowVerticalSpacing={0}
          calendarMonthHeaderHeight={32}
          calendarWeekHeaderHeight={32}
          ref={ref}
        />
      </View>
    </VStack>
  );
};

export const MinAndMaxDates = () => {
  return (
    <VStack spacing={20} grow alignItems="center">
      <Text>This calendar list is only available for the 2024 period</Text>
      <View style={{ flex: 1, width: "100%" }}>
        <CalendarList
          onDayPress={loggingHandler("onDayPress")}
          calendarInitialMonthId={"2024-02-13"}
          calendarMinDateId={"2024-01-01"}
          calendarMaxDateId={"2024-12-31"}
        />
      </View>
    </VStack>
  );
};

// #region Composable (Window's XP style)

const BG_COLOR = "#ECE9DA";
const BLUE_COLOR = "#2559DF";

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: BG_COLOR,
    // Remove padding decorator to fill bg color
    margin: -12,
    padding: 12,
  },

  windowContent: {
    backgroundColor: BG_COLOR,
    borderWidth: 2,
    borderColor: BLUE_COLOR,
    borderStyle: "solid",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 12,
  },

  windowHeaderContainer: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: BLUE_COLOR,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  windowHeader: {
    color: "#ffffff",
    width: "100%",
    textAlign: "left",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  buttonContainer: {
    borderColor: BLUE_COLOR,
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "white",
    padding: 4,
    width: 110,
  },
  buttonContentContainer: {
    padding: 4,
  },
  buttonContent: {
    color: "#ffffff",
    backgroundColor: BLUE_COLOR,
  },
});

const WindowHeader = ({ children }: { children: string }) => {
  return (
    <View style={styles.windowHeaderContainer}>
      <Text style={styles.windowHeader}>{children}</Text>
    </View>
  );
};

const Window = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <VStack spacing={0}>
      <WindowHeader>{title}</WindowHeader>
      <View style={styles.windowContent}>{children}</View>
    </VStack>
  );
};

const WindowsXPChevron = () => {
  return (
    <View
      style={{
        backgroundColor: "#D1DDF9",
        width: 16,
        height: 16,
        alignItems: "center",
        justifyContent: "center",
        borderColor: BLUE_COLOR,
        borderWidth: 1,
        borderStyle: "solid",
      }}
    >
      <Text
        style={{
          color: "#6D7B9E",
        }}
      >
        ▼
      </Text>
    </View>
  );
};

const WindowsXpButton = ({
  children,
  onPress,
}: {
  children: string;
  onPress: () => void;
}) => {
  return (
    <Pressable onPress={onPress} style={styles.buttonContainer}>
      <View style={styles.buttonContentContainer}>
        <HStack spacing={4}>
          <Text style={styles.buttonContent}>{children}</Text>
          <WindowsXPChevron />
        </HStack>
      </View>
    </Pressable>
  );
};

export const Composable = () => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));

  const handleOpenPicker = useCallback(() => {
    setIsPickerVisible(true);
  }, []);

  const handleDayPress = useCallback<CalendarOnDayPress>((dateId, date) => {
    setCurrentDate(date);
  }, []);

  return (
    <View style={styles.background}>
      <Window title="@marceloterreiro/flash-calendar demo">
        <VStack spacing={12} justifyContent="flex-start">
          <Text>
            This is a Windows's XP calendar style, showcasing how easy it is to
            compose and build your own calendars.
          </Text>

          <WindowsXpButton onPress={handleOpenPicker}>
            {format(currentDate, "dd/MM/yyyy")}
          </WindowsXpButton>

          {isPickerVisible && (
            <View style={{}}>
              <CalendarList
                calendarInitialMonthId={toDateId(currentDate)}
                onDayPress={handleDayPress}
                renderItem={({ item }) => (
                  <VStack spacing={0}>
                    <Calendar.Row.Month>{item.id}</Calendar.Row.Month>
                  </VStack>
                )}
              />
            </View>
          )}
        </VStack>
      </Window>
    </View>
  );
};
//#endregion
