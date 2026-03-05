import type { ReactNode } from "react";
import { memo } from "react";
import type { TextStyle, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";

import { Text } from "@/components/Text";
import { useTheme } from "@/hooks/useTheme";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    textAlign: "center",
    width: "100%",
  },
});

interface CalendarRowMonthTheme {
  container?: ViewStyle;
  content?: TextStyle;
}

export interface CalendarRowMonthProps {
  children: ReactNode;
  /**
   * The height of the month row, needed to correctly measure the calendar's
   * height.
   */
  height: number;
  /** The theme of the month row, useful for customizing the component. */
  theme?: CalendarRowMonthTheme;
}

export const CalendarRowMonth = memo(function CalendarRowMonth({
  children,
  height,
  theme,
}: CalendarRowMonthProps) {
  const baseTheme = useTheme();
  const containerStyles = [styles.container, { height }, theme?.container];
  const contentStyles = [
    styles.content,
    { color: baseTheme.colors.content.primary },
    theme?.content,
  ];

  return (
    <View style={containerStyles}>
      <Text style={contentStyles}>{children}</Text>
    </View>
  );
});
