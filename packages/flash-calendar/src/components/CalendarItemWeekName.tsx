import type { ReactNode } from "react";
import { memo, useMemo } from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { tokens } from "@/helpers/tokens";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: tokens.spacing[6],
  },
  content: {
    color: tokens.colors.content.primary,
  },
});

type CalendarItemWeekNameTheme = {
  container?: ViewStyle;
  content?: TextStyle;
};

export interface CalendarItemWeekNameProps {
  children: ReactNode;
  /**
   * The height of the week name, needed to correctly measure the calendar's
   */
  height: number;
  /** The theme of the week name, useful for customizing the component. */
  theme?: CalendarItemWeekNameTheme;
}

export const CalendarItemWeekName = memo(
  ({ children, height, theme }: CalendarItemWeekNameProps) => {
    const { containerStyles, contentStyles } = useMemo(() => {
      const containerStyles = [styles.container, { height }, theme?.container];
      const contentStyles = [styles.content, theme?.content];
      return { containerStyles, contentStyles };
    }, [height, theme?.container, theme?.content]);

    return (
      <View style={containerStyles}>
        <Text style={contentStyles}>{children}</Text>
      </View>
    );
  }
);
