import type { ReactNode } from "react";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

export const CALENDAR_ROW_MONTH_HEIGHT = 20;

const styles = StyleSheet.create({
  container: {
    height: CALENDAR_ROW_MONTH_HEIGHT,
    width: "100%",
  },
  content: {
    textAlign: "center",
  },
});

export interface CalendarRowMonthProps {
  children: ReactNode;
}

export const CalendarRowMonth = memo(({ children }: CalendarRowMonthProps) => (
  <View style={styles.container}>
    <Text style={styles.content}>{children}</Text>
  </View>
));
