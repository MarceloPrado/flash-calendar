import type {
  CalendarMonth,
  CalendarOnDayPress,
  CalendarTheme,
} from "@marceloterreiro/flash-calendar";
import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";
import type { FlashListProps } from "@shopify/flash-list";
import type { Meta } from "@storybook/react";
import { useCallback, useMemo, useState } from "react";
import { Alert, Text, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { VStack } from "@/components/VStack";

const CalendarMeta: Meta<typeof Calendar> = {
  title: "Calendar.List/Github Issues",
  decorators: [],
};

export default CalendarMeta;

// See more: https://github.com/MarceloPrado/flash-calendar/issues/11
export const Issue11 = () => {
  const act = [
    { endId: "2024-01-31", startId: "2024-01-30" },
    { endId: "2024-01-12", startId: "2024-01-10" },
    { endId: "2024-03-07", startId: "2024-02-28" },
    { endId: "2024-04-10", startId: "2024-04-01" },
    { endId: "2024-01-19", startId: "2024-01-18" },
    { endId: "2024-02-06", startId: "2024-02-02" },
    { endId: "2024-01-26", startId: "2024-01-25" },
    { endId: "2024-01-05", startId: "2024-01-02" },
  ];
  const dis = ["2024-02-02", "2024-02-06", "2024-02-19", "2024-02-27"];

  return (
    <Calendar.List
      calendarActiveDateRanges={act}
      calendarDisabledDateIds={dis}
      calendarFormatLocale="de-DE"
      onCalendarDayPress={(day) => {
        console.log("pressed");
      }}
    />
  );
};

const today = toDateId(new Date());

// See more: https://github.com/MarceloPrado/flash-calendar/issues/16
export const Issue16 = () => {
  const [selectedDate, setSelectedDate] = useState(today);

  return (
    <View style={{ flex: 1 }}>
      <Text>Selected date: {selectedDate}</Text>
      <Calendar.List
        calendarActiveDateRanges={[
          {
            startId: "2024-02-25",
            endId: "2024-03-02",
          },
        ]}
        calendarInitialMonthId="2024-01-01"
        calendarMinDateId="2023-02-27"
        onCalendarDayPress={setSelectedDate}
      />
    </View>
  );
};

const disabledRange = {
  start: "2024-06-01",
  end: "2024-06-15",
};

function isDisabled(dateId: string) {
  return dateId >= disabledRange.start && dateId <= disabledRange.end;
}

// See more: https://github.com/MarceloPrado/flash-calendar/issues/38
export const Issue38 = () => {
  const [selectedDate, setSelectedDate] = useState(today);
  const { colors } = useTheme();

  const customTheme = useMemo(() => {
    const theme: CalendarTheme = {
      itemDay: {
        idle: ({ id }) => {
          if (isDisabled(id)) {
            return {
              container: {},
              content: {
                color: colors.content.disabled,
              },
            };
          }
          return {};
        },
      },
    };

    return theme;
  }, [colors.content.disabled]);

  const handleCalendarDayPress: CalendarOnDayPress = useCallback((dateId) => {
    if (isDisabled(dateId)) {
      Alert.alert("This date is disabled");
      return;
    }
    setSelectedDate(dateId);
  }, []);

  const calendarActiveDateRanges = useMemo(() => {
    if (!selectedDate) return [];
    return [{ startId: selectedDate, endId: selectedDate }];
  }, [selectedDate]);

  return (
    <View style={{ flex: 1 }}>
      <Text>Selected date: {selectedDate}</Text>
      <Calendar.List
        calendarActiveDateRanges={calendarActiveDateRanges}
        calendarInitialMonthId="2024-06-01"
        onCalendarDayPress={handleCalendarDayPress}
        theme={customTheme}
      />
    </View>
  );
};

// See more at: https://github.com/MarceloPrado/flash-calendar/issues/65
export const ListenToVisibleMonth = () => {
  const [selectedDate, setSelectedDate] = useState(today);
  const [visibleMonth, setVisibleMonth] = useState(today);

  const handleViewableItemsChanged = useCallback<
    NonNullable<FlashListProps<CalendarMonth>["onViewableItemsChanged"]>
  >(({ viewableItems }) => {
    const firstVisibleItem = viewableItems.find((item) => item.isViewable);

    if (firstVisibleItem) {
      setVisibleMonth(firstVisibleItem.item.id);
    }
  }, []);

  return (
    <View style={{ flex: 1, gap: 24 }}>
      <View style={{ gap: 12 }}>
        <Text>Selected date: {selectedDate}</Text>
        <Text>Visible month: {visibleMonth}</Text>
      </View>
      <Calendar.List
        calendarActiveDateRanges={[{ startId: today, endId: today }]}
        calendarInitialMonthId="2024-06-01"
        onCalendarDayPress={setSelectedDate}
        onViewableItemsChanged={handleViewableItemsChanged}
      />
    </View>
  );
};
