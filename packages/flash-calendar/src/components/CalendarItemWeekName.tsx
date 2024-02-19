import type { ReactNode } from "react";
import { useMemo } from "react";
import type { TextStyle, ViewStyle } from "react-native";
import { StyleSheet, Text, View } from "react-native";

import { lightTheme } from "@/helpers/tokens";
import { useTheme } from "@/hooks/useTheme";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: lightTheme.spacing[6],
  },
  content: {},
});

interface CalendarItemWeekNameTheme {
  container?: ViewStyle;
  content?: TextStyle;
}

export interface CalendarItemWeekNameProps {
  children: ReactNode;
  /**
   * The height of the week name, needed to correctly measure the calendar's
   */
  height: number;
  /** The theme of the week name, useful for customizing the component. */
  theme?: CalendarItemWeekNameTheme;
}

export const CalendarItemWeekName = ({
  children,
  height,
  theme,
}: CalendarItemWeekNameProps) => {
  const { colors } = useTheme();
  const { containerStyles, contentStyles } = useMemo(() => {
    const containerStyles = [styles.container, { height }, theme?.container];
    const contentStyles = [
      styles.content,
      { color: colors.content.primary },
      theme?.content,
    ];
    return { containerStyles, contentStyles };
  }, [colors.content.primary, height, theme?.container, theme?.content]);

  return (
    <View style={containerStyles}>
      <Text style={contentStyles}>{children}</Text>
    </View>
  );
};
