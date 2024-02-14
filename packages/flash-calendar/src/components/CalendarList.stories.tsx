import type { Meta, StoryObj } from "@storybook/react";
import { add, format, startOfMonth, sub } from "date-fns";
import { useCallback, useRef, useState } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from "react-native";

import {
  Calendar,
  CalendarProps,
  CalendarOnDayPress,
  CalendarListRef,
  CalendarTheme,
} from "@/components";
import { HStack } from "@/components/HStack";
import { VStack } from "@/components/VStack";
import { paddingDecorator } from "@/developer/decorators";
import { loggingHandler } from "@/developer/loggginHandler";
import { fromDateId, toDateId } from "@/helpers/dates";
import { useCalendar } from "@/hooks/useCalendar";

const CalendarListMeta: Meta<typeof Calendar.List> = {
  title: "Calendar.List",
  component: Calendar.List,
  argTypes: {},
  args: {
    onDayPress: loggingHandler("onDayPress"),
    calendarRowVerticalSpacing: 8,
    calendarRowHorizontalSpacing: 8,
  },
  decorators: [paddingDecorator],
};

export default CalendarListMeta;

export const Default: StoryObj<typeof Calendar.List> = {};

export const WithCustomSpacing: StoryObj<typeof Calendar.List> = {
  args: {
    calendarRowVerticalSpacing: 0,
    calendarRowHorizontalSpacing: 4,
  },
};

export const WithDateRangeAndDisabledDates: StoryObj<typeof Calendar.List> = {
  args: {
    calendarActiveDateRanges: [
      {
        startId: "2024-01-15",
        endId: "2024-01-28",
      },
    ],
    calendarDisabledDateIds: ["2024-01-01", "2024-01-02"],
    calendarInitialMonthId: "2024-01-01",
  },
};

export const WithShortRanges: StoryObj<typeof Calendar.List> = {
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

      <Calendar.List
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
        <Calendar.List
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
        <Calendar.List
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
  windowsXpText: {
    color: "#ffffff",
    width: "100%",
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

  weekDivider: {
    height: 2,
    backgroundColor: "#000000",
    position: "absolute",
    left: 4,
    right: 4,
    bottom: 0,
  },
});

const WindowsXpText = ({
  children,
  style,
}: {
  children: string;
  style?: TextStyle;
}) => {
  return <Text style={[styles.windowsXpText, style]}>{children}</Text>;
};

const WindowHeader = ({ children }: { children: string }) => {
  return (
    <View style={styles.windowHeaderContainer}>
      <WindowsXpText>{children}</WindowsXpText>
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

const DAY_HEIGHT = 30;
const MONTH_HEADER_HEIGHT = 40;

const calendarTheme: CalendarTheme = {
  rowMonth: {
    container: { backgroundColor: BLUE_COLOR },
    content: {
      ...styles.windowsXpText,
    },
  },
  itemWeekName: { content: { color: BLUE_COLOR } },
};

const WindowsXpCalendar = (props: CalendarProps) => {
  const { calendarRowMonth, weekDaysList, weeksList } = useCalendar(props);

  return (
    <View
      style={{
        backgroundColor: "white",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: BLUE_COLOR,
      }}
    >
      <Calendar.Row.Month
        height={MONTH_HEADER_HEIGHT}
        theme={calendarTheme.rowMonth}
      >
        {calendarRowMonth}
      </Calendar.Row.Month>

      <Calendar.Row.Week spacing={4}>
        {weekDaysList.map((day, i) => (
          <Calendar.Item.WeekName
            height={DAY_HEIGHT}
            key={i}
            theme={calendarTheme.itemWeekName}
          >
            {day}
          </Calendar.Item.WeekName>
        ))}
        <View style={styles.weekDivider} />
      </Calendar.Row.Week>

      {weeksList.map((week, i) => (
        <Calendar.Row.Week key={i}>
          {week.map((day) => {
            let state = day.state;
            // FIXME: this is a terrible API. It should come correctly mapped from the hook.
            // We only want to override idle states.
            if (state === "idle") {
              if (day.isToday) {
                state = "today";
              }
            }

            return (
              <Calendar.Item.Day.Container
                dayHeight={DAY_HEIGHT}
                daySpacing={4}
                isStartOfWeek={day.isStartOfWeek}
                key={day.id}
              >
                <Calendar.Item.Day
                  height={DAY_HEIGHT}
                  metadata={{
                    ...day,
                    state,
                  }}
                  onPress={props.onDayPress}
                >
                  {day.displayLabel}
                </Calendar.Item.Day>
              </Calendar.Item.Day.Container>
            );
          })}
        </Calendar.Row.Week>
      ))}
    </View>
  );
};

export const Composable = () => {
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
            <View
              style={{
                height: MONTH_HEADER_HEIGHT + DAY_HEIGHT + DAY_HEIGHT * 6,
              }}
            >
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
      </Window>
    </View>
  );
};
//#endregion
