import {
  Calendar,
  CalendarProps,
  CalendarTheme,
  useCalendar,
} from "@marceloterreiro/flash-calendar";
import { memo } from "react";
import { View, StyleSheet } from "react-native";
import { textStyles } from "src/components/ThemeableCalendar/WindowsXpCalendar/WindowsXpText";
import { windowsXpTokens } from "src/components/ThemeableCalendar/WindowsXpCalendar/utils";

const DAY_HEIGHT = 30;
const MONTH_HEADER_HEIGHT = 40;

export const WINDOWS_XP_CALENDAR_HEIGHT = 6 * DAY_HEIGHT + MONTH_HEADER_HEIGHT;

const styles = StyleSheet.create({
  weekDivider: {
    height: 2,
    backgroundColor: windowsXpTokens.colors.content.inverse.primary,
    position: "absolute",
    left: 4,
    right: 4,
    bottom: 0,
  },
});

const calendarTheme: CalendarTheme = {
  rowMonth: {
    container: { backgroundColor: windowsXpTokens.colors.accent },
    content: {
      ...textStyles.windowsXpText,
    },
  },
  itemWeekName: { content: { color: windowsXpTokens.colors.accent } },
};

export const WindowsXpCalendar = memo((props: CalendarProps) => {
  const { calendarRowMonth, weekDaysList, weeksList } = useCalendar(props);

  return (
    <View
      style={{
        backgroundColor: "white",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: windowsXpTokens.colors.accent,
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
});
