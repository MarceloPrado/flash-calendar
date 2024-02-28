import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";
import type { Meta } from "@storybook/react";
import React, { useState } from "react";
import { Text, View } from "react-native";

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
