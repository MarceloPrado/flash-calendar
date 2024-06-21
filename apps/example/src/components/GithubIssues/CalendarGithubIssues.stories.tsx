import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";
import type { Meta } from "@storybook/react";
import { subMonths } from "date-fns";
import { useCallback, useState } from "react";
import { Button, StyleSheet, View } from "react-native";

const CalendarMeta: Meta<typeof Calendar> = {
  title: "Calendar/Github Issues",
  decorators: [],
};

export default CalendarMeta;

export const Isseu29 = () => {
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(
    new Date("2020-03-04")
  );

  const handlePreviousMonth = useCallback(() => {
    const newDate = subMonths(currentCalendarMonth, 1);
    setCurrentCalendarMonth(newDate);
  }, [currentCalendarMonth]);

  const handleMonthYearChange = useCallback((month: number, year: number) => {
    const newDate = new Date(year, month);
    setCurrentCalendarMonth(newDate);
  }, []);

  return (
    <View style={styles.container}>
      <Calendar
        calendarMonthId={toDateId(currentCalendarMonth)}
        getCalendarDayFormat={(date) => {
          return date.getUTCDate().toString();
        }}
        onCalendarDayPress={(dateId) => {
          console.log(`Clicked on ${dateId}`);
        }}
      />
      <View style={styles.footer}>
        <Button
          onPress={() => {
            handleMonthYearChange(
              new Date(currentCalendarMonth).getMonth(),
              2020
            );
          }}
          title="Set Year to 2020"
        />
        <Button onPress={handlePreviousMonth} title="Reduce Month by 1" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 200,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
