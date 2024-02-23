import { Calendar } from "@marceloterreiro/flash-calendar";
import { View } from "react-native";

export const CalendarListCompact = () => {
  return (
    <View style={{ width: 300, flex: 1 }}>
      <Calendar.List
        calendarDayHeight={28}
        calendarMonthHeaderHeight={20}
        calendarRowHorizontalSpacing={0}
        calendarRowVerticalSpacing={4}
        calendarSpacing={10}
        onCalendarDayPress={(dateId) => console.log(`Pressed ${dateId}`)}
      />
    </View>
  );
};
