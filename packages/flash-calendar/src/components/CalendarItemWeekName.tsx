import type { ReactNode } from "react";
import { memo, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { DAY_HEIGHT } from "@/components/CalendarItemDay";
import { tokens } from "@/helpers/tokens";

export const CALENDAR_ITEM_WEEK_DAY_HEIGHT = DAY_HEIGHT;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    height: CALENDAR_ITEM_WEEK_DAY_HEIGHT,
    justifyContent: "center",
    padding: tokens.spacing[6],
  },
});

export interface CalendarItemWeekNameProps {
  children: ReactNode;
}

export const CalendarItemWeekName = memo(
  ({ children }: CalendarItemWeekNameProps) => {
    const textStyles = useMemo(() => {
      return { color: tokens.colors.content.primary };
    }, []);

    return (
      <View style={styles.container}>
        <Text style={textStyles}>{children}</Text>
      </View>
    );
  }
);
